<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Recipe;
use App\Models\RecipeList;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(User $user)
    {
        $user->loadCount(['recipes', 'approvedRecipes']); // Example counts

        $recipes = Recipe::where('user_id', $user->id)
            ->where('status', 'approved')
            ->with(['city', 'tags'])
            ->latest()
            ->paginate(12);

        $lists = RecipeList::where('user_id', $user->id)
            ->where('is_public', true)
            ->withCount('recipes')
            ->get();

        return Inertia::render('Users/Show', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->display_name,
                'avatar_url' => $user->avatar_url,
                'recipes_count' => $user->recipes()->where('status', 'approved')->count(),
            ],
            'recipes' => $recipes,
        ]);
    }
}
