<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::with(['user', 'anonymousAuthor', 'city', 'tags', 'ingredients'])
            ->where('status', 'approved')
            ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('city', fn($c) => $c->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('tags', fn($t) => $t->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('ingredients', fn($i) => $i->where('name', 'like', "%{$search}%"));
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

        return Inertia::render('Search/Index', [
            'recipes' => $recipes->through(fn($r) => $this->formatRecipeCard($r)),
            'cities' => City::select('id', 'name', 'slug')->get(),
            'tags' => Tag::select('id', 'name', 'slug')->get(),
            'filters' => $request->only(['search', 'city', 'tag', 'difficulty', 'per_page']),
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
