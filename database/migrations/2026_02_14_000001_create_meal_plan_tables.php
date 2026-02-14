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
        Schema::create('meal_plan_presets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->string('type')->default('ramadan'); // ramadan|custom
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('meal_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->foreignId('preset_id')->nullable()->constrained('meal_plan_presets')->onDelete('set null');
            $table->boolean('is_public')->default(false);
            $table->string('share_token')->unique()->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
        });

        Schema::create('meal_plan_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meal_plan_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->foreignId('recipe_id')->nullable()->constrained()->onDelete('set null');
            $table->string('custom_title')->nullable();
            $table->text('notes')->nullable();
            $table->string('meal_type')->default('main'); // main|iftar|suhoor|dessert
            $table->boolean('is_done')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index(['meal_plan_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meal_plan_entries');
        Schema::dropIfExists('meal_plans');
        Schema::dropIfExists('meal_plan_presets');
    }
};
