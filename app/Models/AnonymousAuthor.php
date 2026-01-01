<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnonymousAuthor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'bio',
    ];

    /**
     * Get recipes by this anonymous author.
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }
}
