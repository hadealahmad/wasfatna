<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('recipes')) {
            $hasDuplicateSlugs = DB::table('recipes')
                ->whereNotNull('slug')
                ->select('slug')
                ->groupBy('slug')
                ->havingRaw('COUNT(*) > 1')
                ->exists();

            Schema::table('recipes', function (Blueprint $table) use ($hasDuplicateSlugs) {
                if (! Schema::hasIndex('recipes', ['slug'])) {
                    if (! $hasDuplicateSlugs) {
                        $table->unique('slug');
                    } else {
                        $table->index('slug');
                    }
                }

                if (! Schema::hasIndex('recipes', ['status', 'created_at'])) {
                    $table->index(['status', 'created_at']);
                }

                if (! Schema::hasIndex('recipes', ['status', 'needs_reapproval'])) {
                    $table->index(['status', 'needs_reapproval']);
                }

                if (! Schema::hasIndex('recipes', ['difficulty'])) {
                    $table->index('difficulty');
                }
            });
        }

        if (Schema::hasTable('lists')) {
            Schema::table('lists', function (Blueprint $table) {
                if (! Schema::hasIndex('lists', ['is_public', 'status', 'created_at'])) {
                    $table->index(['is_public', 'status', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('reports')) {
            Schema::table('reports', function (Blueprint $table) {
                if (! Schema::hasIndex('reports', ['status', 'type', 'created_at'])) {
                    $table->index(['status', 'type', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('meal_plans')) {
            Schema::table('meal_plans', function (Blueprint $table) {
                if (! Schema::hasIndex('meal_plans', ['is_public', 'created_at'])) {
                    $table->index(['is_public', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasIndex('users', ['role'])) {
                    $table->index('role');
                }

                if (! Schema::hasIndex('users', ['is_banned', 'deletion_requested'])) {
                    $table->index(['is_banned', 'deletion_requested']);
                }
            });
        }

        if (Schema::hasTable('anonymous_authors')) {
            Schema::table('anonymous_authors', function (Blueprint $table) {
                if (! Schema::hasIndex('anonymous_authors', ['name'])) {
                    $table->index('name');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('recipes')) {
            Schema::table('recipes', function (Blueprint $table) {
                if (Schema::hasIndex('recipes', ['slug'], 'unique')) {
                    $table->dropUnique(['slug']);
                } elseif (Schema::hasIndex('recipes', ['slug'])) {
                    $table->dropIndex(['slug']);
                }

                if (Schema::hasIndex('recipes', ['status', 'created_at'])) {
                    $table->dropIndex(['status', 'created_at']);
                }

                if (Schema::hasIndex('recipes', ['status', 'needs_reapproval'])) {
                    $table->dropIndex(['status', 'needs_reapproval']);
                }

                if (Schema::hasIndex('recipes', ['difficulty'])) {
                    $table->dropIndex(['difficulty']);
                }
            });
        }

        if (Schema::hasTable('lists')) {
            Schema::table('lists', function (Blueprint $table) {
                if (Schema::hasIndex('lists', ['is_public', 'status', 'created_at'])) {
                    $table->dropIndex(['is_public', 'status', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('reports')) {
            Schema::table('reports', function (Blueprint $table) {
                if (Schema::hasIndex('reports', ['status', 'type', 'created_at'])) {
                    $table->dropIndex(['status', 'type', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('meal_plans')) {
            Schema::table('meal_plans', function (Blueprint $table) {
                if (Schema::hasIndex('meal_plans', ['is_public', 'created_at'])) {
                    $table->dropIndex(['is_public', 'created_at']);
                }
            });
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasIndex('users', ['role'])) {
                    $table->dropIndex(['role']);
                }

                if (Schema::hasIndex('users', ['is_banned', 'deletion_requested'])) {
                    $table->dropIndex(['is_banned', 'deletion_requested']);
                }
            });
        }

        if (Schema::hasTable('anonymous_authors')) {
            Schema::table('anonymous_authors', function (Blueprint $table) {
                if (Schema::hasIndex('anonymous_authors', ['name'])) {
                    $table->dropIndex(['name']);
                }
            });
        }
    }
};
