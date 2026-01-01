<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeRevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipe_id',
        'user_id',
        'content',
        'change_summary',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    /**
     * Get the recipe that owns the revision.
     */
    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }

    /**
     * Get the user who made the revision.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
