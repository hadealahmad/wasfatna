<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_standard_security_headers_and_csp_nonce_are_present(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader(
            'Permissions-Policy',
            'camera=(), geolocation=(), microphone=(), accelerometer=(), focus-without-user-activation=()'
        );
        $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        $response->assertHeader('Cross-Origin-Resource-Policy', 'same-site');

        $vary = (string) $response->headers->get('Vary');
        $this->assertStringContainsString('Sec-Fetch-Dest', $vary);
        $this->assertStringContainsString('Sec-Fetch-Mode', $vary);
        $this->assertStringContainsString('Sec-Fetch-Site', $vary);

        $csp = (string) $response->headers->get('Content-Security-Policy');
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
        $this->assertStringContainsString("object-src 'none'", $csp);
        $this->assertStringContainsString("base-uri 'none'", $csp);
        $this->assertMatchesRegularExpression("/'nonce-([A-Za-z0-9+\/=]+)'/", $csp);

        preg_match("/'nonce-([A-Za-z0-9+\/=]+)'/", $csp, $matches);
        $nonce = $matches[1] ?? '';
        $this->assertNotEmpty($nonce);

        $html = $response->getContent();
        $this->assertStringContainsString('<meta name="color-scheme" content="light dark">', $html);
        $this->assertStringContainsString('nonce="'.$nonce.'"', $html);

        // Verify per-request nonce uniqueness
        $secondResponse = $this->get('/');
        $secondCsp = (string) $secondResponse->headers->get('Content-Security-Policy');
        preg_match("/'nonce-([A-Za-z0-9+\/=]+)'/", $secondCsp, $secondMatches);
        $this->assertNotSame($nonce, $secondMatches[1] ?? '');
    }

    public function test_gtag_is_omitted_on_sensitive_routes_and_present_on_public_routes(): void
    {
        $publicResponse = $this->get('/');
        $publicResponse->assertStatus(200);
        $this->assertStringContainsString('https://www.googletagmanager.com/gtag/js', $publicResponse->getContent());
        $this->assertStringContainsString('fetchpriority="low"', $publicResponse->getContent());

        $loginResponse = $this->get('/login');
        $loginResponse->assertStatus(200);
        $this->assertStringNotContainsString('https://www.googletagmanager.com/gtag/js', $loginResponse->getContent());
    }

    public function test_fetch_metadata_blocks_cross_site_state_changing_requests(): void
    {
        $user = User::factory()->create();

        $blocked = $this->actingAs($user)
            ->withHeader('Sec-Fetch-Site', 'cross-site')
            ->post('/logout');

        $blocked->assertStatus(403);

        // GET requests with cross-site are allowed (normal navigation)
        $allowedGet = $this->withHeader('Sec-Fetch-Site', 'cross-site')
            ->get('/');

        $allowedGet->assertStatus(200);
    }

    public function test_web_logout_sends_clear_site_data_header(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->withHeader('Sec-Fetch-Site', 'same-origin')
            ->post('/logout');

        $response->assertRedirect('/');
        $response->assertHeader('Clear-Site-Data', '"cookies", "storage", "cache"');
    }

    public function test_api_logout_sends_clear_site_data_header(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/auth/logout');

        $response->assertStatus(200);
        $response->assertHeader('Clear-Site-Data', '"cookies", "storage", "cache"');
    }

    public function test_oauth_user_without_password_can_request_cancel_and_delete_account(): void
    {
        $user = User::factory()->create(['password' => null]);

        $requestResponse = $this->actingAs($user)
            ->post(route('profile.request-deletion'));
        $requestResponse->assertRedirect(route('profile.edit'));
        $this->assertTrue((bool) $user->fresh()->deletion_requested);

        $cancelResponse = $this->actingAs($user)
            ->post(route('profile.cancel-deletion'));
        $cancelResponse->assertRedirect(route('profile.edit'));
        $this->assertFalse((bool) $user->fresh()->deletion_requested);

        $deleteResponse = $this->actingAs($user)
            ->delete(route('profile.destroy'));
        $deleteResponse->assertRedirect('/');
        $deleteResponse->assertHeader('Clear-Site-Data', '"cookies", "storage", "cache"');
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_public_user_profile_route_has_throttle_middleware(): void
    {
        $route = Route::getRoutes()->getByName('users.show');
        $this->assertNotNull($route);
        $this->assertContains('throttle:60,1', $route->gatherMiddleware());
    }
}
