<?php

namespace Tests\Feature;

use App\Models\CalorieProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CalorieCalculatorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('inertia.testing.ensure_pages_exist', false);
    }

    /**
     * @return array<string, mixed>
     */
    private function validPayload(array $overrides = []): array
    {
        return array_replace_recursive([
            'gender' => 'male',
            'age' => 29,
            'height_cm' => 176,
            'weight_kg' => 81.5,
            'activity_level' => 'moderate',
            'weight_trend' => 'maintaining',
            'goal' => 'lose',
            'meals' => [
                'breakfast' => [
                    ['foodId' => 'arabic_bread', 'portion' => 1],
                    ['foodId' => 'labneh_oil', 'portion' => 0.75],
                ],
                'lunch' => [
                    ['foodId' => 'rice_vermicelli', 'portion' => 1],
                    ['foodId' => 'syrian_stew', 'portion' => 1.5],
                ],
                'late_dinner' => [
                    ['foodId' => 'fruits', 'portion' => 0.5],
                ],
            ],
            'baseline_meals' => null,
        ], $overrides);
    }

    public function test_guest_can_view_calories_page_with_null_initial_profile(): void
    {
        $response = $this->withoutVite()->get(route('calories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Calories/Index')
            ->where('initialProfile', null)
        );
    }

    public function test_authenticated_user_receives_saved_profile_on_calories_page(): void
    {
        $user = User::factory()->create();
        $payload = $this->validPayload();

        CalorieProfile::create([
            'user_id' => $user->id,
            ...$payload,
        ]);

        $response = $this->actingAs($user)
            ->withoutVite()
            ->get(route('calories.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Calories/Index')
            ->where('initialProfile.gender', 'male')
            ->where('initialProfile.age', 29)
            ->where('initialProfile.height_cm', 176)
            ->where('initialProfile.weight_kg', 81.5)
            ->where('initialProfile.activity_level', 'moderate')
            ->where('initialProfile.weight_trend', 'maintaining')
            ->where('initialProfile.goal', 'lose')
            ->where('initialProfile.meals.breakfast.0.foodId', 'arabic_bread')
            ->where('initialProfile.meals.breakfast.1.portion', 0.75)
            ->where('initialProfile.baseline_meals', null)
        );
    }

    public function test_guest_cannot_update_calorie_profile(): void
    {
        $response = $this->putJson(route('web-api.calorie-profile.update'), $this->validPayload());

        $response->assertStatus(401);
        $this->assertDatabaseCount('calorie_profiles', 0);
    }

    public function test_banned_user_cannot_update_calorie_profile(): void
    {
        $user = User::factory()->create([
            'is_banned' => true,
            'ban_reason' => 'Violation',
        ]);

        $response = $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $this->validPayload());

        $response->assertStatus(403);
        $this->assertDatabaseCount('calorie_profiles', 0);
    }

    public function test_authenticated_user_can_create_and_update_calorie_profile_via_upsert(): void
    {
        $user = User::factory()->create();
        $payload = $this->validPayload();

        $createResponse = $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $payload);

        $createResponse->assertStatus(200)
            ->assertJsonStructure([
                'profile' => [
                    'gender',
                    'age',
                    'height_cm',
                    'weight_kg',
                    'activity_level',
                    'weight_trend',
                    'goal',
                    'meals' => ['breakfast', 'lunch', 'late_dinner'],
                    'baseline_meals',
                ],
                'saved_at',
            ])
            ->assertJsonPath('profile.age', 29)
            ->assertJsonPath('profile.meals.lunch.1.portion', 1.5);

        $this->assertDatabaseCount('calorie_profiles', 1);
        $this->assertNotNull($user->fresh()->calorieProfile);

        // Second PUT updates existing profile cleanly, including baseline_meals and empty meal array
        $updatedPayload = $this->validPayload([
            'gender' => 'female',
            'age' => 32,
            'height_cm' => 165,
            'weight_kg' => 64,
            'activity_level' => 'active',
            'weight_trend' => 'losing',
            'goal' => 'maintain',
            'meals' => [
                'breakfast' => [
                    ['foodId' => 'eggs', 'portion' => 0.5],
                ],
                'lunch' => [
                    ['foodId' => 'grills', 'portion' => 1],
                ],
                'late_dinner' => [],
            ],
            'baseline_meals' => [
                'breakfast' => [
                    ['foodId' => 'manousheh', 'portion' => 1],
                ],
                'lunch' => [
                    ['foodId' => 'kabsa_ouzi', 'portion' => 2],
                ],
                'late_dinner' => [],
            ],
        ]);
        // Array replace recursive merges indexed breakfast/lunch arrays, so overwrite cleanly:
        $updatedPayload['meals'] = [
            'breakfast' => [['foodId' => 'eggs', 'portion' => 0.5]],
            'lunch' => [['foodId' => 'grills', 'portion' => 1]],
            'late_dinner' => [],
        ];

        $updateResponse = $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $updatedPayload);

        $updateResponse->assertStatus(200)
            ->assertJsonPath('profile.gender', 'female')
            ->assertJsonPath('profile.goal', 'maintain')
            ->assertJsonPath('profile.meals.late_dinner', [])
            ->assertJsonPath('profile.baseline_meals.lunch.0.foodId', 'kabsa_ouzi')
            ->assertJsonPath('profile.baseline_meals.lunch.0.portion', 2);

        $this->assertDatabaseCount('calorie_profiles', 1);
    }

    public function test_validation_rejects_invalid_calorie_profile_inputs(): void
    {
        $user = User::factory()->create();

        // Out-of-bounds and invalid enums
        $invalidCore = $this->validPayload([
            'gender' => 'other',
            'age' => 9,
            'height_cm' => 280,
            'weight_kg' => 15,
            'activity_level' => 'extreme',
            'weight_trend' => 'fluctuating',
            'goal' => 'bulk_fast',
        ]);

        $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $invalidCore)
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'gender',
                'age',
                'height_cm',
                'weight_kg',
                'activity_level',
                'weight_trend',
                'goal',
            ]);

        // Invalid portion step
        $invalidPortion = $this->validPayload();
        $invalidPortion['meals']['breakfast'][0]['portion'] = 0.33;

        $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $invalidPortion)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['meals.breakfast.0.portion']);

        // Missing required meal bucket
        $missingMealKey = $this->validPayload();
        unset($missingMealKey['meals']['late_dinner']);

        $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $missingMealKey)
            ->assertStatus(422)
            ->assertJsonValidationErrors(['meals.late_dinner']);

        // Invalid baseline_meals structure
        $invalidBaseline = $this->validPayload([
            'baseline_meals' => [
                'breakfast' => [
                    ['foodId' => 'arabic_bread', 'portion' => 3],
                ],
                'lunch' => [],
            ],
        ]);

        $this->actingAs($user)
            ->putJson(route('web-api.calorie-profile.update'), $invalidBaseline)
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'baseline_meals.breakfast.0.portion',
                'baseline_meals.late_dinner',
            ]);
    }
}
