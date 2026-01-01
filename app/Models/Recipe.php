<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Recipe extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'image_path',
        'time_needed',
        'servings',
        'city_id',
        'user_id',
        'anonymous_author_id',
        'is_anonymous',

        'steps',
        'difficulty',
        'status',
        'rejection_reason',
        'approved_by',
        'approved_at',
        'needs_reapproval',
    ];

    protected $appends = ['image_url', 'author_name'];

    protected function casts(): array
    {
        return [
            'time_needed' => 'array',
            'steps' => 'array',
            'is_anonymous' => 'boolean',
            'approved_at' => 'datetime',
            'needs_reapproval' => 'boolean',
        ];
    }

    /**
     * Get the URL for the recipe image.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->image_path) {
            return null;
        }

        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }

        return asset('storage/' . $this->image_path);
    }

    protected static function booted(): void
    {
        static::creating(function (Recipe $recipe) {
            if (empty($recipe->slug)) {
                $recipe->slug = Str::slug($recipe->name) . '-' . Str::random(6);
            }
        });
    }

    /**
     * Get the recipe's author (user).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the recipe's anonymous author.
     */
    public function anonymousAuthor(): BelongsTo
    {
        return $this->belongsTo(AnonymousAuthor::class);
    }

    /**
     * Get the recipe's city.
     */
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    /**
     * Get the user who approved this recipe.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the ingredients for the recipe.
     */
    public function ingredients(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Ingredient::class, 'recipe_ingredients')
            ->withPivot(['amount', 'unit', 'ingredient_descriptor', 'group']);
            // ->withTimestamps(); // Pivot table does not have timestamps
    }

    /**
     * Get the tags for the recipe.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'recipe_tags');
    }

    /**
     * Get the revisions for the recipe.
     */
    public function revisions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(RecipeRevision::class);
    }


    /**
     * Get author display name (user, anonymous, or default).
     */
    public function getAuthorNameAttribute(): string
    {
        if ($this->is_anonymous && $this->anonymousAuthor) {
            return $this->anonymousAuthor->name;
        }
        
        if ($this->user) {
            return $this->user->display_name ?? $this->user->name;
        }
        
        return 'مجهول'; // Anonymous in Arabic
    }

    /**
     * Check if this recipe is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if this recipe is pending approval.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Get similar recipes by name (same dish, different methods).
     */
    public function getSimilarByName()
    {
        return static::where('name', $this->name)
            ->where('id', '!=', $this->id)
            ->where('status', 'approved')
            ->get();
    }

    /**
     * Get similar recipes by ingredients.
     */
    public function getSimilarByIngredients($limit = 6)
    {
        // Get IDs of current recipe's ingredients
        $ingredientIds = $this->ingredients()->pluck('ingredients.id');

        return self::where('id', '!=', $this->id)
            ->whereHas('ingredients', function ($query) use ($ingredientIds) {
                $query->whereIn('ingredients.id', $ingredientIds);
            })
            ->withCount(['ingredients' => function ($query) use ($ingredientIds) {
                $query->whereIn('ingredients.id', $ingredientIds);
            }])
            ->orderByDesc('ingredients_count')
            ->limit($limit)
            ->get();
    }

    /**
     * Scope for approved recipes only.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope for pending recipes.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope for recipes needing reapproval.
     */
    public function scopeNeedsReapproval($query)
    {
        return $query->where('needs_reapproval', true);
    }

    /**
     * Get reports for this recipe.
     */
    public function reports(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

}
