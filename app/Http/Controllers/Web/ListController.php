<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\RecipeList;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ListController extends Controller
{
    public function index()
    {
        $lists = RecipeList::where('is_public', true)
            ->where('status', 'approved')
            ->with(['user'])
            ->withCount(['recipes' => fn ($q) => $q->where('recipes.status', 'approved')])
            ->latest()
            ->paginate(12);

        return Inertia::render('Lists/Index', [
            'lists' => $lists,
        ]);
    }

    public function show($id)
    {
        $list = RecipeList::where('id', $id)
            ->with(['user'])
            ->firstOrFail();

        $user = Auth::user();
        $isOwner = $user && $user->id === $list->user_id;
        $isModerator = $user && $user->canApproveRecipes();

        // Check visibility: if not owner or moderator, require public and approved
        if (! $isOwner && ! $isModerator) {
            if (! $list->is_public || $list->status !== 'approved') {
                abort(404);
            }
        }

        $list->load([
            'recipes' => function ($query) use ($isOwner, $isModerator) {
                if (! $isOwner && ! $isModerator) {
                    $query->where('recipes.status', 'approved');
                }
                $query->with([
                    'city:id,name,slug',
                    'user:id,name,avatar',
                    'anonymousAuthor:id,name',
                    'tags:id,name,slug',
                ]);
            },
        ]);

        return Inertia::render('Lists/Show', [
            'list' => $list,
        ]);
    }
}
