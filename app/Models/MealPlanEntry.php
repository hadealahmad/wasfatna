<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlanEntry extends Model
{
    protected $fillable = [
        'meal_plan_id',
        'date',
        'recipe_id',
        'custom_title',
        'notes',
        'meal_type',
        'is_done',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_done' => 'boolean',
        ];
    }

    public function mealPlan(): BelongsTo
    {
        return $this->belongsTo(MealPlan::class);
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    public function getTitleAttribute(): string
    {
        if ($this->custom_title) {
            return $this->custom_title;
        }

        if ($this->recipe) {
            return $this->recipe->name;
        }

        return 'بدون عنوان';
    }
}
