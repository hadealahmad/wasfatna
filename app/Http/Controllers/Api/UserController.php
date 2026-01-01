<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Get user profile by ID.
     */
    public function show(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Count approved recipes
        $recipesCount = $user->recipes()->approved()->count();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->display_name ?? $user->name,
                'avatar' => $user->avatar,
                'recipes_count' => $recipesCount,
                'created_at' => $user->created_at,
            ],
        ]);
    }

    /**
     * Get user's approved recipes.
     */
    public function recipes(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $recipes = $user->recipes()
            ->approved()
            ->with(['city'])
            ->latest()
            ->paginate(12);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->display_name ?? $user->name,
                'avatar' => $user->avatar,
            ],
            'recipes' => $recipes->getCollection()->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'image_url' => $r->image_path ? asset('storage/' . $r->image_path) : null,
                'city' => $r->city?->name,
                'city_slug' => $r->city?->slug,
                'time_needed' => $r->time_needed,
                'difficulty' => $r->difficulty,
                'author_name' => $user->display_name ?? $user->name,
            ])->values(),
            'pagination' => [
                'current_page' => $recipes->currentPage(),
                'last_page' => $recipes->lastPage(),
                'total' => $recipes->total(),
            ],
        ]);
    }
}
