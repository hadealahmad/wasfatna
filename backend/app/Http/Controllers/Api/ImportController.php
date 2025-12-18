<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnonymousAuthor;
use App\Models\City;
use App\Models\Recipe;
use App\Models\Ingredient;
use App\Services\ImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImportController extends Controller
{
    /**
     * City name to slug mapping.
     */
    private const CITY_MAP = [
        "شامية" => "damascus",
        "دمشق" => "damascus",
        "مو لمدينة محددة/لأكثر من مدينة" => "general",
        "عام" => "general",
        "درعاوية" => "daraa",
        "حلبية" => "aleppo",
        "حمصية" => "homs",
        "حموية" => "hama",
        "ساحلية" => "latakia",
        "ديرية" => "deir-ez-zor",
        "ادلبية" => "idlib",
    ];

    /**
     * Difficulty mapping to database enum.
     */
    private const DIFFICULTY_MAP = [
        "سهلة كتير" => "سهلة جداً",
        "متوسطة" => "متوسطة",
        "صعبة كتير" => "صعبة جداً",
        "سهلة" => "سهلة",
        "صعبة" => "صعبة",
        "صعبة جداً" => "صعبة جداً",
        "سهلة جداً" => "سهلة جداً",
    ];

    public function __construct(
        private ImageService $imageService
    ) {}

    /**
     * Import recipes from JSON data.
     */
    public function importRecipes(Request $request): JsonResponse
    {
        $request->validate([
            'recipes' => 'required|array|min:1',
            'recipes.*.name' => 'required|string',
            'recipes.*.author' => 'nullable|string',
            'recipes.*.image_link' => 'nullable|string',
            'recipes.*.time_needed' => 'nullable|string',
            'recipes.*.servings' => 'nullable|string',
            'recipes.*.city' => 'nullable|string',
            'recipes.*.difficulty' => 'nullable|string',
            'recipes.*.ingredients' => 'nullable|array',
            'recipes.*.steps' => 'nullable|array',
        ]);

        $recipes = $request->input('recipes');
        $results = [
            'total' => count($recipes),
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        // Ensure recipes directory exists
        Storage::disk('public')->makeDirectory('recipes');

        foreach ($recipes as $index => $data) {
            try {
                $this->importSingleRecipe($data);
                $results['success']++;
            } catch (\Exception $e) {
                $results['failed']++;
                $results['errors'][] = [
                    'index' => $index,
                    'name' => $data['name'] ?? 'Unknown',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'message' => "تم استيراد {$results['success']} وصفة من {$results['total']}",
            'results' => $results,
        ]);
    }

    /**
     * Import a single recipe.
     */
    private function importSingleRecipe(array $data): Recipe
    {
        // 1. Handle Author
        $authorName = $data['author'] ?? 'مجهول';
        $author = AnonymousAuthor::firstOrCreate(['name' => $authorName]);

        // 2. Handle City
        $cityName = $data['city'] ?? '';
        $citySlug = self::CITY_MAP[$cityName] ?? 'general';
        $city = City::where('slug', $citySlug)->first();

        // 3. Handle Difficulty
        $difficultyRaw = $data['difficulty'] ?? 'متوسطة';
        $difficulty = self::DIFFICULTY_MAP[$difficultyRaw] ?? 'متوسطة';

        // 4. Handle Image (download from Google Drive)
        $imagePath = null;
        if (!empty($data['image_link'])) {
            $imagePath = $this->downloadGoogleDriveImage($data['image_link']);
        }

        // 5. Create Recipe
        $recipe = Recipe::create([
            'name' => $data['name'],
            'slug' => null, // Let model handle generation
            'image_path' => $imagePath,
            'time_needed' => ['raw' => $data['time_needed'] ?? ''],
            'servings' => $data['servings'] ?? '',
            'city_id' => $city?->id,
            'user_id' => null,
            'anonymous_author_id' => $author->id,
            'is_anonymous' => true,
            'steps' => $data['steps'] ?? [],
            'difficulty' => $difficulty,
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        // 6. Sync Ingredients
        if (!empty($data['ingredients'])) {
            $this->syncIngredients($recipe, $data['ingredients']);
        }

        return $recipe;
    }

    /**
     * Download image from Google Drive.
     */
    private function downloadGoogleDriveImage(string $url): ?string
    {
        $driveId = $this->extractDriveId($url);
        if (!$driveId) {
            return null;
        }

        $downloadUrl = "https://drive.google.com/uc?export=download&id={$driveId}";

        try {
            // Download the file
            $response = Http::timeout(30)->get($downloadUrl);

            if (!$response->successful()) {
                throw new \Exception("Failed to download image: HTTP {$response->status()}");
            }

            $content = $response->body();

            // Check if it's an HTML page (permission denied)
            if (str_starts_with($content, '<!DOCTYPE html') || str_starts_with($content, '<html')) {
                throw new \Exception("Image link is not publicly accessible");
            }

            // Save to temp file
            $tempPath = storage_path('app/temp_' . Str::uuid() . '.jpg');
            file_put_contents($tempPath, $content);

            // Process with ImageService
            $result = $this->imageService->processFromFile($tempPath);

            // Clean up temp file
            if (file_exists($tempPath)) {
                unlink($tempPath);
            }

            if ($result['success']) {
                return $result['path'];
            }

            throw new \Exception($result['error'] ?? 'Image processing failed');
        } catch (\Exception $e) {
            // Log but don't fail the entire import for image issues
            \Log::warning("Failed to download image for Drive ID {$driveId}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Extract Google Drive file ID from URL.
     */
    private function extractDriveId(string $url): ?string
    {
        if (preg_match('/id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    /**
     * Sync ingredients with detailed pivot data.
     * Adapted from ImportRecipes command.
     */
    private function syncIngredients(Recipe $recipe, array $ingredients): void
    {
        $syncData = [];

        foreach ($ingredients as $key => $value) {
            // Handle grouped ingredients: "Sauce" => [ {name: "Tomato", ...}, ... ]
            if (is_string($key) && is_array($value)) {
                $groupName = $key;
                foreach ($value as $item) {
                    $this->processIngredientItem($item, $syncData, $groupName);
                }
            }
            // Handle flat list items
            else {
                $this->processIngredientItem($value, $syncData);
            }
        }

        $recipe->ingredients()->sync($syncData);
    }

    /**
     * Process a single ingredient item.
     */
    private function processIngredientItem(array|string $item, array &$syncData, ?string $group = null): void
    {
        if (is_string($item)) {
            $name = $item;
            $amount = null;
            $unit = null;
            $descriptor = null;
        } else {
            $name = $item['name'] ?? null;
            $amount = $item['amount'] ?? null;
            $unit = $item['unit'] ?? null;
            $descriptor = $item['descriptor'] ?? null;
            $group = $item['group'] ?? $group;
        }

        if (!$name) return;

        $normalized = Ingredient::normalize($name);

        $ingredient = Ingredient::firstOrCreate(
            ['normalized_name' => $normalized],
            ['name' => $name]
        );

        $syncData[$ingredient->id] = [
            'amount' => $amount,
            'unit' => $unit,
            'ingredient_descriptor' => $descriptor,
            'group' => $group,
        ];
    }
}
