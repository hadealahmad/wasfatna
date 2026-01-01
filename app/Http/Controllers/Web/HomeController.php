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
                  ->orWhereHas('city', fn($c) => $c->where('name', 'LIKE', "%{$search}%"));
            });
        }

        if ($request->filled('city')) {
            $recipesQuery->where('city_id', $request->city);
        }

        if ($request->filled('tag')) {
            $recipesQuery->whereHas('tags', function ($q) use ($request) {
                $q->where('id', $request->tag)->orWhere('slug', $request->tag);
            });
        }

        $recipes = $recipesQuery->latest()->paginate(12)->withQueryString();

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
            'filters' => $request->only(['search', 'city', 'tag']),
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
