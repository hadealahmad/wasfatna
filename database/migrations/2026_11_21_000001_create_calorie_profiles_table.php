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
        Schema::create('calorie_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('gender', 16);
            $table->unsignedSmallInteger('age');
            $table->unsignedSmallInteger('height_cm');
            $table->float('weight_kg');
            $table->string('activity_level', 32);
            $table->string('weight_trend', 32);
            $table->string('goal', 32);
            $table->json('meals');
            $table->json('baseline_meals')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calorie_profiles');
    }
};
