<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CalorieProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CalorieCalculatorController extends Controller
{
    private const MEAL_KEYS = ['breakfast', 'lunch', 'late_dinner'];

    private const ALLOWED_PORTIONS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0];

    public function index(Request $request): Response
    {
        return Inertia::render('Calories/Index', [
            'initialProfile' => $request->user()?->calorieProfile?->toPayloadArray(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $portionRule = function (string $attribute, mixed $value, \Closure $fail): void {
            if (! is_numeric($value) || ! in_array((float) $value, self::ALLOWED_PORTIONS, true)) {
                $fail("The {$attribute} must be one of the allowed portion steps.");
            }
        };

        $rules = [
            'gender' => ['required', 'string', Rule::in(['male', 'female'])],
            'age' => ['required', 'integer', 'min:12', 'max:100'],
            'height_cm' => ['required', 'integer', 'min:100', 'max:240'],
            'weight_kg' => ['required', 'numeric', 'min:30', 'max:250'],
            'activity_level' => ['required', 'string', Rule::in(['sedentary', 'light', 'moderate', 'active', 'very_active'])],
            'weight_trend' => ['required', 'string', Rule::in(['losing', 'maintaining', 'gaining'])],
            'goal' => ['required', 'string', Rule::in(['lose', 'maintain', 'gain'])],
            'meals' => ['required', 'array'],
            'baseline_meals' => ['nullable', 'array'],
        ];

        $hasBaseline = is_array($request->input('baseline_meals'));

        foreach (self::MEAL_KEYS as $mealKey) {
            $rules["meals.{$mealKey}"] = ['present', 'array'];
            $rules["meals.{$mealKey}.*.foodId"] = ['required', 'string', 'max:64'];
            $rules["meals.{$mealKey}.*.portion"] = ['required', 'numeric', $portionRule];

            if ($hasBaseline) {
                $rules["baseline_meals.{$mealKey}"] = ['present', 'array'];
                $rules["baseline_meals.{$mealKey}.*.foodId"] = ['required', 'string', 'max:64'];
                $rules["baseline_meals.{$mealKey}.*.portion"] = ['required', 'numeric', $portionRule];
            }
        }

        $validated = $request->validate($rules);

        $profile = CalorieProfile::updateOrCreate(
            ['user_id' => $request->user()->id],
            [
                'gender' => $validated['gender'],
                'age' => (int) $validated['age'],
                'height_cm' => (int) $validated['height_cm'],
                'weight_kg' => (float) $validated['weight_kg'],
                'activity_level' => $validated['activity_level'],
                'weight_trend' => $validated['weight_trend'],
                'goal' => $validated['goal'],
                'meals' => $this->normalizeMeals($validated['meals']),
                'baseline_meals' => isset($validated['baseline_meals'])
                    ? $this->normalizeMeals($validated['baseline_meals'])
                    : null,
            ]
        );

        return response()->json([
            'profile' => $profile->toPayloadArray(),
            'saved_at' => $profile->updated_at?->toIso8601String(),
        ]);
    }

    /**
     * Normalize meal arrays to strictly typed meal buckets.
     *
     * @param  array<string, array<int, array<string, mixed>>>  $meals
     * @return array<string, array<int, array{foodId: string, portion: float}>>
     */
    private function normalizeMeals(array $meals): array
    {
        $normalized = [];

        foreach (self::MEAL_KEYS as $mealKey) {
            $entries = $meals[$mealKey] ?? [];
            $normalized[$mealKey] = array_values(array_map(
                fn (array $entry): array => [
                    'foodId' => (string) $entry['foodId'],
                    'portion' => (float) $entry['portion'],
                ],
                $entries
            ));
        }

        return $normalized;
    }
}
