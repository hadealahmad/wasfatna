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
        Schema::table('recipes', function (Blueprint $table) {
            // Drop the ingredients JSON column if it exists
            if (Schema::hasColumn('recipes', 'ingredients')) {
                $table->dropColumn('ingredients');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('recipes', function (Blueprint $table) {
            // Re-add the column if rolling back
            $table->json('ingredients')->nullable();
        });
    }
};
