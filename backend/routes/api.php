<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ImportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==================== PUBLIC ROUTES ====================

// Authentication
Route::prefix('auth')->group(function () {
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Recipes (public read)
Route::get('recipes', [RecipeController::class, 'index']);
Route::get('recipes/randomizer', [\App\Http\Controllers\Api\RandomizerController::class, 'index']);
Route::get('recipes/{slug}', [RecipeController::class, 'show']);
Route::get('recipes/{slug}/variations', [RecipeController::class, 'variations']);
Route::get('recipes/randomizer', [\App\Http\Controllers\Api\RandomizerController::class, 'index']);

// Cities
Route::get('cities', [CityController::class, 'index']);
Route::get('cities/{slug}/recipes', [CityController::class, 'recipes']);

// Users (public profiles)
Route::get('users/{id}', [UserController::class, 'show']);
Route::get('users/{id}/recipes', [UserController::class, 'recipes']);

// Ingredients (autocomplete - public)
Route::get('ingredients/search', [IngredientController::class, 'search']);

// Tags (autocomplete - public)
Route::get('tags', [\App\Http\Controllers\Api\TagController::class, 'index']);

// ==================== AUTHENTICATED ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned'])->group(function () {
    // Current user
    Route::get('user', [AuthController::class, 'user']);
    Route::put('user/profile', [AuthController::class, 'updateProfile']);
    Route::post('user/request-deletion', [AuthController::class, 'requestDeletion']);
    Route::post('user/cancel-deletion', [AuthController::class, 'cancelDeletion']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    
    // User's own recipes
    Route::get('my-recipes', [RecipeController::class, 'myRecipes']);
    Route::post('recipes', [RecipeController::class, 'store']);
    Route::put('recipes/{recipe}', [RecipeController::class, 'update']);
    Route::post('recipes/{recipe}/unpublish', [RecipeController::class, 'unpublish']);
    Route::get('recipes/{recipe}/history', [RecipeController::class, 'history']);
    Route::get('recipes/{recipe}/history', [RecipeController::class, 'history']);
    Route::delete('recipes/{recipe}/history', [RecipeController::class, 'clearHistory']);
    
    // Reports
    Route::post('reports', [\App\Http\Controllers\Api\ReportController::class, 'store']);
    Route::get('my-reports', [\App\Http\Controllers\Api\ReportController::class, 'userIndex']);
});

// ==================== MODERATOR ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned', 'moderator'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    
    // Recipe management
    Route::get('recipes/pending', [AdminController::class, 'pendingRecipes']);
    Route::get('recipes', [AdminController::class, 'allRecipes']);
    Route::post('recipes/bulk', [AdminController::class, 'bulkRecipeActions']);
    Route::post('recipes/{recipe}/approve', [AdminController::class, 'approveRecipe']);
    Route::post('recipes/{recipe}/reject', [AdminController::class, 'rejectRecipe']);
    Route::post('recipes/{recipe}/unpublish', [AdminController::class, 'unpublishRecipe']);
    
    // Ingredients (list)
    Route::get('ingredients', [IngredientController::class, 'index']);
    
    // Anonymous authors
    Route::get('anonymous-authors', [AdminController::class, 'anonymousAuthors']);
    Route::post('anonymous-authors', [AdminController::class, 'createAnonymousAuthor']);

    // Tags
    Route::post('tags/bulk', [\App\Http\Controllers\Api\TagController::class, 'bulkDestroy']);
    Route::get('tags', [\App\Http\Controllers\Api\TagController::class, 'adminIndex']);
    Route::apiResource('tags', \App\Http\Controllers\Api\TagController::class)->except(['index', 'show']);

    // List management (moderator access)
    Route::get('lists', [\App\Http\Controllers\Api\AdminListController::class, 'index']);
    Route::get('lists/pending', [\App\Http\Controllers\Api\AdminListController::class, 'pending']);
    Route::post('lists/bulk', [\App\Http\Controllers\Api\AdminListController::class, 'bulkAction']);
    Route::post('lists/{list}/approve', [\App\Http\Controllers\Api\AdminListController::class, 'approve']);
    Route::post('lists/{list}/approve', [\App\Http\Controllers\Api\AdminListController::class, 'approve']);
    Route::post('lists/{list}/reject', [\App\Http\Controllers\Api\AdminListController::class, 'reject']);

    // Reports Management
    Route::get('reports', [\App\Http\Controllers\Api\ReportController::class, 'index']);
    Route::get('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'show']);
    Route::put('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'update']);
    Route::delete('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'destroy']);
    Route::post('reports/bulk', [\App\Http\Controllers\Api\ReportController::class, 'bulkAction']);
});

// ==================== ADMIN ONLY ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned', 'admin'])->prefix('admin')->group(function () {
    // User management
    Route::get('users', [AdminController::class, 'users']);
    Route::post('users/bulk', [AdminController::class, 'bulkUserActions']);
    Route::get('users/deletion-requests', [AdminController::class, 'deletionRequests']);
    Route::put('users/{user}/role', [AdminController::class, 'updateUserRole']);
    Route::post('users/{user}/ban', [AdminController::class, 'banUser']);
    Route::post('users/{user}/unban', [AdminController::class, 'unbanUser']);
    Route::delete('users/{user}', [AdminController::class, 'deleteUser']);
    
    // Recipe deletion (admin only)
    Route::delete('recipes/{recipe}', [RecipeController::class, 'destroy']);
    
    // City management
    Route::get('cities', [AdminController::class, 'cities']);
    Route::post('cities', [AdminController::class, 'createCity']);
    Route::post('cities/bulk', [AdminController::class, 'bulkCityActions']);
    Route::put('cities/{city}', [AdminController::class, 'updateCity']);
    Route::delete('cities/{city}', [AdminController::class, 'deleteCity']);

    // Data Import
    Route::post('import/recipes', [ImportController::class, 'importRecipes']);

    // Settings
    Route::get('settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);
    Route::put('settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);

    // AI Processing
    Route::get('ai/models', [\App\Http\Controllers\Api\AiController::class, 'getModels']);
    Route::post('ai/process', [\App\Http\Controllers\Api\AiController::class, 'process']);
    Route::post('ai/bulk-tag', [\App\Http\Controllers\Api\AiController::class, 'bulkTag']);
});

// ==================== AUTHENTICATED ROUTES (Lists) ====================

Route::middleware(['auth:sanctum', 'not-banned'])->group(function () {
    Route::apiResource('lists', \App\Http\Controllers\Api\ListController::class);
    Route::post('lists/{list}/items', [\App\Http\Controllers\Api\ListController::class, 'addRecipe']);
    Route::delete('lists/{list}/items', [\App\Http\Controllers\Api\ListController::class, 'removeRecipe']);
    Route::post('lists/{list}/toggle', [\App\Http\Controllers\Api\ListController::class, 'toggleRecipe']);
});

// Public List View
Route::get('public-lists', [\App\Http\Controllers\Api\ListController::class, 'publicIndex']);
Route::get('lists/{id}', [\App\Http\Controllers\Api\ListController::class, 'show']);
