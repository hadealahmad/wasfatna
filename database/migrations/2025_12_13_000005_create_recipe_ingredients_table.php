<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Links recipes to master ingredients for search and similar recipe matching.
     * The actual ingredient text with quantities is stored in recipes.ingredients JSON.
     */
    public function up(): void
    {
        Schema::create('recipe_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipe_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ingredient_id')->constrained()->cascadeOnDelete();
            
            // New structured data
            $table->string('amount')->nullable();
            $table->string('unit')->nullable();
            $table->string('ingredient_descriptor')->nullable(); // e.g., "finely chopped", "lactose-free"
            $table->string('group')->nullable(); // For grouping like "Sauce", "Dough"

            $table->unique(['recipe_id', 'ingredient_id', 'group']); // Allow same ingredient in different groups? Or just remove unique constraint if multiple entries allowed? 
            // Better to allow multiple entries of same ingredient if needed (e.g. sugar in dough AND sauce).
            // So removing strict unique on [recipe_id, ingredient_id] might be safer, or including group/descriptor?
            // Let's just drop the unique constraint or make it more flexible. 
            // Actually, usually you wouldn't have same ingredient twice unless in different groups.
            // Let's index instead of unique for now to allow flexibility as user didn't specify strict uniqueness.
            // Or just index foreign keys.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipe_ingredients');
    }
};
