<?php

namespace Tests\Feature;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AboutPageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_about_page_renders_github_and_community_contributors(): void
    {
        Http::fake([
            'https://api.github.com/repos/hadealahmad/wasfatna/contributors*' => Http::response([
                [
                    'login' => 'hadealahmad',
                    'type' => 'User',
                    'avatar_url' => 'https://avatars.githubusercontent.com/u/1?v=4',
                    'html_url' => 'https://github.com/hadealahmad',
                    'contributions' => 42,
                ],
                [
                    'login' => '0xhsn',
                    'type' => 'User',
                    'avatar_url' => 'https://avatars.githubusercontent.com/u/2?v=4',
                    'html_url' => 'https://github.com/0xhsn',
                    'contributions' => 15,
                ],
                [
                    'login' => 'dependabot[bot]',
                    'type' => 'Bot',
                    'avatar_url' => 'https://avatars.githubusercontent.com/in/29110?v=4',
                    'html_url' => 'https://github.com/apps/dependabot',
                    'contributions' => 8,
                ],
                [
                    'login' => 'renovate[bot]',
                    'type' => 'User',
                    'avatar_url' => 'https://avatars.githubusercontent.com/in/2740?v=4',
                    'html_url' => 'https://github.com/apps/renovate',
                    'contributions' => 3,
                ],
            ], 200),
        ]);

        $topCook = User::factory()->create([
            'name' => 'سارة الشامية',
            'display_name' => 'أم كريم',
        ]);
        $secondCook = User::factory()->create([
            'name' => 'خالد الحلبي',
        ]);
        $pendingOnlyCook = User::factory()->create([
            'name' => 'ليلى الحمصية',
        ]);
        $bannedCook = User::factory()->create([
            'name' => 'مستخدم محظور',
        ]);
        $bannedCook->forceFill(['is_banned' => true])->save();

        // Top cook: 3 approved + 1 pending + 1 rejected (only approved counts)
        for ($i = 1; $i <= 3; $i++) {
            $this->createRecipe($topCook, "وصفة معتمدة {$i}", 'approved');
        }
        $this->createRecipe($topCook, 'وصفة قيد المراجعة', 'pending');
        $this->createRecipe($topCook, 'وصفة مرفوضة', 'rejected');

        // Second cook: 1 approved
        $this->createRecipe($secondCook, 'كبة حلبية', 'approved');

        // Pending-only cook: should not appear in community contributors
        $this->createRecipe($pendingOnlyCook, 'حلاوة الجبن', 'pending');

        // Banned cook: 2 approved recipes, must be excluded from contributors list
        $this->createRecipe($bannedCook, 'وصفة محظور 1', 'approved');
        $this->createRecipe($bannedCook, 'وصفة محظور 2', 'approved');

        // Anonymous-attributed approved recipe: included in total approved count, not attributed to user
        $this->createRecipe($pendingOnlyCook, 'وصفة تراثية مجهولة المصدر', 'approved', isAnonymous: true);

        $response = $this->get(route('about'));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('About')
                ->has('contributors', 2)
                ->where('contributors.0.login', 'hadealahmad')
                ->where('contributors.0.contributions', 42)
                ->where('contributors.1.login', '0xhsn')
                ->where('contributors.1.contributions', 15)
                ->has('communityContributors', 2)
                ->where('communityContributors.0.id', $topCook->id)
                ->where('communityContributors.0.name', 'أم كريم')
                ->where('communityContributors.0.recipes_count', 3)
                ->where('communityContributors.1.id', $secondCook->id)
                ->where('communityContributors.1.name', 'خالد الحلبي')
                ->where('communityContributors.1.recipes_count', 1)
                ->where('stats.contributing_cooks', 2)
                ->where('stats.approved_recipes', 7)
            );
    }

    public function test_about_page_handles_github_http_failure_gracefully(): void
    {
        Http::fake([
            'https://api.github.com/repos/hadealahmad/wasfatna/contributors*' => Http::response(
                ['message' => 'API rate limit exceeded'],
                403
            ),
        ]);

        $response = $this->get('/about');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('About')
                ->has('contributors', 0)
                ->has('communityContributors', 0)
                ->where('stats.approved_recipes', 0)
                ->where('stats.contributing_cooks', 0)
            );
    }

    public function test_about_page_handles_github_connection_exception_gracefully(): void
    {
        Http::fake(function () {
            throw new ConnectionException('Could not resolve host');
        });

        $response = $this->get('/about');

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('About')
                ->has('contributors', 0)
            );
    }

    public function test_terms_and_privacy_pages_return_successful_responses(): void
    {
        $this->get('/terms')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Terms'));

        $this->get('/privacy')
            ->assertOk()
            ->assertDontSee('googletagmanager.com/gtag/js', false)
            ->assertInertia(fn (Assert $page) => $page->component('Privacy'));
    }

    private function createRecipe(User $user, string $name, string $status, bool $isAnonymous = false): Recipe
    {
        $recipe = Recipe::create([
            'name' => $name,
            'steps' => ['الخطوة الأولى'],
            'difficulty' => 'متوسطة',
            'user_id' => $user->id,
            'is_anonymous' => $isAnonymous,
        ]);

        $recipe->forceFill(['status' => $status])->save();

        return $recipe;
    }
}
