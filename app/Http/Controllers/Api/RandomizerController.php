<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RandomizerController extends Controller
{
    /**
     * Get a random list of recipes, optionally filtering by excluded ingredients, city, difficulty, or tag.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'exclude_ingredients' => 'nullable|array',
            'exclude_ingredients.*' => 'integer|exists:ingredients,id',
            'exclude' => 'nullable',
            'city' => 'nullable|string|max:100',
            'difficulty' => 'nullable|string|max:50',
            'tag' => 'nullable|string|max:100',
            'count' => 'nullable|integer|min:1|max:50',
        ]);

        // Support both `exclude_ingredients[]` and legacy/compact `exclude=1,2,3`
        $excludedIds = [];
        if ($request->filled('exclude_ingredients')) {
            $excludedIds = array_merge($excludedIds, array_map('intval', (array) $request->input('exclude_ingredients')));
        }
        if ($request->filled('exclude')) {
            $rawExclude = $request->input('exclude');
            $parsed = is_array($rawExclude) ? $rawExclude : explode(',', (string) $rawExclude);
            $parsedIds = array_values(array_filter(array_map('intval', $parsed), fn (int $id) => $id > 0));
            $excludedIds = array_merge($excludedIds, $parsedIds);
        }
        $excludedIds = array_values(array_unique($excludedIds));

        $query = Recipe::with(['user', 'anonymousAuthor', 'city', 'tags'])
            ->where('status', 'approved')
            ->when(! empty($excludedIds), function ($q) use ($excludedIds) {
                $q->whereDoesntHave('ingredients', function ($iq) use ($excludedIds) {
                    $iq->whereIn('ingredients.id', $excludedIds);
                });
            })
            ->when($request->filled('city') && $request->input('city') !== 'all', function ($q) use ($request) {
                $city = $request->input('city');
                if (is_numeric($city)) {
                    $q->where('city_id', (int) $city);
                } else {
                    $q->whereHas('city', fn ($cq) => $cq->where('slug', $city));
                }
            })
            ->when($request->filled('difficulty') && $request->input('difficulty') !== 'all', function ($q) use ($request) {
                $q->where('difficulty', $request->input('difficulty'));
            })
            ->when($request->filled('tag') && $request->input('tag') !== 'all', function ($q) use ($request) {
                $tag = $request->input('tag');
                $q->whereHas('tags', function ($tq) use ($tag) {
                    if (is_numeric($tag)) {
                        $tq->where('tags.id', (int) $tag);
                    } else {
                        $tq->where('tags.slug', $tag);
                    }
                });
            });

        // Apply randomizer tags filter from settings (when user did not override with an explicit tag)
        if (! $request->filled('tag')) {
            $randomizerTags = json_decode((string) Setting::where('key', 'randomizer_tags')->value('value'), true);
            if (! empty($randomizerTags)) {
                $query->whereHas('tags', function ($q) use ($randomizerTags) {
                    $q->whereIn('tags.id', $randomizerTags);
                });
            }
        }

        $totalMatching = (clone $query)->count();
        $limit = min(max((int) $request->input('count', 30), 1), 50);

        $recipes = $query->inRandomOrder()->limit($limit)->get();

        return response()->json([
            'total_matching' => $totalMatching,
            'recipes' => $recipes->map(function ($recipe) {
                return [
                    'id' => $recipe->id,
                    'name' => $recipe->name,
                    'title' => $recipe->name,
                    'slug' => $recipe->slug,
                    'description' => $recipe->description,
                    'image_url' => $recipe->image_url,
                    'difficulty' => $recipe->difficulty,
                    'time_needed' => $recipe->time_needed,
                    'servings' => $recipe->servings,
                    'city' => $recipe->city ? [
                        'id' => $recipe->city->id,
                        'name' => $recipe->city->name,
                        'slug' => $recipe->city->slug,
                    ] : null,
                    'author' => ['name' => $recipe->author_name],
                    'tags' => $recipe->tags->map(fn ($tag) => [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                    ])->values(),
                ];
            }),
        ]);
    }
}
