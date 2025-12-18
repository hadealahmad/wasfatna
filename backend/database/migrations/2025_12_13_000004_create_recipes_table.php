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
        Schema::create('recipes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug');
            $table->string('image_path')->nullable();
            
            // Time can be structured (JSON) or simple string
            $table->json('time_needed')->nullable(); // Supports per-step times
            $table->string('servings')->nullable();
            
            // City/Region
            $table->foreignId('city_id')->nullable()->constrained()->nullOnDelete();
            
            // Author - either user or anonymous
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('anonymous_author_id')->nullable()
                  ->constrained('anonymous_authors')->nullOnDelete();
            $table->boolean('is_anonymous')->default(false);
            
            // Recipe content (JSON for flexible structure)
            // $table->json('ingredients'); // REMOVED: Using recipe_ingredients pivot table
            $table->json('steps'); // Supports grouped and simple arrays
            
            // Difficulty
            $table->enum('difficulty', ['سهلة جداً', 'سهلة', 'متوسطة', 'صعبة', 'صعبة جداً'])
                  ->default('متوسطة');
            
            // Status workflow
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'unpublished'])
                  ->default('draft');
            $table->text('rejection_reason')->nullable();
            
            // Approval tracking
            $table->foreignId('approved_by')->nullable()
                  ->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            
            // Editing after approval
            $table->boolean('needs_reapproval')->default(false);
            
            $table->timestamps();
            
            // Indexes for search and filtering
            $table->index('name');
            $table->index('status');
            $table->index(['name', 'status']); // For finding recipes with same name
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recipes');
    }
};
