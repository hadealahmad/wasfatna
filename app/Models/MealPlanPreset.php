<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class MealPlanPreset extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'start_date',
        'end_date',
        'type',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (MealPlanPreset $preset) {
            if (empty($preset->slug)) {
                $preset->slug = Str::slug($preset->name) . '-' . Str::random(6);
            }
        });
    }

    public function mealPlans(): HasMany
    {
        return $this->hasMany(MealPlan::class, 'preset_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getDaysCountAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }
}
