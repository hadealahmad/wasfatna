<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;
use App\Models\Ingredient;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

        foreach ($recipes as $index => $recipeData) {
            try {
                DB::beginTransaction();

                // Find or create city
                $cityId = null;
                if (!empty($recipeData['city'])) {
                    $city = City::firstOrCreate(
                        ['name' => $recipeData['city']],
                        ['slug' => \Str::slug($recipeData['city'])]
                    );
                    $cityId = $city->id;
                }

                // Handle time_needed
                $timeNeeded = null;
                if (!empty($recipeData['time_needed'])) {
                    if (is_string($recipeData['time_needed'])) {
                        $timeNeeded = $recipeData['time_needed'];
                    } else {
                        $timeNeeded = $recipeData['time_needed'];
                    }
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
                if (!empty($recipeData['author'])) {
                    $recipe->is_anonymous = true;
                    $author = \App\Models\AnonymousAuthor::firstOrCreate(['name' => $recipeData['author']]);
                    $recipe->anonymous_author_id = $author->id;
                }


                // Handle steps
                if (!empty($recipeData['steps'])) {
                    $recipe->steps = $recipeData['steps'];
                }

                // Handle image from URL (Google Drive or direct link)
                if (!empty($recipeData['image_link'])) {
                    try {
                        $imageUrl = $this->parseImageUrl($recipeData['image_link']);
                        if ($imageUrl) {
                            $imageContent = @file_get_contents($imageUrl);
                            if ($imageContent) {
                                $filename = 'recipes/' . uniqid() . '.jpg';
                                Storage::disk('public')->put($filename, $imageContent);
                                $recipe->image_path = $filename;
                            }
                        }
                    } catch (\Exception $e) {
                        // Continue without image
                    }
                }

                $recipe->save();

                // Sync ingredients to pivot table
                if (!empty($recipeData['ingredients']) && is_array($recipeData['ingredients'])) {
                    $ingredientsData = [];
                    foreach ($recipeData['ingredients'] as $item) {
                        if (empty($item['name'])) continue;
                        
                        $ingredient = Ingredient::firstOrCreate(['name' => $item['name']]);
                        $ingredientsData[$ingredient->id] = [
                            'amount' => $item['amount'] ?? '',
                            'unit' => $item['unit'] ?? '',
                            'group' => $item['group'] ?? 'المكونات',
                        ];
                    }
                    if (!empty($ingredientsData)) {
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
            // Extract file ID
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
}
