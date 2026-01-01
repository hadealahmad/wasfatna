<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class RecipeList extends Model
{
    protected $table = 'lists';

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'cover_image',
        'is_default',
        'is_public',
        'status',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'list_items', 'list_id', 'recipe_id')
            ->withPivot('order', 'created_at')
            ->withTimestamps()
            ->orderByPivot('order', 'asc');
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true)->where('status', 'approved');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
    public function getCoverImageAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // If it's already a full URL (e.g. from Seeder or external), return it
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Ensure we don't double-slash storage
        $path = ltrim($value, '/');
        
        // If stored path starts with 'storage/', remove it to avoid asset() duplication if asset() adds it?
        // Standard Laravel `storage/app/public` is linked to `public/storage`.
        // `asset('storage/' . $path)` expects $path relative to `public/storage`.
        // My controller saves `storage/lists/xyz.jpg`. 
        // So I should return `asset($value)` if `$value` is `storage/lists/xyz.jpg` relative to public root?
        // Note: Controller saved: 'storage/' . $path where $path is 'lists/xyz.jpg'.
        // So value is 'storage/lists/xyz.jpg'.
        // If I use `asset('storage/lists/xyz.jpg')`, it returns `http://domain/storage/lists/xyz.jpg`.
        // This is correct.
        
        return asset($path);
    }

    /**
     * Get reports for this list.
     */
    public function reports(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

}
