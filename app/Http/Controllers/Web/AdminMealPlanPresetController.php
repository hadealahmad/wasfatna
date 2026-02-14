<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MealPlanPreset;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminMealPlanPresetController extends Controller
{
    public function index(Request $request): Response
    {
        $query = MealPlanPreset::withCount('mealPlans');

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', "%{$request->search}%");
        }

        $presets = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Dashboard/MealPlanPresets/Index', [
            'presets' => $presets->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'start_date' => $p->start_date->format('Y-m-d'),
                'end_date' => $p->end_date->format('Y-m-d'),
                'type' => $p->type,
                'is_active' => $p->is_active,
                'days_count' => $p->days_count,
                'meal_plans_count' => $p->meal_plans_count,
                'created_at' => $p->created_at->toISOString(),
            ]),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'type' => 'required|in:ramadan,custom',
            'is_active' => 'boolean',
        ]);

        MealPlanPreset::create($request->only([
            'name', 'description', 'start_date', 'end_date', 'type', 'is_active',
        ]));

        return back()->with('success', 'تم إنشاء القالب بنجاح');
    }

    public function update(Request $request, MealPlanPreset $preset): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'type' => 'required|in:ramadan,custom',
            'is_active' => 'boolean',
        ]);

        $preset->update($request->only([
            'name', 'description', 'start_date', 'end_date', 'type', 'is_active',
        ]));

        return back()->with('success', 'تم تحديث القالب بنجاح');
    }

    public function destroy(MealPlanPreset $preset): RedirectResponse
    {
        $preset->delete();

        return back()->with('success', 'تم حذف القالب بنجاح');
    }
}
