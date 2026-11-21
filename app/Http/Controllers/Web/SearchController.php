<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeList;
use App\Models\Tag;
use App\Support\ArabicSearch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::with(['city', 'user', 'anonymousAuthor', 'tags'])
            ->where('status', 'approved')
            ->latest();

        $search = trim((string) ($request->input('search') ?? $request->input('q', '')));

        // Apply filters
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                ArabicSearch::whereLikeFolded($q, 'recipes.name', $search);
                ArabicSearch::whereLikeFolded($q, 'recipes.description', $search, or: true);
                $q->orWhereHas('city', fn ($c) => ArabicSearch::whereLikeFolded($c, 'cities.name', $search))
                    ->orWhereHas('tags', fn ($t) => ArabicSearch::whereLikeFolded($t, 'tags.name', $search))
                    ->orWhereHas('ingredients', fn ($i) => ArabicSearch::whereLikeFolded($i, 'ingredients.name', $search));
            });
        }

        if ($request->filled('city')) {
            $city = $request->city;
            $query->whereHas('city', function ($q) use ($city) {
                $q->where('id', $city)->orWhere('slug', $city);
            });
        }

        if ($request->filled('tag')) {
            $tag = $request->tag;
            $query->whereHas('tags', function ($q) use ($tag) {
                $q->where('id', $tag)->orWhere('slug', $tag);
            });
        }

        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $perPage = min(max((int) $request->input('per_page', 12), 10), 100);
        $recipes = $query->paginate($perPage)->withQueryString();

        $allCities = Cache::remember('all_cities_select', 600, fn () => City::select('id', 'name', 'slug')->get());
        $allTags = Cache::remember('all_tags_select', 600, fn () => Tag::select('id', 'name', 'slug')->get());

        $filters = $request->only(['search', 'city', 'tag', 'difficulty', 'per_page']);
        if ($search !== '' && empty($filters['search'])) {
            $filters['search'] = $search;
        }

        return Inertia::render('Search/Index', [
            'recipes' => $recipes->through(fn ($r) => $this->formatRecipeCard($r)),
            'cities' => $allCities,
            'tags' => $allTags,
            'filters' => $filters,
        ]);
    }

    /**
     * Unified JSON search endpoint for the global command palette.
     */
    public function global(Request $request): JsonResponse
    {
        $q = trim((string) $request->query('q', ''));
        if (mb_strlen($q) < 2) {
            return response()->json([
                'recipes' => [],
                'cities' => [],
                'lists' => [],
                'tags' => [],
                'ingredients' => [],
            ]);
        }

        $q = mb_substr($q, 0, 80);

        $recipes = Recipe::approved()
            ->with(['city:id,name,slug'])
            ->where(function ($query) use ($q) {
                ArabicSearch::whereLikeFolded($query, 'recipes.name', $q);
                ArabicSearch::whereLikeFolded($query, 'recipes.description', $q, or: true);
                $query->orWhereHas('city', fn ($c) => ArabicSearch::whereLikeFolded($c, 'cities.name', $q))
                    ->orWhereHas('tags', fn ($t) => ArabicSearch::whereLikeFolded($t, 'tags.name', $q))
                    ->orWhereHas('ingredients', fn ($i) => ArabicSearch::whereLikeFolded($i, 'ingredients.name', $q));
            })
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn (Recipe $r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'image_url' => $r->image_url,
                'city' => $r->city?->name,
                'city_slug' => $r->city?->slug,
                'difficulty' => $r->difficulty,
                'time_needed' => $r->time_needed,
            ])
            ->values();

        $cities = City::query()
            ->withCount(['approvedRecipes as recipes_count'])
            ->where(fn ($query) => ArabicSearch::whereLikeFolded($query, 'cities.name', $q))
            ->orderByDesc('recipes_count')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'slug'])
            ->map(fn (City $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'recipes_count' => (int) $c->recipes_count,
            ])
            ->values();

        $lists = RecipeList::public()
            ->withCount(['recipes as recipes_count' => fn ($query) => $query->where('recipes.status', 'approved')])
            ->where(function ($query) use ($q) {
                ArabicSearch::whereLikeFolded($query, 'lists.name', $q);
                ArabicSearch::whereLikeFolded($query, 'lists.description', $q, or: true);
            })
            ->latest()
            ->limit(4)
            ->get(['id', 'name', 'slug'])
            ->map(fn (RecipeList $list) => [
                'id' => $list->id,
                'name' => $list->name,
                'slug' => $list->slug,
                'recipes_count' => (int) $list->recipes_count,
            ])
            ->values();

        $tags = Tag::query()
            ->withCount(['recipes as recipes_count' => fn ($query) => $query->where('recipes.status', 'approved')])
            ->where(fn ($query) => ArabicSearch::whereLikeFolded($query, 'tags.name', $q))
            ->orderByDesc('recipes_count')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name', 'slug'])
            ->map(fn (Tag $tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'recipes_count' => (int) $tag->recipes_count,
            ])
            ->values();

        $ingredients = Ingredient::query()
            ->withCount(['recipes as recipes_count' => fn ($query) => $query->where('recipes.status', 'approved')])
            ->where(function ($query) use ($q) {
                ArabicSearch::whereLikeFolded($query, 'ingredients.name', $q);
                ArabicSearch::whereLikeFolded($query, 'ingredients.normalized_name', $q, or: true);
            })
            ->orderByDesc('recipes_count')
            ->orderBy('name')
            ->limit(5)
            ->get(['id', 'name'])
            ->map(fn (Ingredient $ingredient) => [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'recipes_count' => (int) $ingredient->recipes_count,
            ])
            ->values();

        return response()->json([
            'recipes' => $recipes,
            'cities' => $cities,
            'lists' => $lists,
            'tags' => $tags,
            'ingredients' => $ingredients,
        ]);
    }

    private function formatRecipeCard($recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_path
                ? asset('storage/'.$recipe->image_path)
                : null,
            'city' => $recipe->city?->name,
            'city_slug' => $recipe->city?->slug,
            'time_needed' => $recipe->time_needed,
            'difficulty' => $recipe->difficulty,
            'author_name' => $recipe->author_name,
            'tags' => $recipe->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
        ];
    }
}
