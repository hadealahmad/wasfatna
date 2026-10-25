<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\RecipeList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $userId = Auth::id();
        $recipeId = $request->input('recipe_id');

        $lists = RecipeList::where('user_id', $userId)
            ->withCount('recipes')
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($recipeId) {
            $listIdsWithRecipe = DB::table('list_items')
                ->where('recipe_id', $recipeId)
                ->pluck('list_id')
                ->flip();

            $lists->each(function ($list) use ($listIdsWithRecipe) {
                $list->has_recipe = $listIdsWithRecipe->has($list->id);
            });
        }

        return response()->json($lists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
        ]);

        $wantsPublic = $request->boolean('is_public');

        $list = RecipeList::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']).'-'.Str::random(6),
            'description' => $validated['description'] ?? null,
            'is_public' => false,
            'status' => $wantsPublic ? 'review' : 'draft',
        ]);

        return response()->json($list, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $list = RecipeList::with('user')->findOrFail($id);

        $user = Auth::guard('sanctum')->user() ?? Auth::user();
        $isOwner = $user && $user->id === $list->user_id;
        $isModerator = $user && $user->canApproveRecipes();

        if (! $isOwner && ! $isModerator) {
            if (! $list->is_public || $list->status !== 'approved') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $list->load([
            'recipes' => function ($query) use ($isOwner, $isModerator) {
                if (! $isOwner && ! $isModerator) {
                    $query->where('recipes.status', 'approved');
                }
                $query->with(['ingredients', 'user', 'anonymousAuthor', 'city', 'tags']);
            },
        ]);

        // Transform recipes to match expected frontend structure (RecipeCard)
        $formattedRecipes = $list->recipes->map(fn ($recipe) => $this->formatRecipe($recipe));
        $list->setRelation('recipes', $formattedRecipes);

        return response()->json($list);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,gif',
                'max:2048',
            ],
            'request_publish' => 'boolean',
        ]);

        if ($list->is_default && isset($validated['is_public']) && $validated['is_public']) {
            return response()->json(['message' => 'Default list cannot be public.'], 422);
        }

        // Handle publish request
        if ($request->boolean('request_publish')) {
            if ($list->recipes()->count() <= 1) {
                return response()->json(['message' => 'List must have more than 1 item to be published.'], 422);
            }
            $list->status = 'review';
            $list->is_public = false;
        }

        $updateData = $request->only(['name', 'description']);
        $isModerator = Auth::user()?->canApproveRecipes() ?? false;

        if ($request->has('is_public')) {
            if ($request->boolean('is_public')) {
                if ($list->status === 'approved' || $isModerator) {
                    $updateData['is_public'] = true;
                } else {
                    $updateData['is_public'] = false;
                    $list->status = 'review';
                }
            } else {
                $updateData['is_public'] = false;
            }
        }

        $list->fill($updateData);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('lists', 'public');
            $list->cover_image = 'storage/'.$path;
        }

        $list->save();

        return response()->json($list);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        if ($list->is_default) {
            return response()->json(['message' => 'Cannot delete default list.'], 422);
        }

        $list->delete();

        return response()->json(['message' => 'List deleted.']);
    }

    /**
     * Add recipe to list.
     */
    public function addRecipe(Request $request, $id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $recipe = Recipe::where('id', $request->recipe_id)
            ->where(fn ($q) => $q->where('status', 'approved')->orWhere('user_id', Auth::id()))
            ->firstOrFail();

        $list->recipes()->syncWithoutDetaching([$recipe->id]);

        return response()->json(['message' => 'Recipe added to list.']);
    }

    /**
     * Remove recipe from list.
     */
    public function removeRecipe(Request $request, $id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $list->recipes()->detach($request->recipe_id);

        return response()->json(['message' => 'Recipe removed from list.']);
    }

    /**
     * Toggle recipe in list (Add/Remove).
     */
    public function toggleRecipe(Request $request, $id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $recipe = Recipe::where('id', $request->recipe_id)
            ->where(fn ($q) => $q->where('status', 'approved')->orWhere('user_id', Auth::id()))
            ->firstOrFail();

        $result = $list->recipes()->toggle($recipe->id);

        $attached = in_array($recipe->id, $result['attached']);

        return response()->json([
            'message' => $attached ? 'Recipe added.' : 'Recipe removed.',
            'added' => $attached,
        ]);
    }

    public function publicIndex(Request $request)
    {
        $lists = RecipeList::query()
            ->where('is_public', true)
            ->where('status', 'approved')
            ->with('user')
            ->withCount(['recipes' => fn ($q) => $q->where('recipes.status', 'approved')])
            ->latest()
            ->paginate(12);

        return response()->json($lists);
    }

    public function publicLists(Request $request)
    {
        return $this->publicIndex($request);
    }

    /**
     * Format recipe for API response (matching RecipeController).
     */
    private function formatRecipe(Recipe $recipe): array
    {
        return [
            'id' => $recipe->id,
            'name' => $recipe->name,
            'slug' => $recipe->slug,
            'image_url' => $recipe->image_path
                ? asset('storage/'.$recipe->image_path)
                : null,
            'city' => $recipe->city?->name,
            'city_slug' => $recipe->city?->slug,
            'time_needed' => $recipe->time_needed,
            'difficulty' => $recipe->difficulty,
            'author_name' => $recipe->author_name,
            'tags' => $recipe->tags->map(fn ($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
            'created_at' => $recipe->created_at,
        ];
    }
}
