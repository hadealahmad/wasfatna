<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Recipe;
use App\Models\RecipeList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Ssr\Gateway;
use Inertia\Ssr\Response as SsrResponse;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SsrHeadTest extends TestCase
{
    use RefreshDatabase;

    public function test_inertia_shares_ziggy_routes_and_location(): void
    {
        $this->get('/cities')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('ziggy.url')
                ->has('ziggy.routes')
                ->where('ziggy.location', url('/cities'))
            );
    }

    public function test_blade_suppresses_duplicate_head_tags_when_ssr_provides_them(): void
    {
        $this->app->instance(Gateway::class, new class implements Gateway
        {
            public function dispatch(array $page): ?SsrResponse
            {
                $head = implode("\n", [
                    '<title inertia>وصفة تجريبية | وصفاتنا</title>',
                    '<meta name="description" content="وصف مخصص للوصفة" inertia="description">',
                    '<meta property="og:title" content="وصفة تجريبية | وصفاتنا" inertia="og:title">',
                    '<meta property="og:description" content="وصف مخصص للوصفة" inertia="og:description">',
                    '<meta property="og:image" content="https://food.syrian.zone/custom.webp" inertia="og:image">',
                    '<meta property="og:type" content="article" inertia="og:type">',
                    '<meta name="robots" content="noindex, follow" inertia="robots">',
                    '<meta name="twitter:card" content="summary_large_image" inertia="twitter:card">',
                    '<meta name="twitter:title" content="وصفة تجريبية | وصفاتنا" inertia="twitter:title">',
                    '<meta name="twitter:description" content="وصف مخصص للوصفة" inertia="twitter:description">',
                    '<meta name="twitter:image" content="https://food.syrian.zone/custom.webp" inertia="twitter:image">',
                ]);

                return new SsrResponse($head, '<div id="app"><h1>وصفة تجريبية</h1></div>');
            }
        });

        $html = $this->get('/')->assertOk()->getContent();

        $this->assertSame(1, preg_match_all('/<title\b[^>]*>.*?<\/title>/is', $html));
        $this->assertStringContainsString('<title inertia>وصفة تجريبية | وصفاتنا</title>', $html);
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="description"/i', $html));
        $this->assertStringContainsString('content="وصف مخصص للوصفة"', $html);
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:title"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:description"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:image"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:type"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="robots"/i', $html));
        $this->assertStringContainsString('content="noindex, follow"', $html);
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="twitter:card"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="twitter:title"/i', $html));
        $this->assertSame(1, preg_match_all('/<link\b[^>]*\brel="canonical"/i', $html));
        $this->assertStringContainsString('/llms.txt', $html);
    }

    public function test_blade_fills_missing_meta_defaults_when_ssr_only_renders_title(): void
    {
        $this->app->instance(Gateway::class, new class implements Gateway
        {
            public function dispatch(array $page): ?SsrResponse
            {
                return new SsrResponse(
                    '<title inertia>تسجيل الدخول | وصفاتنا</title>',
                    '<div id="app"><h1>تسجيل الدخول</h1></div>',
                );
            }
        });

        $html = $this->get('/login')->assertOk()->getContent();

        $this->assertSame(1, preg_match_all('/<title\b[^>]*>.*?<\/title>/is', $html));
        $this->assertStringContainsString('<title inertia>تسجيل الدخول | وصفاتنا</title>', $html);
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="description"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:title"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:image"/i', $html));
        $this->assertSame(1, preg_match_all('/<link\b[^>]*\brel="canonical"/i', $html));
    }

    public function test_blade_renders_generic_defaults_when_ssr_is_disabled(): void
    {
        $this->app->instance(Gateway::class, new class implements Gateway
        {
            public function dispatch(array $page): ?SsrResponse
            {
                return null;
            }
        });

        $html = $this->get('/')->assertOk()->getContent();

        $this->assertSame(1, preg_match_all('/<title\b[^>]*>.*?<\/title>/is', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bname="description"/i', $html));
        $this->assertSame(1, preg_match_all('/<meta\b[^>]*\bproperty="og:title"/i', $html));
        $this->assertSame(1, preg_match_all('/<link\b[^>]*\brel="canonical"/i', $html));
        $this->assertStringContainsString('<link inertia="canonical" rel="canonical"', $html);
        $this->assertStringContainsString('<meta inertia="og:url" property="og:url"', $html);
    }

    public function test_sitemap_includes_indexable_public_pages_and_excludes_noindex_routes(): void
    {
        Cache::forget('sitemap_xml');

        $city = City::create([
            'name' => 'دمشق',
            'slug' => 'damascus',
        ]);

        $author = User::factory()->create();
        $bannedAuthor = User::factory()->create(['is_banned' => true]);
        $noRecipeUser = User::factory()->create();

        Recipe::forceCreate([
            'name' => 'كبة مقلية',
            'slug' => 'kibbeh-test',
            'city_id' => $city->id,
            'user_id' => $author->id,
            'is_anonymous' => false,
            'steps' => ['خطوة 1'],
            'difficulty' => 'متوسطة',
            'status' => 'approved',
        ]);

        Recipe::forceCreate([
            'name' => 'وصفة قيد المراجعة',
            'slug' => 'pending-recipe',
            'city_id' => $city->id,
            'user_id' => $noRecipeUser->id,
            'is_anonymous' => false,
            'steps' => ['خطوة 1'],
            'difficulty' => 'سهلة',
            'status' => 'pending',
        ]);

        Recipe::forceCreate([
            'name' => 'وصفة محظور',
            'slug' => 'banned-author-recipe',
            'city_id' => $city->id,
            'user_id' => $bannedAuthor->id,
            'is_anonymous' => false,
            'steps' => ['خطوة 1'],
            'difficulty' => 'سهلة',
            'status' => 'approved',
        ]);

        $publicList = RecipeList::create([
            'user_id' => $author->id,
            'name' => 'أكلات شامية',
            'is_public' => true,
            'status' => 'approved',
        ]);

        $privateList = RecipeList::create([
            'user_id' => $author->id,
            'name' => 'قائمة خاصة',
            'is_public' => false,
            'status' => 'approved',
        ]);

        $xml = $this->get('/sitemap.xml')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=utf-8')
            ->getContent();

        $this->assertStringContainsString('/recipes</loc>', $xml);
        $this->assertStringContainsString('/cities</loc>', $xml);
        $this->assertStringContainsString('/lists</loc>', $xml);
        $this->assertStringContainsString('/meal-plans/browse</loc>', $xml);
        $this->assertStringContainsString('/about</loc>', $xml);
        $this->assertStringContainsString('/privacy</loc>', $xml);
        $this->assertStringContainsString('/terms</loc>', $xml);
        $this->assertStringContainsString('/cities/damascus</loc>', $xml);
        $this->assertStringContainsString('/recipes/kibbeh-test</loc>', $xml);
        $this->assertStringContainsString("/lists/{$publicList->id}</loc>", $xml);
        $this->assertStringContainsString("/users/{$author->id}</loc>", $xml);

        $this->assertStringNotContainsString('/meal-plans</loc>', $xml);
        $this->assertStringNotContainsString('/randomizer</loc>', $xml);
        $this->assertStringNotContainsString('/search</loc>', $xml);
        $this->assertStringNotContainsString('/login</loc>', $xml);
        $this->assertStringNotContainsString('/recipes/pending-recipe</loc>', $xml);
        $this->assertStringNotContainsString("/lists/{$privateList->id}</loc>", $xml);
        $this->assertStringNotContainsString("/users/{$bannedAuthor->id}</loc>", $xml);
        $this->assertStringNotContainsString("/users/{$noRecipeUser->id}</loc>", $xml);
    }
}
