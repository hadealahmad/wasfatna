<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Ingredient; // Assuming you have an Ingredient model
use App\Models\Recipe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RandomizerController extends Controller
{
    public function index()
    {
        // Fetch ingredients for the exclusion filter
        // Ideally we only want ingredients that are actually used in recipes
        // For now, let's just fetch all or top ingredients
        $ingredients = \DB::table('ingredients')
            ->select('id', 'name')
            ->distinct()
            ->get(); 
            // Warning: If 'ingredients' table behaves differently (e.g. pivoting), adjust.
            // If ingredients are stored as JSON in recipes, we might need a different approach.
            // Let's assume there is an ingredients table for now or we might need to extract them.
            
        // If ingredients are just JSON in recipes table, we might skip passing ingredients list 
        // or hardcode common ones, or use tags instead. 
        // The frontend uses `IngredientSelector`.
        
        // Let's check `Recipe` model structure later. For now, empty list or tags.
        
        return Inertia::render('Randomizer/Index', [
            // 'ingredients' => $ingredients, 
        ]);
    }
}
