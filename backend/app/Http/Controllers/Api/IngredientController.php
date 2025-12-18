<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    /**
     * Search for ingredients (autocomplete).
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2',
        ]);

        $ingredients = Ingredient::searchSimilar($request->q, 10);

        return response()->json([
            'ingredients' => $ingredients->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
            ]),
        ]);
    }

    /**
     * List all ingredients (for admin).
     */
    public function index(Request $request): JsonResponse
    {
        $ingredients = Ingredient::withCount('recipes')
            ->orderByDesc('recipes_count')
            ->paginate(50);

        return response()->json([
            'ingredients' => $ingredients->through(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'normalized_name' => $i->normalized_name,
                'recipes_count' => $i->recipes_count,
            ]),
            'pagination' => [
                'current_page' => $ingredients->currentPage(),
                'last_page' => $ingredients->lastPage(),
                'total' => $ingredients->total(),
            ],
        ]);
    }
}
