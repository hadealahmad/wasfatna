<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class MealPlan extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'start_date',
        'end_date',
        'preset_id',
        'is_public',
        'share_token',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_public' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (MealPlan $plan) {
            if (empty($plan->slug)) {
                $plan->slug = Str::slug($plan->name) . '-' . Str::random(6);
            }
            if (empty($plan->share_token)) {
                $plan->share_token = Str::random(32);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function preset(): BelongsTo
    {
        return $this->belongsTo(MealPlanPreset::class, 'preset_id');
    }

    public function entries(): HasMany
    {
        return $this->hasMany(MealPlanEntry::class)->orderBy('date')->orderBy('order');
    }

    public function entriesByDate(): array
    {
        return $this->entries()
            ->with(['recipe:id,name,slug,image_path,difficulty,time_needed'])
            ->get()
            ->groupBy(fn($entry) => $entry->date->format('Y-m-d'))
            ->toArray();
    }

    public function getDaysCountAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }
}
