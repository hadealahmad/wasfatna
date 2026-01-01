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
        $query = Recipe::with(['user', 'city', 'tags'])
            ->where('status', 'approved')
            ->latest();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('city')) {
            $query->whereHas('city', function ($q) use ($request) {
                $q->where('slug', $request->city);
            });
        }

        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        if ($request->filled('difficulty')) {
            $query->where('difficulty', $request->difficulty);
        }

        $recipes = $query->paginate(12)->withQueryString();

        return Inertia::render('Search/Index', [
            'recipes' => $recipes,
            'cities' => City::select('id', 'name', 'slug')->get(),
            'tags' => Tag::select('id', 'name', 'slug')->get(),
            'filters' => $request->only(['search', 'city', 'tag', 'difficulty']),
        ]);
    }
}
