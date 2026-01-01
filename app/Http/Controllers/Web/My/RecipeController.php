<?php

namespace App\Http\Controllers\Web\My;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RecipeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recipe::where('user_id', Auth::id())
            ->with(['city', 'tags'])
            ->latest();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
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
        if ($recipe->user_id !== Auth::id() && !Auth::user()->isModerator()) {
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

    public function update(Request $request, Recipe $recipe)
    {
        if ($recipe->user_id !== Auth::id() && !Auth::user()->isModerator()) {
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
            'city_id' => 'nullable|exists:cities,id',
            'servings' => 'nullable|string',
            'time_needed' => 'nullable',
            'difficulty' => 'required|string',
            'ingredients' => 'required|array|min:1',
            'steps' => 'required|array|min:1',
            'tags' => 'nullable|array',
            'manual_author_name' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $recipe->name = $validated['name'];
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

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('recipes', 'public');
            $recipe->image_path = $path;
        }

        $recipe->save();

        if (!empty($validated['tags'])) {
            $recipe->tags()->sync($validated['tags']);
        }

        // Handle ingredients sync with proper structure
        if (!empty($validated['ingredients'])) {
            $ingredientsData = [];
            
            // Check if it's grouped format
            if (isset($validated['ingredients'][0]['items'])) {
                foreach ($validated['ingredients'] as $group) {
                    $groupName = $group['name'] ?? 'المكونات';
                    foreach ($group['items'] as $item) {
                        if (empty($item['name'])) continue;
                        $ingredient = \App\Models\Ingredient::firstOrCreate(['name' => $item['name']]);
                        $ingredientsData[$ingredient->id] = [
                            'amount' => $item['amount'] ?? '',
                            'unit' => $item['unit'] ?? '',
                            'group' => $groupName,
                            'ingredient_descriptor' => $item['descriptor'] ?? '',
                        ];
                    }
                }
            } else {
                // Flat array format
                foreach ($validated['ingredients'] as $item) {
                    if (empty($item['name'])) continue;
                    $ingredient = \App\Models\Ingredient::firstOrCreate(['name' => $item['name']]);
                    $ingredientsData[$ingredient->id] = [
                        'amount' => $item['amount'] ?? '',
                        'unit' => $item['unit'] ?? '',
                        'group' => $item['group'] ?? 'المكونات',
                        'ingredient_descriptor' => $item['descriptor'] ?? '',
                    ];
                }
            }
            $recipe->ingredients()->sync($ingredientsData);
        }

        return redirect()->route('my.recipes.index')->with('success', 'تم تحديث الوصفة بنجاح');
    }

    public function destroy(Recipe $recipe)
    {
        if ($recipe->user_id !== Auth::id() && !Auth::user()->isModerator()) {
            abort(403);
        }

        $recipe->delete();

        return back()->with('success', 'تم حذف الوصفة');
    }
}
