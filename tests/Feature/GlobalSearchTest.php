<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeList;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GlobalSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_global_search_returns_empty_groups_for_short_queries(): void
    {
        $response = $this->getJson('/api/search/global?q=ك');

        $response->assertOk()
            ->assertExactJson([
                'recipes' => [],
                'cities' => [],
                'lists' => [],
                'tags' => [],
                'ingredients' => [],
            ]);
    }

    public function test_global_search_returns_grouped_approved_and_public_results_with_arabic_normalization(): void
    {
        $user = User::factory()->create();
        $city = City::create(['name' => 'دمشقية', 'slug' => 'damascus']);
        $tag = Tag::create(['name' => 'أكل صحّي', 'slug' => 'healthy']);
        $ingredient = Ingredient::create(['name' => 'صنوبر محمّص']);

        $approvedRecipe = Recipe::create([
            'name' => 'كبة مشوية شامية',
            'description' => 'وصفة تقليدية',
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'متوسطة',
            'city_id' => $city->id,
            'user_id' => $user->id,
        ]);
        $approvedRecipe->forceFill(['status' => 'approved'])->save();
        $approvedRecipe->tags()->attach($tag->id);
        $approvedRecipe->ingredients()->attach($ingredient->id, [
            'amount' => '50',
            'unit' => 'غرام',
            'group' => 'المكونات',
            'sort_order' => 0,
        ]);

        $pendingRecipe = Recipe::create([
            'name' => 'كبة مقلية قيد المراجعة',
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'سهلة',
            'city_id' => $city->id,
            'user_id' => $user->id,
        ]);
        $pendingRecipe->forceFill(['status' => 'pending'])->save();

        $publicList = RecipeList::create([
            'user_id' => $user->id,
            'name' => 'قائمة الكبة السورية',
            'slug' => 'kibbeh-list',
            'is_public' => true,
            'status' => 'approved',
        ]);
        $publicList->recipes()->attach($approvedRecipe->id);

        RecipeList::create([
            'user_id' => $user->id,
            'name' => 'قائمة الكبة الخاصة',
            'slug' => 'private-kibbeh',
            'is_public' => false,
            'status' => 'draft',
        ]);

        // Search using ta-marbuta/ha variant ("كبه" matches "كبة")
        $response = $this->getJson('/api/search/global?q=كبه');
        $response->assertOk();
        $data = $response->json();

        $this->assertCount(1, $data['recipes']);
        $this->assertSame('كبة مشوية شامية', $data['recipes'][0]['name']);
        $this->assertCount(1, $data['lists']);
        $this->assertSame('قائمة الكبة السورية', $data['lists'][0]['name']);

        // Search city with ta-marbuta variant ("دمشقيه" matches "دمشقية")
        $cityResponse = $this->getJson('/api/search/global?q=دمشقيه');
        $cityResponse->assertOk();
        $this->assertCount(1, $cityResponse->json('cities'));
        $this->assertSame('دمشقية', $cityResponse->json('cities.0.name'));

        // Search tag without hamza or shadda ("اكل صحي" matches "أكل صحّي")
        $tagResponse = $this->getJson('/api/search/global?q=اكل صحي');
        $tagResponse->assertOk();
        $this->assertCount(1, $tagResponse->json('tags'));
        $this->assertSame('أكل صحّي', $tagResponse->json('tags.0.name'));

        // Search ingredient without shadda ("محمص" matches "صنوبر محمّص")
        $ingredientResponse = $this->getJson('/api/search/global?q=محمص');
        $ingredientResponse->assertOk();
        $this->assertCount(1, $ingredientResponse->json('ingredients'));
        $this->assertSame('صنوبر محمّص', $ingredientResponse->json('ingredients.0.name'));
    }

    public function test_search_and_recipes_pages_support_q_and_search_parameters(): void
    {
        $user = User::factory()->create();
        $recipe = Recipe::create([
            'name' => 'أرز بالبازلاء',
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'سهلة',
            'user_id' => $user->id,
        ]);
        $recipe->forceFill(['status' => 'approved'])->save();

        $this->get('/search?q=ارز')->assertStatus(200);
        $this->get('/recipes?search=ارز')->assertStatus(200);
    }
}
