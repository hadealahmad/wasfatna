<?php

namespace App\Console\Commands;

use App\Models\Recipe;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixIngredientSortOrder extends Command
{
    protected $signature = 'fix:ingredient-sort-order';
    protected $description = 'Set sort_order for existing recipe ingredients based on their ID order';

    public function handle(): int
    {
        $this->info('Fixing ingredient sort order for all recipes...');

        $recipes = Recipe::all();
        $bar = $this->output->createProgressBar($recipes->count());

        foreach ($recipes as $recipe) {
            // Get ingredients ordered by their pivot table id (insertion order)
            $ingredients = DB::table('recipe_ingredients')
                ->where('recipe_id', $recipe->id)
                ->orderBy('id')
                ->get();

            foreach ($ingredients as $index => $row) {
                DB::table('recipe_ingredients')
                    ->where('id', $row->id)
                    ->update(['sort_order' => $index]);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done! All recipe ingredients now have proper sort_order values.');

        return Command::SUCCESS;
    }
}
