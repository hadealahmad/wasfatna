<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = Cache::remember('admin_dashboard_counts', 60, fn () => [
            'total_recipes' => Recipe::count(),
            'approved_recipes' => Recipe::approved()->count(),
            'pending_recipes' => Recipe::pending()->count(),
            'needs_reapproval' => Recipe::needsReapproval()->count(),
            'total_users' => User::count(),
            'active_users' => User::where('is_banned', false)->count(),
            'deletion_requests' => User::where('deletion_requested', true)->count(),
            'total_cities' => City::count(),
            'total_ingredients' => Ingredient::count(),
        ]);

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
        ]);
    }
}
