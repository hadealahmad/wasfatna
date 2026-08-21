<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Deduplicate ingredients by normalized_name, keeping the oldest row,
        // and re-point recipe_ingredients pivots to the surviving row.
        $duplicateIngredients = DB::table('ingredients')
            ->select('normalized_name', DB::raw('MIN(id) as keep_id'), DB::raw('GROUP_CONCAT(id) as ids'))
            ->groupBy('normalized_name')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicateIngredients as $row) {
            $ids = explode(',', $row->ids);
            $keepId = (int) $row->keep_id;
            $dupeIds = array_map('intval', array_diff($ids, [$row->keep_id]));

            // Drop pivots that would collide with an existing pivot on the kept row
            DB::table('recipe_ingredients')
                ->whereIn('ingredient_id', $dupeIds)
                ->whereIn('recipe_id', fn ($q) => $q->select('recipe_id')->from('recipe_ingredients')->where('ingredient_id', $keepId))
                ->delete();

            // Move the remaining pivots to the surviving ingredient
            DB::table('recipe_ingredients')->whereIn('ingredient_id', $dupeIds)->update(['ingredient_id' => $keepId]);
            DB::table('ingredients')->whereIn('id', $dupeIds)->delete();
        }

        // Deduplicate tags by slug
        $duplicateTags = DB::table('tags')
            ->select('slug', DB::raw('MIN(id) as keep_id'), DB::raw('GROUP_CONCAT(id) as ids'))
            ->groupBy('slug')
            ->havingRaw('COUNT(*) > 1')
            ->get();

        foreach ($duplicateTags as $row) {
            $ids = explode(',', $row->ids);
            $keepId = (int) $row->keep_id;
            $dupeIds = array_map('intval', array_diff($ids, [$row->keep_id]));

            DB::table('recipe_tags')
                ->whereIn('tag_id', $dupeIds)
                ->whereIn('recipe_id', fn ($q) => $q->select('recipe_id')->from('recipe_tags')->where('tag_id', $keepId))
                ->delete();

            DB::table('recipe_tags')->whereIn('tag_id', $dupeIds)->update(['tag_id' => $keepId]);
            DB::table('tags')->whereIn('id', $dupeIds)->delete();
        }

        if (! Schema::hasIndex('ingredients', 'ingredients_normalized_name_unique')) {
            Schema::table('ingredients', function (Blueprint $table) {
                $table->unique('normalized_name');
            });
        }

        if (! Schema::hasIndex('tags', 'tags_slug_unique')) {
            Schema::table('tags', function (Blueprint $table) {
                $table->unique('slug');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasIndex('ingredients', 'ingredients_normalized_name_unique')) {
            Schema::table('ingredients', function (Blueprint $table) {
                $table->dropUnique(['normalized_name']);
            });
        }

        if (Schema::hasIndex('tags', 'tags_slug_unique')) {
            Schema::table('tags', function (Blueprint $table) {
                $table->dropUnique(['slug']);
            });
        }
    }
};
