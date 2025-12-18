<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('recipe_ingredients', function (Blueprint $table) {
            // Add new structured data columns if they don't exist
            if (!Schema::hasColumn('recipe_ingredients', 'amount')) {
                $table->string('amount')->nullable();
            }
            if (!Schema::hasColumn('recipe_ingredients', 'unit')) {
                $table->string('unit')->nullable();
            }
            if (!Schema::hasColumn('recipe_ingredients', 'ingredient_descriptor')) {
                $table->string('ingredient_descriptor')->nullable();
            }
            if (!Schema::hasColumn('recipe_ingredients', 'group')) {
                $table->string('group')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recipe_ingredients', function (Blueprint $table) {
            $table->dropColumn(['amount', 'unit', 'ingredient_descriptor', 'group']);
        });
    }
};
