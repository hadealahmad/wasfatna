<?php

namespace App\Http\Controllers\Web;

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
        $query = Recipe::with(['user', 'city', 'tags'])
            ->where('status', 'approved') // Only show approved recipes
            ->latest();

        // Filters
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
        }

        if ($request->has('city')) {
            $query->whereHas('city', function ($q) use ($request) {
                $q->where('slug', $request->city);
            });
        }

        if ($request->has('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        $recipes = $query->paginate(12)->withQueryString();

        return Inertia::render('Recipes/Index', [
            'recipes' => $recipes,
            'filters' => $request->only(['search', 'city', 'tag']),
            'cities' => City::select('id', 'name', 'slug')->get(),
            'tags' => Tag::select('id', 'name', 'slug')->get(),
        ]);
    }

    public function show($slug)
    {
        $query = Recipe::with(['user', 'city', 'tags', 'ingredients'])
            ->where('slug', $slug);

        // Admins and moderators can view any recipe, others only approved
        $user = Auth::user();
        if (!$user || !$user->isModerator()) {
            $query->where('status', 'approved');
        }

        $recipe = $query->firstOrFail();
            
        // Similar recipes logic (simple implementation for now)
        $similarRecipes = Recipe::where('id', '!=', $recipe->id)
            ->where('status', 'approved')
            ->where(function($q) use ($recipe) {
                if ($recipe->city_id) {
                    $q->orWhere('city_id', $recipe->city_id);
                }
                // Add tag matching logic if needed
            })
            ->limit(3)
            ->get();

        return Inertia::render('Recipes/Show', [
            'recipe' => $recipe,
            'similar_recipes' => $similarRecipes,
        ]);
    }
    
    public function create()
    {
        $data = [
            'cities' => City::select('id', 'name')->get(),
            'tags' => Tag::select('id', 'name')->get(),
        ];

        // Pass users for admin author selection
        if (Auth::check() && Auth::user()->role === 'admin') {
            $data['users'] = User::select('id', 'name', 'email')->get();
        }

        return Inertia::render('Recipes/Create', $data);
    }

    public function store(Request $request)
    {
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
            'image' => 'required|image|max:5120',
            'manual_author_name' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $recipe = new Recipe();
        $recipe->name = $validated['name'];
        $recipe->difficulty = $validated['difficulty'];
        $recipe->servings = $validated['servings'] ?? null;
        $recipe->city_id = $validated['city_id'] ?? null;
        $recipe->time_needed = $validated['time_needed'] ?? null;
        $recipe->steps = $validated['steps'];
        $recipe->status = Auth::user()->role === 'admin' ? 'approved' : 'pending';

        // Handle author assignment
        if (Auth::user()->role === 'admin') {
            if ($request->has('manual_author_name') && $request->manual_author_name) {
                $recipe->is_anonymous = true;
                $author = \App\Models\AnonymousAuthor::firstOrCreate(['name' => $request->manual_author_name]);
                $recipe->anonymous_author_id = $author->id;
                $recipe->user_id = Auth::id();
            } elseif ($request->has('user_id') && $request->user_id) {
                $recipe->user_id = $request->user_id;
            } else {
                $recipe->user_id = Auth::id();
            }
        } else {
            $recipe->user_id = Auth::id();
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
            $sortOrder = 0;
            
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
                            'sort_order' => $sortOrder++,
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
                        'sort_order' => $sortOrder++,
                    ];
                }
            }
            $recipe->ingredients()->sync($ingredientsData);
        }

        if (Auth::user()->role === 'admin') {
            return redirect()->route('dashboard.recipes')->with('success', 'تم نشر الوصفة بنجاح');
        }

        return redirect()->route('my.recipes.index')->with('success', 'تم إنشاء الوصفة بنجاح وتنتظر الموافقة');
    }

    public function variations($slug)
    {
        // Find the main recipe first to get the name
        $recipe = Recipe::where('slug', $slug)
            ->where('status', 'approved')
            ->firstOrFail();

        // Find all recipes with the same name, excluding the one we just found (optional, but variations page usually lists all including original or others?)
        // The prompt says "variations", implying alternative ways.
        // Let's include all recipes with the same name.
        $recipes = Recipe::with(['user', 'city', 'tags'])
            ->where('name', $recipe->name)
            ->where('status', 'approved')
            ->latest()
            ->get();

        return Inertia::render('Recipes/Variations', [
            'dish_name' => $recipe->name,
            'recipes' => $recipes,
        ]);
    }
}
