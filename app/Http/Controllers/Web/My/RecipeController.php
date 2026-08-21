<?php

namespace App\Http\Controllers\Web\My;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Recipe;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::where('user_id', Auth::id())
            ->with(['city', 'tags'])
            ->latest();

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $recipes = $query->paginate(12)->withQueryString();

        return Inertia::render('My/Recipes/Index', [
            'recipes' => $recipes,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function edit(Recipe $recipe)
    {
        if ($recipe->user_id !== Auth::id() && ! Auth::user()->isModerator()) {
            abort(403);
        }

        $recipe->load(['ingredients', 'tags', 'city']);

        $data = [
            'recipe' => $recipe,
            'cities' => City::select('id', 'name')->get(),
            'tags' => Tag::select('id', 'name')->get(),
        ];

        // Pass users for admin author selection
        if (Auth::user()->role === 'admin') {
            $data['users'] = User::select('id', 'name', 'email')->get();
        }

        return Inertia::render('My/Recipes/Edit', $data);
    }

    public function update(Request $request, Recipe $recipe, \App\Services\ImageService $imageService)
    {
        if ($recipe->user_id !== Auth::id() && ! Auth::user()->isModerator()) {
            abort(403);
        }

        // Decode JSON strings from FormData
        $ingredients = $request->ingredients;
        $steps = $request->steps;
        $tags = $request->tags;
        $timeNeeded = $request->time_needed;

        if (is_string($ingredients)) {
            $ingredients = json_decode($ingredients, true);
        }
        if (is_string($steps)) {
            $steps = json_decode($steps, true);
        }
        if (is_string($tags)) {
            $tags = json_decode($tags, true);
        }
        if (is_string($timeNeeded)) {
            $timeNeeded = json_decode($timeNeeded, true);
        }

        $request->merge([
            'ingredients' => $ingredients,
            'steps' => $steps,
            'tags' => $tags,
            'time_needed' => $timeNeeded,
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:280',
            'city_id' => 'nullable|exists:cities,id',
            'servings' => 'nullable|string',
            'time_needed' => 'nullable',
            'difficulty' => 'required|string',
            'ingredients' => 'required|array|min:1',
            'steps' => 'required|array|min:1',
            'tags' => 'nullable|array',
            'manual_author_name' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp,gif|max:10240',
        ]);

        $recipe->name = $validated['name'];
        $recipe->description = $validated['description'] ?? null;
        $recipe->difficulty = $validated['difficulty'];
        $recipe->servings = $validated['servings'] ?? $recipe->servings;
        $recipe->city_id = $validated['city_id'] ?? $recipe->city_id;
        $recipe->time_needed = $validated['time_needed'] ?? $recipe->time_needed;
        $recipe->steps = $validated['steps'];

        // Handle author assignment (admin only)
        if (Auth::user()->role === 'admin') {
            if ($request->has('manual_author_name') && $request->manual_author_name) {
                $recipe->is_anonymous = true;
                $author = \App\Models\AnonymousAuthor::firstOrCreate(['name' => $request->manual_author_name]);
                $recipe->anonymous_author_id = $author->id;
            } elseif ($request->has('user_id') && $request->user_id) {
                $recipe->user_id = $request->user_id;
                $recipe->is_anonymous = false;
                $recipe->anonymous_author_id = null;
            }
        }

        // Match API behavior: regular users editing approved recipes
        // must go through re-approval before going live again.
        $needsReapproval = $recipe->isApproved() && ! Auth::user()->canApproveRecipes();
        if ($needsReapproval) {
            $recipe->needs_reapproval = true;
            $recipe->status = 'pending';
        }

        if ($request->hasFile('image')) {
            $result = $imageService->processAndStore($request->file('image'), 'recipes');
            if (! $result['success']) {
                return back()->withErrors(['image' => $result['error']])->withInput();
            }
            $recipe->image_path = $result['path'];
        }

        $recipe->save();

        if (! empty($validated['tags'])) {
            $recipe->tags()->sync($validated['tags']);
        }

        // Handle ingredients sync with proper structure
        if (! empty($validated['ingredients'])) {
            app(\App\Services\IngredientSyncService::class)->sync($recipe, $validated['ingredients']);
        }

        return redirect()->route('my.recipes.index')->with(
            'success',
            $needsReapproval ? 'تم تعديل الوصفة وإرسالها للمراجعة مجدداً' : 'تم تحديث الوصفة بنجاح'
        );
    }

    public function destroy(Recipe $recipe)
    {
        if ($recipe->user_id !== Auth::id() && ! Auth::user()->isModerator()) {
            abort(403);
        }

        $recipe->delete();

        return back()->with('success', 'تم حذف الوصفة');
    }
}
