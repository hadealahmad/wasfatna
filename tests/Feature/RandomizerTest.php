<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RandomizerTest extends TestCase
{
    use RefreshDatabase;

    public function test_randomizer_page_renders(): void
    {
        $this->get('/randomizer')->assertOk();
    }

    public function test_randomizer_api_returns_only_approved_recipes_with_metadata(): void
    {
        $user = User::factory()->create();
        $city = City::create(['name' => 'دمشق', 'slug' => 'damascus']);

        $approved = Recipe::create([
            'name' => 'كبة لبنية',
            'description' => 'طبق شامي أصيل',
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'صعبة',
            'servings' => '4 أشخاص',
            'city_id' => $city->id,
            'user_id' => $user->id,
        ]);
        $approved->forceFill(['status' => 'approved'])->save();

        $pending = Recipe::create([
            'name' => 'وصفة قيد المراجعة',
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'سهلة',
            'city_id' => $city->id,
            'user_id' => $user->id,
        ]);
        $pending->forceFill(['status' => 'pending'])->save();

        $response = $this->getJson('/api/recipes/randomizer');
        $response->assertOk()
            ->assertJsonPath('total_matching', 1)
            ->assertJsonCount(1, 'recipes')
            ->assertJsonPath('recipes.0.name', 'كبة لبنية')
            ->assertJsonPath('recipes.0.difficulty', 'صعبة')
            ->assertJsonPath('recipes.0.city.name', 'دمشق');
    }

    public function test_randomizer_api_excludes_ingredients_via_both_exclude_and_exclude_ingredients_params(): void
    {
        $user = User::factory()->create();
        $meat = Ingredient::create(['name' => 'لحم مفروم']);
        $lentils = Ingredient::create(['name' => 'عدس']);

        $meatRecipe = Recipe::create([
            'name' => 'كبة بالصينية',
            'steps' => ['الخطوة 1'],
            'difficulty' => 'متوسطة',
            'user_id' => $user->id,
        ]);
        $meatRecipe->forceFill(['status' => 'approved'])->save();
        $meatRecipe->ingredients()->attach($meat->id, ['sort_order' => 0]);

        $vegRecipe = Recipe::create([
            'name' => 'مجدرة برغل',
            'steps' => ['الخطوة 1'],
            'difficulty' => 'سهلة',
            'user_id' => $user->id,
        ]);
        $vegRecipe->forceFill(['status' => 'approved'])->save();
        $vegRecipe->ingredients()->attach($lentils->id, ['sort_order' => 0]);

        // Compact comma-separated `exclude`
        $this->getJson('/api/recipes/randomizer?exclude='.$meat->id)
            ->assertOk()
            ->assertJsonPath('total_matching', 1)
            ->assertJsonPath('recipes.0.name', 'مجدرة برغل');

        // Array `exclude_ingredients[]`
        $this->getJson('/api/recipes/randomizer?exclude_ingredients[]='.$lentils->id)
            ->assertOk()
            ->assertJsonPath('total_matching', 1)
            ->assertJsonPath('recipes.0.name', 'كبة بالصينية');

        // Exclude both -> empty pool
        $this->getJson('/api/recipes/randomizer?exclude='.$meat->id.','.$lentils->id)
            ->assertOk()
            ->assertJsonPath('total_matching', 0)
            ->assertJsonCount(0, 'recipes');
    }

    public function test_randomizer_api_filters_by_city_and_difficulty(): void
    {
        $user = User::factory()->create();
        $aleppo = City::create(['name' => 'حلب', 'slug' => 'aleppo']);
        $homs = City::create(['name' => 'حمص', 'slug' => 'homs']);

        $r1 = Recipe::create([
            'name' => 'كباب كرز',
            'steps' => ['1'],
            'difficulty' => 'صعبة',
            'city_id' => $aleppo->id,
            'user_id' => $user->id,
        ]);
        $r1->forceFill(['status' => 'approved'])->save();

        $r2 = Recipe::create([
            'name' => 'حلاوة الجبن',
            'steps' => ['1'],
            'difficulty' => 'سهلة',
            'city_id' => $homs->id,
            'user_id' => $user->id,
        ]);
        $r2->forceFill(['status' => 'approved'])->save();

        $this->getJson('/api/recipes/randomizer?city=aleppo&difficulty='.urlencode('صعبة'))
            ->assertOk()
            ->assertJsonPath('total_matching', 1)
            ->assertJsonPath('recipes.0.name', 'كباب كرز');
    }
}
