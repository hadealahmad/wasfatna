<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\MealPlanEntry;
use App\Models\Recipe;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MealPlanController extends Controller
{
    public function addEntry(Request $request, MealPlan $mealPlan)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date' => 'required|date',
            'recipe_id' => 'nullable|exists:recipes,id',
            'custom_title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'meal_type' => 'nullable|string|max:255',
        ]);

        $date = Carbon::parse($validated['date']);
        if ($date->lt($mealPlan->start_date) || $date->gt($mealPlan->end_date)) {
            return response()->json(['message' => 'التاريخ خارج نطاق الخطة'], 422);
        }

        if (empty($validated['recipe_id']) && empty($validated['custom_title'])) {
            return response()->json(['message' => 'يجب إضافة وصفة أو عنوان مخصص'], 422);
        }

        // Lock the parent plan row to serialize concurrent entry inserts
        // (prevents duplicate `order` values from read-max-then-insert races)
        $entry = \DB::transaction(function () use ($mealPlan, $validated) {
            $mealPlan->lockForUpdate()->first();

            $maxOrder = $mealPlan->entries()->where('date', $validated['date'])->max('order') ?? -1;

            return $mealPlan->entries()->create([
                'date' => $validated['date'],
                'recipe_id' => $validated['recipe_id'] ?? null,
                'custom_title' => $validated['custom_title'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'meal_type' => $validated['meal_type'] ?? 'main',
                'order' => $maxOrder + 1,
            ]);
        });

        $entry->load('recipe:id,name,slug,image_path,difficulty,time_needed');

        return response()->json([
            'id' => $entry->id,
            'date' => $entry->date->format('Y-m-d'),
            'recipe_id' => $entry->recipe_id,
            'custom_title' => $entry->custom_title,
            'title' => $entry->title,
            'notes' => $entry->notes,
            'meal_type' => $entry->meal_type,
            'is_done' => $entry->is_done,
            'order' => $entry->order,
            'recipe' => $entry->recipe ? [
                'id' => $entry->recipe->id,
                'name' => $entry->recipe->name,
                'slug' => $entry->recipe->slug,
                'image_url' => $entry->recipe->image_url,
                'difficulty' => $entry->recipe->difficulty,
                'time_needed' => $entry->recipe->time_needed,
            ] : null,
        ], 201);
    }

    public function removeEntry(MealPlan $mealPlan, MealPlanEntry $entry)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($entry->meal_plan_id !== $mealPlan->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $entry->delete();

        return response()->json(['message' => 'تم الحذف']);
    }

    public function toggleDone(MealPlan $mealPlan, MealPlanEntry $entry)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($entry->meal_plan_id !== $mealPlan->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $entry->update(['is_done' => ! $entry->is_done]);

        return response()->json(['is_done' => $entry->is_done]);
    }

    public function updateEntry(Request $request, MealPlan $mealPlan, MealPlanEntry $entry)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($entry->meal_plan_id !== $mealPlan->id) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'custom_title' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'meal_type' => 'nullable|string|max:255',
        ]);

        $entry->update($validated);

        return response()->json([
            'id' => $entry->id,
            'custom_title' => $entry->custom_title,
            'notes' => $entry->notes,
            'meal_type' => $entry->meal_type,
        ]);
    }

    public function randomFill(Request $request, MealPlan $mealPlan)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'meal_type' => 'nullable|string|max:255',
            'overwrite' => 'boolean',
        ]);

        $mealType = $validated['meal_type'] ?? 'main';
        $overwrite = $validated['overwrite'] ?? false;

        $recipes = Recipe::approved()
            ->whereHas('tags', fn ($q) => $q->where('slug', $mealType))
            ->inRandomOrder()
            ->limit(100)
            ->pluck('id')
            ->toArray();

        if (empty($recipes)) {
            return response()->json(['message' => 'لا توجد وصفات بهذا الوسم'], 422);
        }

        $start = $mealPlan->start_date->copy();
        $end = $mealPlan->end_date->copy();
        // Guard against unbounded loops if plan dates were mutated inconsistently
        $maxIterations = 400;
        $added = 0;
        $recipeIndex = 0;

        while ($start->lte($end) && $maxIterations-- > 0) {
            $dateStr = $start->format('Y-m-d');

            $existing = $mealPlan->entries()
                ->where('date', $dateStr)
                ->where('meal_type', $mealType)
                ->exists();

            if (! $existing || $overwrite) {
                if ($overwrite) {
                    $mealPlan->entries()
                        ->where('date', $dateStr)
                        ->where('meal_type', $mealType)
                        ->delete();
                }

                $mealPlan->entries()->create([
                    'date' => $dateStr,
                    'recipe_id' => $recipes[$recipeIndex % count($recipes)],
                    'meal_type' => $mealType,
                    'order' => 0,
                ]);

                $recipeIndex++;
                $added++;
            }

            $start->addDay();
        }

        return response()->json([
            'message' => "تمت إضافة {$added} وصفة",
            'added' => $added,
        ]);
    }

    public function togglePublic(MealPlan $mealPlan)
    {
        if ($mealPlan->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $mealPlan->is_public = ! $mealPlan->is_public;
        $mealPlan->save();

        return response()->json([
            'is_public' => $mealPlan->is_public,
        ]);
    }

    public function searchRecipes(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $recipes = Recipe::approved()
            ->where('name', 'LIKE', "%{$query}%")
            ->select('id', 'name', 'slug', 'image_path', 'difficulty', 'time_needed')
            ->limit(10)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'slug' => $r->slug,
                'image_url' => $r->image_url,
                'difficulty' => $r->difficulty,
                'time_needed' => $r->time_needed,
            ]);

        return response()->json($recipes);
    }
}
