<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AnonymousAuthor;
use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminImportController extends Controller
{
    public function index()
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'غير مصرح');
        }

        return Inertia::render('Dashboard/Import/Index');
    }

    public function import(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            abort(403, 'غير مصرح');
        }

        $request->validate([
            'recipes' => 'required|array|min:1',
            'recipes.*.name' => 'required|string|max:255',
        ]);

        $recipes = $request->recipes;
        $results = [
            'total' => count($recipes),
            'success' => 0,
            'failed' => 0,
            'errors' => [],
        ];

        $imageService = app(ImageService::class);

        foreach ($recipes as $index => $recipeData) {
            try {
                DB::beginTransaction();

                // Find or create city
                $cityId = null;
                if (! empty($recipeData['city'])) {
                    $city = City::firstOrCreate(
                        ['name' => $recipeData['city']],
                        ['slug' => Str::slug($recipeData['city'])]
                    );
                    $cityId = $city->id;
                }

                // Handle time_needed
                $timeNeeded = null;
                if (! empty($recipeData['time_needed'])) {
                    $timeNeeded = $recipeData['time_needed'];
                }

                // Create recipe
                $recipe = new Recipe();
                $recipe->name = $recipeData['name'];
                $recipe->difficulty = $recipeData['difficulty'] ?? 'متوسطة';
                $recipe->servings = $recipeData['servings'] ?? null;
                $recipe->time_needed = $timeNeeded;
                $recipe->city_id = $cityId;
                $recipe->user_id = Auth::id();
                $recipe->status = 'approved';

                // Handle author
                if (! empty($recipeData['author'])) {
                    $recipe->is_anonymous = true;
                    $author = AnonymousAuthor::firstOrCreate(['name' => $recipeData['author']]);
                    $recipe->anonymous_author_id = $author->id;
                }

                // Handle steps
                if (! empty($recipeData['steps'])) {
                    $recipe->steps = $recipeData['steps'];
                }

                // Handle image from URL (Google Drive or direct link)
                if (! empty($recipeData['image_link'])) {
                    try {
                        $imageUrl = $this->parseImageUrl($recipeData['image_link']);
                        if ($imageUrl && $this->isSafeExternalUrl($imageUrl)) {
                            $response = Http::timeout(10)->get($imageUrl);
                            if ($response->successful()) {
                                $imageContent = $response->body();
                                if ($imageContent && ! str_starts_with($imageContent, '<!DOCTYPE html') && ! str_starts_with($imageContent, '<html')) {
                                    $tempPath = storage_path('app/temp_'.Str::uuid().'.jpg');
                                    try {
                                        file_put_contents($tempPath, $imageContent);
                                        $processed = $imageService->processFromFile($tempPath);
                                        if ($processed['success'] && ! empty($processed['path'])) {
                                            $recipe->image_path = $processed['path'];
                                        }
                                    } finally {
                                        if (file_exists($tempPath)) {
                                            @unlink($tempPath);
                                        }
                                    }
                                }
                            }
                        }
                    } catch (\Exception $e) {
                        // Continue without image
                    }
                }

                $recipe->save();

                // Sync ingredients to pivot table
                if (! empty($recipeData['ingredients']) && is_array($recipeData['ingredients'])) {
                    $ingredientsData = [];
                    foreach ($recipeData['ingredients'] as $item) {
                        if (empty($item['name'])) {
                            continue;
                        }

                        $ingredient = Ingredient::firstOrCreate(['name' => $item['name']]);
                        $ingredientsData[$ingredient->id] = [
                            'amount' => $item['amount'] ?? '',
                            'unit' => $item['unit'] ?? '',
                            'group' => $item['group'] ?? 'المكونات',
                        ];
                    }
                    if (! empty($ingredientsData)) {
                        $recipe->ingredients()->sync($ingredientsData);
                    }
                }

                DB::commit();
                $results['success']++;
            } catch (\Exception $e) {
                DB::rollBack();
                $results['failed']++;
                $results['errors'][] = [
                    'index' => $index,
                    'name' => $recipeData['name'] ?? 'غير معروف',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'message' => "تم استيراد {$results['success']} من {$results['total']} وصفة",
            'results' => $results,
        ]);
    }

    private function parseImageUrl(string $url): ?string
    {
        // Handle Google Drive links
        if (str_contains($url, 'drive.google.com')) {
            if (preg_match('/[?&]id=([a-zA-Z0-9_-]+)/', $url, $matches)) {
                return "https://drive.google.com/uc?export=download&id={$matches[1]}";
            }
            if (preg_match('/\/d\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
                return "https://drive.google.com/uc?export=download&id={$matches[1]}";
            }
        }

        // Return direct URL
        if (filter_var($url, FILTER_VALIDATE_URL)) {
            return $url;
        }

        return null;
    }

    private function isSafeExternalUrl(string $url): bool
    {
        $parsed = parse_url($url);
        if (! $parsed || empty($parsed['scheme']) || empty($parsed['host'])) {
            return false;
        }

        $scheme = strtolower($parsed['scheme']);
        if (! in_array($scheme, ['http', 'https'], true)) {
            return false;
        }

        $host = strtolower(trim($parsed['host'], '[]'));
        $blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];

        if (in_array($host, $blockedHosts, true) || str_ends_with($host, '.local') || str_ends_with($host, '.internal')) {
            return false;
        }

        if (filter_var($host, FILTER_VALIDATE_IP)) {
            return filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
        }

        $resolvedIp = gethostbyname($host);
        if ($resolvedIp !== $host && filter_var($resolvedIp, FILTER_VALIDATE_IP)) {
            return filter_var($resolvedIp, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
        }

        return true;
    }
}
