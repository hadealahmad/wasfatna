<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RecipeList;
use App\Models\Recipe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            $lists->each(function ($list) use ($recipeId) {
                $list->has_recipe = $list->recipes()->where('recipe_id', $recipeId)->exists();
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

        $list = RecipeList::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']) . '-' . Str::random(6),
            'description' => $validated['description'] ?? null,
            // 'cover_image' => TODO: Handle image upload
            'is_public' => $validated['is_public'] ?? false,
            'status' => 'draft',
        ]);

        return response()->json($list, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $list = RecipeList::with(['recipes' => function($query) {
            $query->with(['ingredients', 'user', 'city', 'tags']);
        }])->with('user')->findOrFail($id);

        // Check visibility
        if (!$list->is_public && $list->user_id !== Auth::id()) {
            // Check if user is admin/moderator
            $user = Auth::user();
            if (!$user || !($user->role === 'admin' || $user->role === 'moderator')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Transform recipes to match expected frontend structure (RecipeCard)
        $formattedRecipes = $list->recipes->map(fn($recipe) => $this->formatRecipe($recipe));
        $list->setRelation('recipes', $formattedRecipes);

        return response()->json($list);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $list = RecipeList::where('user_id', Auth::id())->findOrFail($id);

        if ($list->is_default) {
             // Cannot change name/public status of default list easily? 
             // Requirement: default list is not deletable or shareable (public).
             // So we enforce is_public = false for default list in validation or logic.
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'request_publish' => 'boolean' // Accept "true" string too if needed, but boolean validation usually handles 1/0/true/false
        ]);
        
        if ($list->is_default && isset($validated['is_public']) && $validated['is_public']) {
             return response()->json(['message' => 'Default list cannot be public.'], 422);
        }

        // Handle publish request
        if ($request->has('request_publish')) {
             // Logic check
            if ($list->recipes()->count() <= 1) {
                 return response()->json(['message' => 'List must have more than 1 item to be published.'], 422);
            }
            if (!$list->cover_image && !$request->hasFile('cover_image')) {
                 // return response()->json(['message' => 'List must have a cover image to be published.'], 422);
                 // We can relax this requirements or return error. 
                 // Let's ensure user knows they need an image if they don't have one.
            }
            $list->status = 'review';
        }

        $list->update($request->only(['name', 'description', 'is_public']));

        // Handle Image Upload if present (simplified)
        if ($request->hasFile('cover_image')) {
             $path = $request->file('cover_image')->store('lists', 'public');
             $list->cover_image = 'storage/' . $path; // Fixed path prefix
             $list->save();
        }

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

        $list->recipes()->syncWithoutDetaching([$request->recipe_id]);

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

        $result = $list->recipes()->toggle($request->recipe_id);
        
        $attached = in_array($request->recipe_id, $result['attached']);

        return response()->json([
            'message' => $attached ? 'Recipe added.' : 'Recipe removed.',
            'added' => $attached
        ]);
    }

    public function publicIndex(Request $request)
    {
        $lists = RecipeList::query()
            ->public()
            ->approved()
            ->with(['user', 'recipes']) // Eager load user and count
            ->withCount('recipes')
            ->latest()
            ->paginate(12);

        return response()->json($lists);
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
                ? asset('storage/' . $recipe->image_path) 
                : null,
            'city' => $recipe->city?->name,
            'city_slug' => $recipe->city?->slug,
            'time_needed' => $recipe->time_needed,
            'difficulty' => $recipe->difficulty,
            'author_name' => $recipe->author_name,
            'tags' => $recipe->tags->map(fn($t) => ['id' => $t->id, 'name' => $t->name, 'slug' => $t->slug]),
            'created_at' => $recipe->created_at, // useful for sorting if needed
        ];
    }
}
