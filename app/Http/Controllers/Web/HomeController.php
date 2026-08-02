<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $page = $request->input('page', 1);

        $recipesQuery = Recipe::approved()
            ->with(['city', 'user', 'anonymousAuthor', 'tags']);
            
        // Basic filtering if needed on homepage?
        // (Usually homepage is handled by separate search page in some UIs, 
        // but looking at old code it had SearchFilters on home too)
        
        if ($request->filled('search')) {
            $search = $request->search;
            $recipesQuery->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('city', fn($c) => $c->where('name', 'LIKE', "%{$search}%"))
                  ->orWhereHas('tags', fn($t) => $t->where('name', 'LIKE', "%{$search}%"))
                  ->orWhereHas('ingredients', fn($i) => $i->where('name', 'LIKE', "%{$search}%"));
            });
        }

        if ($request->filled('city')) {
            $city = $request->city;
            $recipesQuery->whereHas('city', function ($q) use ($city) {
                $q->where('id', $city)->orWhere('slug', $city);
            });
        }

        if ($request->filled('tag')) {
            $tag = $request->tag;
            $recipesQuery->whereHas('tags', function ($q) use ($tag) {
                $q->where('id', $tag)->orWhere('slug', $tag);
            });
        }

        if ($request->filled('difficulty')) {
            $recipesQuery->where('difficulty', $request->difficulty);
        }

        // Get per_page from request, with sensible limits
        $perPage = min(max((int) $request->input('per_page', 12), 10), 100);
        
        $recipes = $recipesQuery->latest()->paginate($perPage)->withQueryString();

        $cities = City::withCount('recipes')
            ->orderBy('recipes_count', 'desc')
            ->limit(8)
            ->get();

        $allCities = City::select('id', 'name', 'slug')->get();
        $allTags = Tag::select('id', 'name', 'slug')->get();

        return Inertia::render('Welcome', [
            'recipes' => $recipes->through(fn($r) => $this->formatRecipeCard($r)),
            'cities' => $cities,
            'allCities' => $allCities,
            'allTags' => $allTags,
            'filters' => $request->only(['search', 'city', 'tag', 'difficulty', 'per_page']),
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
        ]);
    }

    private function formatRecipeCard($recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_path 
                ? asset('storage/' . $recipe->image_path) 
                : null,
            'city' => $recipe->city?->name,
            'city_slug' => $recipe->city?->slug,
            'time_needed' => $recipe->time_needed,
            'difficulty' => $recipe->difficulty,
            'author_name' => $recipe->author_name,
            'tags' => $recipe->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
        ];
    }
}
