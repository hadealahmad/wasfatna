<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\MealPlan;
use App\Models\MealPlanPreset;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MealPlanController extends Controller
{
    public function index()
    {
        $plans = MealPlan::where('user_id', Auth::id())
            ->withCount('entries')
            ->withCount(['entries as done_count' => fn ($q) => $q->where('is_done', true)])
            ->with('preset:id,name,type')
            ->latest()
            ->get();

        return Inertia::render('My/MealPlans/Index', [
            'plans' => $plans->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'start_date' => $p->start_date->format('Y-m-d'),
                'end_date' => $p->end_date->format('Y-m-d'),
                'share_token' => $p->share_token,
                'days_count' => $p->days_count,
                'entries_count' => $p->entries_count,
                'done_count' => $p->done_count,
                'preset' => $p->preset ? [
                    'id' => $p->preset->id,
                    'name' => $p->preset->name,
                    'type' => $p->preset->type,
                ] : null,
                'created_at' => $p->created_at->toISOString(),
            ]),
        ]);
    }

    public function create()
    {
        $presets = MealPlanPreset::active()
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'type' => $p->type,
                'start_date' => $p->start_date->format('Y-m-d'),
                'end_date' => $p->end_date->format('Y-m-d'),
                'days_count' => $p->days_count,
            ]);

        return Inertia::render('My/MealPlans/Create', [
            'presets' => $presets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'preset_id' => 'nullable|exists:meal_plan_presets,id',
        ]);

        $plan = new MealPlan($validated);
        $plan->user_id = Auth::id();
        $plan->save();

        return redirect()->route('my.meal-plans.show', $plan)->with('success', 'تم إنشاء خطة الوجبات بنجاح');
    }

    public function show(MealPlan $meal_plan)
    {
        if ($meal_plan->user_id !== Auth::id()) {
            abort(403);
        }

        $entries = $meal_plan->entries()
            ->with(['recipe:id,name,slug,image_path,difficulty,time_needed'])
            ->get();

        $entriesByDate = $entries->groupBy(fn ($e) => $e->date->format('Y-m-d'))
            ->map(fn ($group) => $group->map(fn ($e) => [
                'id' => $e->id,
                'date' => $e->date->format('Y-m-d'),
                'recipe_id' => $e->recipe_id,
                'custom_title' => $e->custom_title,
                'title' => $e->title,
                'notes' => $e->notes,
                'meal_type' => $e->meal_type,
                'is_done' => $e->is_done,
                'order' => $e->order,
                'recipe' => $e->recipe ? [
                    'id' => $e->recipe->id,
                    'name' => $e->recipe->name,
                    'slug' => $e->recipe->slug,
                    'image_url' => $e->recipe->image_url,
                    'difficulty' => $e->recipe->difficulty,
                    'time_needed' => $e->recipe->time_needed,
                ] : null,
            ])->values());

        return Inertia::render('My/MealPlans/Show', [
            'plan' => [
                'id' => $meal_plan->id,
                'name' => $meal_plan->name,
                'slug' => $meal_plan->slug,
                'description' => $meal_plan->description,
                'start_date' => $meal_plan->start_date->format('Y-m-d'),
                'end_date' => $meal_plan->end_date->format('Y-m-d'),
                'share_token' => $meal_plan->share_token,
                'is_public' => $meal_plan->is_public,
                'days_count' => $meal_plan->days_count,
                'preset' => $meal_plan->preset ? [
                    'id' => $meal_plan->preset->id,
                    'name' => $meal_plan->preset->name,
                    'type' => $meal_plan->preset->type,
                ] : null,
            ],
            'entriesByDate' => $entriesByDate,
            'tags' => Tag::select('id', 'name', 'slug')->get(),
        ]);
    }

    public function update(Request $request, MealPlan $meal_plan)
    {
        if ($meal_plan->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $meal_plan->update($validated);

        return back()->with('success', 'تم تحديث خطة الوجبات بنجاح');
    }

    public function destroy(MealPlan $meal_plan)
    {
        if ($meal_plan->user_id !== Auth::id()) {
            abort(403);
        }

        $meal_plan->delete();

        return redirect()->route('my.meal-plans.index')->with('success', 'تم حذف خطة الوجبات');
    }

    public function browse(Request $request)
    {
        $plans = MealPlan::where('is_public', true)
            ->with('user:id,name,display_name,avatar')
            ->withCount('entries')
            ->latest()
            ->paginate(12);

        return Inertia::render('MealPlans/Browse', [
            'plans' => $plans->through(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'description' => $p->description,
                'start_date' => $p->start_date->format('Y-m-d'),
                'end_date' => $p->end_date->format('Y-m-d'),
                // Safe to expose: browse only lists is_public plans, and shared()
                // re-checks is_public so un-publishing revokes access immediately.
                'share_token' => $p->share_token,
                'days_count' => $p->days_count,
                'entries_count' => $p->entries_count,
                'user' => $p->user ? [
                    'id' => $p->user->id,
                    'display_name' => $p->user->display_name,
                    'avatar_url' => $p->user->avatar_url,
                ] : null,
            ]),
        ]);
    }

    public function shared(string $token)
    {
        $plan = MealPlan::where('share_token', $token)
            ->where('is_public', true)
            ->firstOrFail();

        $entries = $plan->entries()
            ->with(['recipe:id,name,slug,image_path,difficulty,time_needed'])
            ->get();

        $entriesByDate = $entries->groupBy(fn ($e) => $e->date->format('Y-m-d'))
            ->map(fn ($group) => $group->map(fn ($e) => [
                'id' => $e->id,
                'date' => $e->date->format('Y-m-d'),
                'recipe_id' => $e->recipe_id,
                'custom_title' => $e->custom_title,
                'title' => $e->title,
                'notes' => $e->notes,
                'meal_type' => $e->meal_type,
                'is_done' => $e->is_done,
                'order' => $e->order,
                'recipe' => $e->recipe ? [
                    'id' => $e->recipe->id,
                    'name' => $e->recipe->name,
                    'slug' => $e->recipe->slug,
                    'image_url' => $e->recipe->image_url,
                    'difficulty' => $e->recipe->difficulty,
                    'time_needed' => $e->recipe->time_needed,
                ] : null,
            ])->values());

        return Inertia::render('MealPlans/Shared', [
            'plan' => [
                'id' => $plan->id,
                'name' => $plan->name,
                'description' => $plan->description,
                'start_date' => $plan->start_date->format('Y-m-d'),
                'end_date' => $plan->end_date->format('Y-m-d'),
                'days_count' => $plan->days_count,
                'user' => [
                    'name' => $plan->user?->display_name ?? 'مستخدم',
                ],
                'preset' => $plan->preset ? [
                    'name' => $plan->preset->name,
                    'type' => $plan->preset->type,
                ] : null,
            ],
            'entriesByDate' => $entriesByDate,
        ]);
    }
}
