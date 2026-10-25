<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;
use Illuminate\Support\Facades\Cache;

class LlmsController extends Controller
{
    public function index()
    {
        $content = Cache::remember('llms_index_txt', 3600, function () {
            $cities = City::withCount(['recipes' => fn($q) => $q->where('status', 'approved')])
                ->having('recipes_count', '>', 0)
                ->orderByDesc('recipes_count')
                ->get();

            $recipes = Recipe::where('status', 'approved')
                ->latest()
                ->limit(100)
                ->get();

            return view('markdown.llms', [
                'cities' => $cities,
                'recipes' => $recipes,
                'baseUrl' => config('app.url', 'https://food.syrian.zone'),
            ])->render();
        });

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    public function full()
    {
        $content = Cache::remember('llms_full_txt', 3600, function () {
            $recipes = Recipe::with(['city', 'tags', 'user', 'anonymousAuthor', 'ingredients'])
                ->where('status', 'approved')
                ->latest()
                ->get();

            return view('markdown.full', [
                'recipes' => $recipes,
                'baseUrl' => config('app.url', 'https://food.syrian.zone'),
            ])->render();
        });

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
