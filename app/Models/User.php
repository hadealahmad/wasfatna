<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'display_name',
        'email',
        'password',
        'google_id',
        'avatar',
        'role',
        'is_banned',
        'ban_reason',
        'banned_at',
        'deletion_requested',
        'deletion_requested_at',
    ];

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->avatar) {
            return null;
        }

        if (str_starts_with($this->avatar, 'http')) {
            return $this->avatar;
        }

        return asset('storage/' . $this->avatar);
    }

    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_banned' => 'boolean',
            'banned_at' => 'datetime',
            'deletion_requested' => 'boolean',
            'deletion_requested_at' => 'datetime',
        ];
    }

    /**
     * Get the display name or fall back to name.
     */
    public function getDisplayNameAttribute($value): string
    {
        return $value ?? $this->name;
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->email === 'hade.alahmad1@gmail.com';
    }

    /**
     * Check if user is moderator.
     */
    public function isModerator(): bool
    {
        return $this->role === 'moderator' || $this->isAdmin();
    }

    /**
     * Check if user can approve recipes (admin or moderator).
     */
    public function canApproveRecipes(): bool
    {
        return $this->isModerator();
    }

    /**
     * Check if user can delete recipes (admin only).
     */
    public function canDeleteRecipes(): bool
    {
        return $this->isAdmin();
    }

    /**
     * Get recipes created by this user.
     */
    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    /**
     * Get recipes approved by this user (admin/moderator).
     */
    public function approvedRecipes(): HasMany
    {
        return $this->hasMany(Recipe::class, 'approved_by');
    }
    /**
     * Get reports made by this user.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
