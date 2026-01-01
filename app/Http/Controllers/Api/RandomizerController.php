<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RandomizerController extends Controller
{
    /**
     * Get a random list of recipes, optionally excluding recipes with specific ingredients.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'exclude_ingredients' => 'array',
            'exclude_ingredients.*' => 'integer|exists:ingredients,id',
        ]);

        $query = Recipe::with(['user', 'anonymousAuthor', 'city', 'tags']) // Eager load necessary relationships
            ->where('status', 'approved') // Ensure only approved recipes are picked
            ->when($request->filled('exclude_ingredients'), function ($q) use ($request) {
                $q->whereDoesntHave('ingredients', function ($iq) use ($request) {
                    $iq->whereIn('ingredients.id', $request->exclude_ingredients);
                });
            });

        // Apply randomizer tags filter from settings
        $randomizerTags = json_decode(\App\Models\Setting::where('key', 'randomizer_tags')->value('value'), true);
        if (!empty($randomizerTags)) {
            $query->whereHas('tags', function ($q) use ($randomizerTags) {
                $q->whereIn('tags.id', $randomizerTags);
            });
        }

        // Get 30 random recipes for the spinner
        $recipes = $query->inRandomOrder()->limit(30)->get();

        return response()->json([
            'recipes' => $recipes->map(function ($recipe) {
                return [
                    'id' => $recipe->id,
                    'name' => $recipe->name, // Frontend expects 'title' but we should standardise on 'name' or map it
                    'title' => $recipe->name, // alias for frontend compatibility if needed
                    'slug' => $recipe->slug,
                    'image_url' => $recipe->image_path ? asset('storage/' . $recipe->image_path) : null,
                    'city' => $recipe->city ? ['name' => $recipe->city->name] : null,
                    'author' => ['name' => $recipe->author_name],
                ];
            })
        ]);
    }
}
