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
        Schema::create('lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->nullable();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_public')->default(false);
            $table->string('status')->default('draft'); // draft, review, approved, rejected
            $table->timestamps();
        });

        Schema::create('list_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('list_id')->constrained('lists')->onDelete('cascade');
            $table->foreignId('recipe_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->unique(['list_id', 'recipe_id']);
        });

        // Create default "Favorites" list for existing users
        $users = \Illuminate\Support\Facades\DB::table('users')->get();
        foreach ($users as $user) {
            \Illuminate\Support\Facades\DB::table('lists')->insert([
                'user_id' => $user->id,
                'name' => 'المفضلة',
                'slug' => 'favorites',
                'is_default' => true,
                'is_public' => false,
                'status' => 'draft',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('list_items');
        Schema::dropIfExists('lists');
    }
};
