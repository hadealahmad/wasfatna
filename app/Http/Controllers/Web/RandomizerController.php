<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class RandomizerController extends Controller
{
    public function index(): Response
    {
        $approvedScope = fn ($q) => $q->where('status', 'approved');

        $cities = City::query()
            ->select(['id', 'name', 'slug'])
            ->whereHas('recipes', $approvedScope)
            ->withCount(['recipes' => $approvedScope])
            ->orderByDesc('recipes_count')
            ->get();

        $tags = Tag::query()
            ->select(['id', 'name', 'slug'])
            ->whereHas('recipes', $approvedScope)
            ->withCount(['recipes' => $approvedScope])
            ->orderByDesc('recipes_count')
            ->limit(24)
            ->get();

        $popularIngredients = Ingredient::query()
            ->select(['id', 'name'])
            ->whereHas('recipes', $approvedScope)
            ->withCount(['recipes' => $approvedScope])
            ->orderByDesc('recipes_count')
            ->limit(14)
            ->get()
            ->map(fn ($i) => [
                'id' => $i->id,
                'name' => $i->name,
            ]);

        $totalRecipes = Recipe::where('status', 'approved')->count();

        return Inertia::render('Randomizer/Index', [
            'cities' => $cities,
            'tags' => $tags,
            'popularIngredients' => $popularIngredients,
            'totalRecipes' => $totalRecipes,
        ]);
    }
}
