<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'normalized_name',
    ];

    protected static function booted(): void
    {
        static::creating(function (Ingredient $ingredient) {
            if (empty($ingredient->normalized_name)) {
                $ingredient->normalized_name = self::normalize($ingredient->name);
            }
        });

        static::updating(function (Ingredient $ingredient) {
            if ($ingredient->isDirty('name')) {
                $ingredient->normalized_name = self::normalize($ingredient->name);
            }
        });
    }

    /**
     * Normalize ingredient name for search matching.
     * Removes common variations and cleans up text.
     */
    public static function normalize(string $name): string
    {
        // Remove quantities and measurements at the start
        $normalized = preg_replace('/^\d+[\s,]*/', '', $name);
        
        // Remove parenthetical content
        $normalized = preg_replace('/\([^)]*\)/', '', $normalized);
        
        // Trim and lowercase
        return mb_strtolower(trim($normalized));
    }

    /**
     * Get recipes using this ingredient.
     */
    public function recipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'recipe_ingredients');
    }

    /**
     * Search for similar ingredients by name.
     */
    public static function searchSimilar(string $query, int $limit = 10)
    {
        $normalized = self::normalize($query);
        
        return static::where('normalized_name', 'LIKE', "%{$normalized}%")
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->limit($limit)
            ->get();
    }
}
