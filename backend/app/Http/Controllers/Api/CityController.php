<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    /**
     * List all cities.
     */
    public function index(): JsonResponse
    {
        $cities = City::withCount(['approvedRecipes as recipes_count'])
            ->orderBy('recipes_count', 'desc')
            ->orderBy('name')
            ->get();

        return response()->json([
            'cities' => $cities->map(fn($city) => [
                'id' => $city->id,
                'name' => $city->name,
                'slug' => $city->slug,
                'recipes_count' => $city->recipes_count,
            ])->values(),
        ]);
    }

    /**
     * Get recipes for a specific city.
     */
    public function recipes(Request $request, string $slug): JsonResponse
    {
        $city = City::where('slug', $slug)->firstOrFail();

        $recipes = $city->approvedRecipes()
            ->with(['user', 'anonymousAuthor'])
            ->latest()
            ->paginate(12);

        return response()->json([
            'city' => [
                'id' => $city->id,
                'name' => $city->name,
                'slug' => $city->slug,
                'description' => $city->description,
            ],
            'recipes' => $recipes->getCollection()->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'image_url' => $r->image_path ? asset('storage/' . $r->image_path) : null,
                'time_needed' => $r->time_needed,
                'difficulty' => $r->difficulty,
                'author_name' => $r->author_name,
            ])->values(),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
            ],
        ]);
    }
}
