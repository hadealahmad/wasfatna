<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::withCount(['recipes' => function ($query) {
            $query->where('status', 'approved');
        }])->get();

        return Inertia::render('Cities/Index', [
            'cities' => $cities,
        ]);
    }

    public function show($slug)
    {
        $city = City::where('slug', $slug)->firstOrFail();
        
        $recipes = $city->recipes()
            ->where('status', 'approved')
            ->with(['user', 'tags'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Cities/Show', [
            'city' => $city,
            'recipes' => $recipes,
        ]);
    }
}
