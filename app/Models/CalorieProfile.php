<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CalorieProfile extends Model
{
    protected $fillable = [
        'user_id',
        'gender',
        'age',
        'height_cm',
        'weight_kg',
        'activity_level',
        'weight_trend',
        'goal',
        'meals',
        'baseline_meals',
    ];

    protected function casts(): array
    {
        return [
            'age' => 'integer',
            'height_cm' => 'integer',
            'weight_kg' => 'float',
            'meals' => 'array',
            'baseline_meals' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convert profile to the frontend CalorieProfileData payload shape.
     *
     * @return array<string, mixed>
     */
    public function toPayloadArray(): array
    {
        return [
            'gender' => $this->gender,
            'age' => $this->age,
            'height_cm' => $this->height_cm,
            'weight_kg' => $this->weight_kg,
            'activity_level' => $this->activity_level,
            'weight_trend' => $this->weight_trend,
            'goal' => $this->goal,
            'meals' => $this->meals,
            'baseline_meals' => $this->baseline_meals,
        ];
    }
}
