<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Recipe;
use App\Models\City;

class LlmsController extends Controller
{
    public function index()
    {
        $cities = City::withCount('recipes')
            ->having('recipes_count', '>', 0)
            ->orderBy('name')
            ->get();

        $recipes = Recipe::where('status', 'approved')
            ->latest()
            ->limit(100)
            ->get();

        $content = view('markdown.llms', [
            'cities' => $cities,
            'recipes' => $recipes,
            'baseUrl' => config('app.url', 'https://wasfatna.com'),
        ])->render();

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
        ]);
    }

    public function full()
    {
        $recipes = Recipe::with(['city', 'tags', 'user', 'anonymousAuthor', 'ingredients'])
            ->where('status', 'approved')
            ->latest()
            ->get();

        $content = view('markdown.full', [
            'recipes' => $recipes,
            'baseUrl' => config('app.url', 'https://wasfatna.com'),
        ])->render();

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
        ]);
    }
}
