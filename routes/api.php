<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\ImportController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\RecipeController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ==================== PUBLIC ROUTES ====================

// Authentication
Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
});

Route::middleware('throttle:60,1')->group(function () {
    // Recipes (public read)
    Route::get('recipes', [RecipeController::class, 'index']);
    Route::get('recipes/randomizer', [\App\Http\Controllers\Api\RandomizerController::class, 'index']);
    Route::get('recipes/{slug}', [RecipeController::class, 'show']);
    Route::get('recipes/{slug}/variations', [RecipeController::class, 'variations']);

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

    // Public List View (show() enforces its own visibility/ownership checks)
    Route::get('public-lists', [\App\Http\Controllers\Api\ListController::class, 'publicIndex'])->name('api.public-lists.index');
    Route::get('lists/{id}', [\App\Http\Controllers\Api\ListController::class, 'show'])->name('api.lists.show.public');
});

// ==================== AUTHENTICATED ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned'])->group(function () {
    // Current user (read)
    Route::get('user', [AuthController::class, 'user']);
    Route::get('my-recipes', [RecipeController::class, 'myRecipes']);
    Route::get('recipes/{recipe}/history', [RecipeController::class, 'history']);
    Route::get('my-reports', [\App\Http\Controllers\Api\ReportController::class, 'userIndex']);

    // Authenticated write routes
    Route::middleware('throttle:30,1')->group(function () {
        Route::put('user/profile', [AuthController::class, 'updateProfile']);
        Route::post('user/request-deletion', [AuthController::class, 'requestDeletion']);
        Route::post('user/cancel-deletion', [AuthController::class, 'cancelDeletion']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::post('recipes', [RecipeController::class, 'store']);
        Route::put('recipes/{recipe}', [RecipeController::class, 'update']);
        Route::post('recipes/{recipe}/unpublish', [RecipeController::class, 'unpublish']);
        Route::delete('recipes/{recipe}/history', [RecipeController::class, 'clearHistory']);

        Route::post('reports', [\App\Http\Controllers\Api\ReportController::class, 'store']);
    });
});

// ==================== MODERATOR ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned', 'moderator'])->prefix('admin')->group(function () {
    // Dashboard & Read routes
    Route::get('dashboard', [AdminController::class, 'dashboard']);
    Route::get('recipes/pending', [AdminController::class, 'pendingRecipes']);
    Route::get('recipes', [AdminController::class, 'allRecipes']);
    Route::get('ingredients', [IngredientController::class, 'index']);
    Route::get('anonymous-authors', [AdminController::class, 'anonymousAuthors']);
    Route::get('tags', [\App\Http\Controllers\Api\TagController::class, 'adminIndex']);
    Route::get('lists', [\App\Http\Controllers\Api\AdminListController::class, 'index']);
    Route::get('lists/pending', [\App\Http\Controllers\Api\AdminListController::class, 'pending']);
    Route::get('reports', [\App\Http\Controllers\Api\ReportController::class, 'index']);
    Route::get('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'show']);

    // Moderator write routes
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('recipes/bulk', [AdminController::class, 'bulkRecipeActions']);
        Route::post('recipes/{recipe}/approve', [AdminController::class, 'approveRecipe']);
        Route::post('recipes/{recipe}/reject', [AdminController::class, 'rejectRecipe']);
        Route::post('recipes/{recipe}/unpublish', [AdminController::class, 'unpublishRecipe']);

        Route::post('anonymous-authors', [AdminController::class, 'createAnonymousAuthor']);

        Route::post('tags/bulk', [\App\Http\Controllers\Api\TagController::class, 'bulkDestroy']);
        Route::apiResource('tags', \App\Http\Controllers\Api\TagController::class)->except(['index', 'show']);

        Route::post('lists/bulk', [\App\Http\Controllers\Api\AdminListController::class, 'bulkAction']);
        Route::post('lists/{list}/approve', [\App\Http\Controllers\Api\AdminListController::class, 'approve']);
        Route::post('lists/{list}/reject', [\App\Http\Controllers\Api\AdminListController::class, 'reject']);

        Route::put('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'update']);
        Route::delete('reports/{report}', [\App\Http\Controllers\Api\ReportController::class, 'destroy']);
        Route::post('reports/bulk', [\App\Http\Controllers\Api\ReportController::class, 'bulkAction']);
    });
});

// ==================== ADMIN ONLY ROUTES ====================

Route::middleware(['auth:sanctum', 'not-banned', 'admin'])->prefix('admin')->group(function () {
    // Admin read routes
    Route::get('users', [AdminController::class, 'users']);
    Route::get('users/deletion-requests', [AdminController::class, 'deletionRequests']);
    Route::get('cities', [AdminController::class, 'cities']);
    Route::get('settings', [\App\Http\Controllers\Api\SettingController::class, 'index']);

    // Admin write routes
    Route::middleware('throttle:30,1')->group(function () {
        Route::post('users/bulk', [AdminController::class, 'bulkUserActions']);
        Route::put('users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::post('users/{user}/ban', [AdminController::class, 'banUser']);
        Route::post('users/{user}/unban', [AdminController::class, 'unbanUser']);
        Route::delete('users/{user}', [AdminController::class, 'deleteUser']);

        Route::delete('recipes/{recipe}', [RecipeController::class, 'destroy']);

        Route::post('cities', [AdminController::class, 'createCity']);
        Route::post('cities/bulk', [AdminController::class, 'bulkCityActions']);
        Route::put('cities/{city}', [AdminController::class, 'updateCity']);
        Route::delete('cities/{city}', [AdminController::class, 'deleteCity']);

        Route::post('import/recipes', [ImportController::class, 'importRecipes']);
        Route::put('settings', [\App\Http\Controllers\Api\SettingController::class, 'update']);
    });

    // AI Processing
    Route::middleware('throttle:10,1')->group(function () {
        Route::get('ai/models', [\App\Http\Controllers\Api\AiController::class, 'getModels']);
        Route::post('ai/process', [\App\Http\Controllers\Api\AiController::class, 'process']);
        Route::post('ai/bulk-tag', [\App\Http\Controllers\Api\AiController::class, 'bulkTag']);
    });
});

// ==================== AUTHENTICATED ROUTES (Lists) ====================

Route::middleware(['auth:sanctum', 'not-banned'])->name('api.')->group(function () {
    Route::get('lists', [\App\Http\Controllers\Api\ListController::class, 'index'])->name('lists.index');

    Route::middleware('throttle:30,1')->group(function () {
        Route::apiResource('lists', \App\Http\Controllers\Api\ListController::class)->except(['index', 'show']);
        Route::post('lists/{list}/items', [\App\Http\Controllers\Api\ListController::class, 'addRecipe']);
        Route::delete('lists/{list}/items', [\App\Http\Controllers\Api\ListController::class, 'removeRecipe']);
        Route::post('lists/{list}/toggle', [\App\Http\Controllers\Api\ListController::class, 'toggleRecipe']);
    });
});
