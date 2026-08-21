<?php

namespace App\Services;

use App\Models\Ingredient;
use App\Models\Recipe;

class IngredientSyncService
{
    /**
     * Sync a recipe's ingredients from any supported input format:
     * - Grouped by string keys:  ["الصلصة" => [['name' => …], …]]
     * - Grouped objects:         [['name' => 'الصلصة', 'items' => […]], …]
     * - Flat list:               [['name' => …, 'amount' => …], 'بصل', …]
     *
     * Writes sequential sort_order values so ordering is deterministic,
     * and matches existing ingredients via normalized_name to avoid
     * duplicate ingredient records across write paths.
     */
    public function sync(Recipe $recipe, array $ingredients): void
    {
        $syncData = [];
        $sortOrder = 0;

        foreach ($ingredients as $key => $value) {
            if (is_string($key) && is_array($value)) {
                // Case 1: grouped by string key
                foreach ($value as $item) {
                    $this->processItem($item, $syncData, $key, $sortOrder);
                }
            } elseif (is_array($value) && isset($value['name'], $value['items']) && is_array($value['items'])) {
                // Case 2: group object with name + items
                foreach ($value['items'] as $item) {
                    $this->processItem($item, $syncData, $value['name'], $sortOrder);
                }
            } else {
                // Case 3: flat item (array or plain string)
                $this->processItem($value, $syncData, null, $sortOrder);
            }
        }

        $recipe->ingredients()->sync($syncData);
    }

    private function processItem(array|string $item, array &$syncData, ?string $group, int &$sortOrder): void
    {
        if (is_string($item)) {
            $name = $item;
            $amount = null;
            $unit = null;
            $descriptor = null;
        } else {
            $name = $item['name'] ?? null;
            $amount = $item['amount'] ?? null;
            $unit = $item['unit'] ?? null;
            $descriptor = $item['descriptor'] ?? null;
            $group = $item['group'] ?? $group;
        }

        if (! $name) {
            return;
        }

        $ingredient = Ingredient::firstOrCreate(
            ['normalized_name' => Ingredient::normalize($name)],
            ['name' => $name]
        );

        // Note: if the same ingredient appears in multiple groups, sync()
        // keeps only the last entry for that ID (pivot PK is recipe+ingredient).
        $syncData[$ingredient->id] = [
            'amount' => $amount,
            'unit' => $unit,
            'ingredient_descriptor' => $descriptor,
            'group' => $group ?? 'المكونات',
            'sort_order' => $sortOrder++,
        ];
    }
}
