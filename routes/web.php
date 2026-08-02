<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;
use Illuminate\Foundation\Application;

use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\AdminRecipeController;
use App\Http\Controllers\Web\AdminUserController;
use App\Http\Controllers\Web\AdminCityController;
use App\Http\Controllers\Web\AdminReportController;
use App\Http\Controllers\Web\AdminTagController;
use App\Http\Controllers\Web\AdminSettingController;
use App\Http\Controllers\Web\AdminDashboardController;
use App\Http\Controllers\Web\AdminListController;
use App\Http\Controllers\Web\WebAuthController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\RecipeController;
use App\Http\Controllers\Web\CityController;
use App\Http\Controllers\Web\ListController;
use App\Http\Controllers\Web\RandomizerController;
use App\Http\Controllers\Web\My\RecipeController as MyRecipeController;
use App\Http\Controllers\Web\My\ListController as MyListController;
use App\Http\Controllers\Web\My\ReportController as MyReportController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\UserController;
use App\Http\Controllers\Web\SearchController;
use App\Http\Controllers\Web\AdminImportController;
use App\Http\Controllers\Web\AdminMealPlanPresetController;
use App\Http\Controllers\Web\MealPlanController;

// DEV ONLY: Auto-login as admin (local environment only)
if (app()->environment('local')) {
    Route::get('/dev-login', function () {
        \Illuminate\Support\Facades\Auth::login(\App\Models\User::where('email', 'admin@wasfatna.com')->first(), true);
        return redirect('/');
    });
}

// Web Auth
Route::get('/login', [WebAuthController::class, 'login'])->name('login');
Route::get('/auth/google/redirect', [WebAuthController::class, 'redirectToGoogle'])->name('auth.google.redirect');
Route::get('/auth/google/callback', [WebAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
Route::post('/logout', [WebAuthController::class, 'logout'])->name('logout');

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public Pages
Route::get('/recipes', [RecipeController::class, 'index'])->name('recipes.index');
Route::get('/recipes/new', [RecipeController::class, 'create'])->name('recipes.create')->middleware('auth');
Route::post('/recipes', [RecipeController::class, 'store'])->name('recipes.store')->middleware('auth');
Route::get('/recipes/{slug}', [RecipeController::class, 'show'])->name('recipes.show');
Route::get('/recipes/{slug}/variations', [RecipeController::class, 'variations'])->name('recipes.variations');

Route::get('/cities', [CityController::class, 'index'])->name('cities.index');
Route::get('/cities/{slug}', [CityController::class, 'show'])->name('cities.show');

Route::get('/lists', [ListController::class, 'index'])->name('lists.index');
Route::get('/lists/{list}', [ListController::class, 'show'])->name('lists.show');

Route::get('/randomizer', [RandomizerController::class, 'index'])->name('randomizer.index');

Route::get('/privacy', function () { return Inertia::render('Privacy'); })->name('privacy');
Route::get('/terms', function () { return Inertia::render('Terms'); })->name('terms');
Route::get('/search', [SearchController::class, 'index'])->name('search.index');

Route::get('/meal-plans/shared/{token}', [MealPlanController::class, 'shared'])->name('meal-plans.shared');
Route::get('/meal-plans/browse', [MealPlanController::class, 'browse'])->name('meal-plans.browse');

// Public User Profile
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');

Route::middleware(['auth', 'not-banned'])->group(function () {
    // My Recipes
    Route::get('/my/recipes', [MyRecipeController::class, 'index'])->name('my.recipes.index');
    Route::get('/my/recipes/{recipe}/edit', [MyRecipeController::class, 'edit'])->name('my.recipes.edit');
    Route::put('/my/recipes/{recipe}', [MyRecipeController::class, 'update'])->name('my.recipes.update'); // PUT for RESTful update with spoofing
    Route::delete('/my/recipes/{recipe}', [MyRecipeController::class, 'destroy'])->name('my.recipes.destroy');

    // My Lists
    Route::resource('my/lists', MyListController::class)->names('my.lists');
    Route::post('/my/lists/{list}/request-publish', [MyListController::class, 'requestPublish'])->name('my.lists.request-publish');
    Route::post('/my/lists/{list}/unpublish', [MyListController::class, 'unpublish'])->name('my.lists.unpublish');

    // My Reports
    Route::get('/my/reports', [MyReportController::class, 'index'])->name('my.reports.index');

    // Profile Settings
    Route::get('/settings', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/settings', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('my/meal-plans', MealPlanController::class)->names('my.meal-plans')->parameters(['meal-plans' => 'meal_plan']);

    // Web API for lists (session-based auth - for modals/AJAX)
    Route::get('/web-api/lists', [\App\Http\Controllers\Api\ListController::class, 'index'])->name('web-api.lists.index');
    Route::post('/web-api/lists', [\App\Http\Controllers\Api\ListController::class, 'store'])->name('web-api.lists.store');
    Route::post('/web-api/lists/{list}/toggle', [\App\Http\Controllers\Api\ListController::class, 'toggleRecipe'])->name('web-api.lists.toggle');

    Route::post('/web-api/meal-plans/{mealPlan}/entries', [\App\Http\Controllers\Api\MealPlanController::class, 'addEntry'])->name('web-api.meal-plans.entries.store');
    Route::delete('/web-api/meal-plans/{mealPlan}/entries/{entry}', [\App\Http\Controllers\Api\MealPlanController::class, 'removeEntry'])->name('web-api.meal-plans.entries.destroy');
    Route::post('/web-api/meal-plans/{mealPlan}/entries/{entry}/done', [\App\Http\Controllers\Api\MealPlanController::class, 'toggleDone'])->name('web-api.meal-plans.entries.done');
    Route::put('/web-api/meal-plans/{mealPlan}/entries/{entry}', [\App\Http\Controllers\Api\MealPlanController::class, 'updateEntry'])->name('web-api.meal-plans.entries.update');
    Route::post('/web-api/meal-plans/{mealPlan}/random-fill', [\App\Http\Controllers\Api\MealPlanController::class, 'randomFill'])->name('web-api.meal-plans.random-fill');
    Route::post('/web-api/meal-plans/{mealPlan}/toggle-public', [\App\Http\Controllers\Api\MealPlanController::class, 'togglePublic'])->name('web-api.meal-plans.toggle-public');
    Route::get('/web-api/recipes/search', [\App\Http\Controllers\Api\MealPlanController::class, 'searchRecipes'])->name('web-api.recipes.search');
});

Route::middleware(['auth', 'not-banned', 'moderator'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    
    // Recipes
    Route::get('/dashboard/recipes', [AdminRecipeController::class, 'index'])->name('dashboard.recipes');
    Route::post('/dashboard/recipes/bulk', [AdminRecipeController::class, 'bulkActions'])->name('dashboard.recipes.bulk');
    Route::post('/dashboard/recipes/bulk-tag', [AdminRecipeController::class, 'bulkTag'])->name('dashboard.recipes.bulk_tag');
    Route::post('/dashboard/recipes/{recipe}/reject', [AdminRecipeController::class, 'reject'])->name('dashboard.recipes.reject');
    Route::post('/dashboard/recipes/{recipe}/approve', [AdminRecipeController::class, 'approve'])->name('dashboard.recipes.approve');
    Route::post('/dashboard/recipes/{recipe}/unpublish', [AdminRecipeController::class, 'unpublish'])->name('dashboard.recipes.unpublish');

    // AI Processing (web route for session auth)
    Route::post('/dashboard/ai/process', [\App\Http\Controllers\Api\AiController::class, 'process'])->name('dashboard.ai.process');

    // Users
    Route::middleware(['admin'])->group(function () {
        Route::get('/dashboard/users', [AdminUserController::class, 'index'])->name('dashboard.users');
        Route::post('/dashboard/users/bulk', [AdminUserController::class, 'bulkActions'])->name('dashboard.users.bulk');
        Route::post('/dashboard/users/{user}/role', [AdminUserController::class, 'updateRole'])->name('dashboard.users.role');
        Route::post('/dashboard/users/{user}/ban', [AdminUserController::class, 'ban'])->name('dashboard.users.ban');
        Route::post('/dashboard/users/{user}/unban', [AdminUserController::class, 'unban'])->name('dashboard.users.unban');
        Route::delete('/dashboard/users/{user}', [AdminUserController::class, 'destroy'])->name('dashboard.users.destroy');

        // Cities
        Route::get('/dashboard/cities', [AdminCityController::class, 'index'])->name('dashboard.cities');
        Route::post('/dashboard/cities', [AdminCityController::class, 'store'])->name('dashboard.cities.store');
        Route::post('/dashboard/cities/bulk', [AdminCityController::class, 'bulkActions'])->name('dashboard.cities.bulk');
        Route::put('/dashboard/cities/{city}', [AdminCityController::class, 'update'])->name('dashboard.cities.update');
        Route::delete('/dashboard/cities/{city}', [AdminCityController::class, 'destroy'])->name('dashboard.cities.destroy');

        // Settings
        Route::get('/dashboard/settings', [AdminSettingController::class, 'index'])->name('dashboard.settings');
        Route::post('/dashboard/settings', [AdminSettingController::class, 'update'])->name('dashboard.settings.update');
        Route::post('/dashboard/settings/import', [AdminSettingController::class, 'import'])->name('dashboard.settings.import');

        // Import
        Route::get('/dashboard/import', [AdminImportController::class, 'index'])->name('dashboard.import');
        Route::post('/dashboard/import', [AdminImportController::class, 'import'])->name('dashboard.import.store');

        Route::get('/dashboard/meal-plan-presets', [AdminMealPlanPresetController::class, 'index'])->name('dashboard.meal-plan-presets');
        Route::post('/dashboard/meal-plan-presets', [AdminMealPlanPresetController::class, 'store'])->name('dashboard.meal-plan-presets.store');
        Route::put('/dashboard/meal-plan-presets/{preset}', [AdminMealPlanPresetController::class, 'update'])->name('dashboard.meal-plan-presets.update');
        Route::delete('/dashboard/meal-plan-presets/{preset}', [AdminMealPlanPresetController::class, 'destroy'])->name('dashboard.meal-plan-presets.destroy');
    });

    // Reports (Admins & Moderators)
    Route::get('/dashboard/reports', [AdminReportController::class, 'index'])->name('dashboard.reports');
    Route::post('/dashboard/reports/bulk', [AdminReportController::class, 'bulkActions'])->name('dashboard.reports.bulk');
    Route::post('/dashboard/reports/{report}', [AdminReportController::class, 'update'])->name('dashboard.reports.update');
    Route::delete('/dashboard/reports/{report}', [AdminReportController::class, 'destroy'])->name('dashboard.reports.destroy');

    // Lists
    Route::get('/dashboard/lists', [AdminListController::class, 'index'])->name('dashboard.lists');
    Route::post('/dashboard/lists/bulk', [AdminListController::class, 'bulkActions'])->name('dashboard.lists.bulk');
    Route::put('/dashboard/lists/{list}', [AdminListController::class, 'update'])->name('dashboard.lists.update');
    Route::delete('/dashboard/lists/{list}', [AdminListController::class, 'destroy'])->name('dashboard.lists.destroy');

    // Tags
    Route::get('/dashboard/tags', [AdminTagController::class, 'index'])->name('dashboard.tags');
    Route::post('/dashboard/tags', [AdminTagController::class, 'store'])->name('dashboard.tags.store');
    Route::post('/dashboard/tags/bulk', [AdminTagController::class, 'bulkActions'])->name('dashboard.tags.bulk');
    Route::put('/dashboard/tags/{tag}', [AdminTagController::class, 'update'])->name('dashboard.tags.update');
    Route::delete('/dashboard/tags/{tag}', [AdminTagController::class, 'destroy'])->name('dashboard.tags.destroy');
});
