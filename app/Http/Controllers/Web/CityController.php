<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\City;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::withCount(['recipes' => fn($q) => $q->where('status', 'approved')])->get();

        return Inertia::render('Cities/Index', [
            'cities' => $cities,
        ]);
    }

    public function show($slug)
    {
        $city = City::where('slug', $slug)->firstOrFail();
        
        $recipes = $city->recipes()
            ->where('status', 'approved')
            ->select([
                'id', 'name', 'slug', 'image_path', 'time_needed', 'difficulty',
                'city_id', 'user_id', 'anonymous_author_id', 'is_anonymous', 'status', 'created_at',
            ])
            ->with(['city:id,name,slug', 'user:id,name,avatar', 'anonymousAuthor:id,name', 'tags:id,name,slug'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Cities/Show', [
            'city' => $city,
            'recipes' => $recipes,
        ]);
    }
}
