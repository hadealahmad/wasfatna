<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RecipeList; // Assuming model name is RecipeList or ListModel
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListController extends Controller
{
    public function index()
    {
        // Adjust model name as per your actual model for Lists
        // Assuming 'RecipeList'
        
        $lists = \App\Models\RecipeList::where('is_public', true)
            ->with(['user'])
            ->withCount('recipes')
            ->latest()
            ->paginate(12);

        return Inertia::render('Lists/Index', [
            'lists' => $lists,
        ]);
    }

    public function show($id)
    {
        $list = \App\Models\RecipeList::where('id', $id)
            ->with(['user', 'recipes' => function ($query) {
                $query->with(['user', 'city', 'tags']);
            }])
            ->firstOrFail();

        // Check visibility: if private, must be owner or admin/moderator
        if (!$list->is_public) {
            $user = auth()->user();
            if (!$user || ($user->id !== $list->user_id && !$user->isModerator())) {
                abort(404);
            }
        }

        return Inertia::render('Lists/Show', [
            'list' => $list,
        ]);
    }
}
