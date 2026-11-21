<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image_path',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (! array_key_exists('image_path', $this->attributes) || ! $this->attributes['image_path']) {
            return null;
        }

        $path = (string) $this->attributes['image_path'];
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/'.$path);
    }

    protected static function booted(): void
    {
        static::creating(function (City $city) {
            if (empty($city->slug)) {
                $city->slug = Str::slug($city->name);
            }
        });
    }

    /**
     * Get recipes from this city.
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    /**
     * Get only approved recipes from this city.
     */
    public function approvedRecipes(): HasMany
    {
        return $this->hasMany(Recipe::class)->where('status', 'approved');
    }
}
