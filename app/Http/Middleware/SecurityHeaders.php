<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (
            ! in_array($request->getMethod(), ['GET', 'HEAD', 'OPTIONS'], true)
            && ! $request->is('auth/google/callback')
            && ! $request->is('api/*')
            && strtolower((string) $request->header('Sec-Fetch-Site')) === 'cross-site'
        ) {
            abort(403, 'Cross-site request blocked.');
        }

        $nonce = base64_encode(random_bytes(16));
        Vite::useCspNonce($nonce);
        View::share('cspNonce', $nonce);

        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), geolocation=(), microphone=(), accelerometer=(), focus-without-user-activation=()'
        );
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-site');

        if ($request->isSecure() && app()->isProduction()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        $response->headers->set('Content-Security-Policy', $this->buildContentSecurityPolicy($nonce));

        $existingVary = array_filter(
            array_map('trim', explode(',', (string) $response->headers->get('Vary', '')))
        );
        $varyHeaders = array_unique(array_merge($existingVary, [
            'Sec-Fetch-Dest',
            'Sec-Fetch-Mode',
            'Sec-Fetch-Site',
        ]));
        $response->headers->set('Vary', implode(', ', $varyHeaders));

        return $response;
    }

    private function buildContentSecurityPolicy(string $nonce): string
    {
        $extraOrigins = $this->configuredOrigins();
        $extraOriginsString = $extraOrigins !== [] ? ' '.implode(' ', $extraOrigins) : '';
        $analyticsConnect = 'https://www.google-analytics.com https://region1.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com';

        if (app()->isLocal()) {
            $directives = [
                "frame-ancestors 'none'",
                "object-src 'none'",
                "base-uri 'none'",
                "script-src 'self' 'nonce-{$nonce}' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://127.0.0.1:* https:",
                "style-src 'self' 'unsafe-inline' http://localhost:* http://127.0.0.1:* https://fonts.googleapis.com{$extraOriginsString}",
                "font-src 'self' https://fonts.gstatic.com data:{$extraOriginsString}",
                "img-src 'self' data: blob: https:",
                "connect-src 'self' ws://localhost:* ws://127.0.0.1:* http://localhost:* http://127.0.0.1:* {$analyticsConnect}{$extraOriginsString}",
            ];
        } else {
            $directives = [
                "frame-ancestors 'none'",
                "object-src 'none'",
                "base-uri 'none'",
                "script-src 'nonce-{$nonce}' 'strict-dynamic' https: 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com{$extraOriginsString}",
                "font-src 'self' https://fonts.gstatic.com data:{$extraOriginsString}",
                "img-src 'self' data: blob: https:",
                "connect-src 'self' {$analyticsConnect}{$extraOriginsString}",
            ];
        }

        return implode('; ', $directives).';';
    }

    /**
     * Extract deduplicated scheme+host(+port) origins from configured app/asset/frontend URLs.
     *
     * @return list<string>
     */
    private function configuredOrigins(): array
    {
        $urls = [
            config('app.url'),
            config('app.asset_url'),
            env('FRONTEND_URL'),
        ];

        $origins = [];
        foreach ($urls as $url) {
            if (! is_string($url) || trim($url) === '') {
                continue;
            }
            $parts = parse_url(trim($url));
            if (! is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
                continue;
            }
            $origin = $parts['scheme'].'://'.$parts['host'];
            if (! empty($parts['port'])) {
                $origin .= ':'.$parts['port'];
            }
            $origins[] = $origin;
        }

        return array_values(array_unique($origins));
    }
}
