@php
    $themeRegistry = json_decode((string) file_get_contents(resource_path('data/themes.json')), true) ?: [];
    $themeKey = $themeRegistry['theme']['key'] ?? 'wasfatna-theme';
    $systemTheme = $themeRegistry['theme']['system'] ?? 'system';
    $defaultTheme = $themeRegistry['theme']['default'] ?? 'dark-blue';
    $fontKey = $themeRegistry['font']['key'] ?? 'wasfatna-font';
    $defaultFont = $themeRegistry['font']['default'] ?? 'ibm-plex';
    $validFonts = array_values(array_map(
        static fn (array $opt): string => (string) $opt['id'],
        $themeRegistry['font']['options'] ?? [['id' => 'ibm-plex'], ['id' => 'system']],
    ));
    $legacyThemeKeys = $themeRegistry['legacyKeys'] ?? ['color-scheme', 'vueuse-color-scheme'];
    $themesList = $themeRegistry['themes'] ?? [];
    $themesById = [];
    foreach ($themesList as $themeEntry) {
        if (! empty($themeEntry['id'])) {
            $themesById[(string) $themeEntry['id']] = $themeEntry;
        }
    }
    $defaultThemeConfig = $themesById[$defaultTheme] ?? [];
    $defaultScheme = ! empty($defaultThemeConfig['isDark']) ? 'dark' : 'light';
    $defaultThemeBg = (string) ($defaultThemeConfig['bg'] ?? '#0f141f');
    $themeBgMap = [];
    foreach ($themesList as $themeEntry) {
        if (! empty($themeEntry['id']) && ! empty($themeEntry['bg']) && $themeEntry['id'] !== $systemTheme) {
            $themeBgMap[(string) $themeEntry['id']] = (string) $themeEntry['bg'];
        }
    }
    $validThemeIds = array_values(array_map(
        static fn (array $theme): string => (string) $theme['id'],
        $themesList,
    ));
    $darkThemeIds = array_values(array_map(
        static fn (array $theme): string => (string) $theme['id'],
        array_filter($themesList, static fn (array $theme): bool => ! empty($theme['isDark'])),
    ));

    if (! isset($__inertiaSsrDispatched)) {
        $__inertiaSsrDispatched = true;
        $__inertiaSsrResponse = app(\Inertia\Ssr\Gateway::class)->dispatch($page);
    }
    $ssrHead = $__inertiaSsrResponse->head ?? '';
    $ssrHasTitle = (bool) preg_match('/<title\b/i', $ssrHead);
    $ssrHasCanonical = (bool) preg_match('/<link\b[^>]*\brel=["\']canonical["\']/i', $ssrHead);
    $ssrHasMeta = static fn (string $attr, string $name): bool => (bool) preg_match(
        '/<meta\b[^>]*\b'.preg_quote($attr, '/').'=["\']'.preg_quote($name, '/').'["\']/i',
        $ssrHead,
    );
@endphp
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="{{ $defaultTheme }}" data-scheme="{{ $defaultScheme }}" data-font="{{ $defaultFont }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="{{ $defaultScheme }}">
        <meta name="theme-color" content="{{ $defaultThemeBg }}">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Theme & Font Flash Prevention: resolves theme/font from resources/data/themes.json before first paint -->
        <script nonce="{{ $cspNonce ?? '' }}">
            (function() {
                try {
                    var root = document.documentElement;
                    var themeKey = @json($themeKey);
                    var systemTheme = @json($systemTheme);
                    var defaultTheme = @json($defaultTheme);
                    var legacyKeys = @json($legacyThemeKeys);
                    var validThemeIds = @json($validThemeIds);
                    var darkThemeIds = @json($darkThemeIds);
                    var themeBgMap = @json($themeBgMap);
                    var fontKey = @json($fontKey);
                    var defaultFont = @json($defaultFont);
                    var validFonts = @json($validFonts);

                    var theme = localStorage.getItem(themeKey);
                    if (!theme || validThemeIds.indexOf(theme) === -1) {
                        theme = null;
                        for (var i = 0; i < legacyKeys.length; i++) {
                            var legacy = localStorage.getItem(legacyKeys[i]);
                            if (legacy === 'dark' || legacy === 'light') {
                                theme = legacy;
                                localStorage.setItem(themeKey, legacy);
                                for (var j = 0; j < legacyKeys.length; j++) {
                                    localStorage.removeItem(legacyKeys[j]);
                                }
                                break;
                            }
                            if (legacy === 'auto') {
                                theme = systemTheme;
                                localStorage.setItem(themeKey, systemTheme);
                                localStorage.removeItem(legacyKeys[i]);
                                break;
                            }
                        }
                    }

                    if (!theme || validThemeIds.indexOf(theme) === -1) {
                        theme = defaultTheme;
                    }
                    if (theme === systemTheme) {
                        theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                    }

                    var scheme = darkThemeIds.indexOf(theme) !== -1 ? 'dark' : 'light';
                    root.setAttribute('data-theme', theme);
                    root.setAttribute('data-scheme', scheme);

                    var meta = document.querySelector('meta[name="color-scheme"]');
                    if (meta) {
                        meta.setAttribute('content', scheme);
                    }
                    var themeColorMeta = document.querySelector('meta[name="theme-color"]');
                    if (themeColorMeta && themeBgMap[theme]) {
                        themeColorMeta.setAttribute('content', themeBgMap[theme]);
                    }

                    var font = localStorage.getItem(fontKey);
                    if (!font || validFonts.indexOf(font) === -1) {
                        font = defaultFont;
                    }
                    root.setAttribute('data-font', font);
                } catch (e) {}
            })();
        </script>

        <!-- Self-hosted IBM Plex Sans Arabic (400 weight preload) -->
        <link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-regular.woff2">

        <!-- Favicons -->
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="alternate icon" href="/favicon.ico">

        <!-- SEO Meta Tags -->
        @unless ($ssrHasMeta('name', 'description'))
            <meta inertia="description" name="description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        @endunless
        @unless ($ssrHasMeta('name', 'keywords'))
            <meta inertia="keywords" name="keywords" content="وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية">
        @endunless
        <meta name="author" content="وصفاتنا">
        @unless ($ssrHasMeta('name', 'robots'))
            <meta inertia="robots" name="robots" content="index, follow">
        @endunless
        @unless ($ssrHasCanonical)
            <link inertia="canonical" rel="canonical" href="{{ url()->current() }}">
        @endunless
        <link rel="alternate" type="text/markdown" href="{{ url('/llms.txt') }}" title="LLMs Index">

        <!-- Open Graph / Facebook -->
        @unless ($ssrHasMeta('property', 'og:type'))
            <meta inertia="og:type" property="og:type" content="website">
        @endunless
        <meta property="og:site_name" content="وصفاتنا">
        <meta property="og:locale" content="ar_SY">
        @unless ($ssrHasMeta('property', 'og:url'))
            <meta inertia="og:url" property="og:url" content="{{ url()->current() }}">
        @endunless
        @unless ($ssrHasMeta('property', 'og:title'))
            <meta inertia="og:title" property="og:title" content="وصفاتنا">
        @endunless
        @unless ($ssrHasMeta('property', 'og:description'))
            <meta inertia="og:description" property="og:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        @endunless
        @unless ($ssrHasMeta('property', 'og:image'))
            <meta inertia="og:image" property="og:image" content="{{ asset('og-image.webp') }}">
        @endunless

        <!-- Twitter -->
        @unless ($ssrHasMeta('name', 'twitter:card'))
            <meta inertia="twitter:card" name="twitter:card" content="summary_large_image">
        @endunless
        @unless ($ssrHasMeta('name', 'twitter:title'))
            <meta inertia="twitter:title" name="twitter:title" content="وصفاتنا">
        @endunless
        @unless ($ssrHasMeta('name', 'twitter:description'))
            <meta inertia="twitter:description" name="twitter:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        @endunless
        @unless ($ssrHasMeta('name', 'twitter:image'))
            <meta inertia="twitter:image" name="twitter:image" content="{{ asset('og-image.webp') }}">
        @endunless

        @unless ($ssrHasTitle)
            <title inertia>وصفاتنا</title>
        @endunless

        <link rel="dns-prefetch" href="https://www.googletagmanager.com">

        <!-- Scripts -->
        @routes(nonce: $cspNonce ?? '')
        @vite(['resources/js/app.ts', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        {{-- Analytics is consent-gated: only the measurement id is exposed here.
             resources/js/lib/analyticsConsent.ts is the one place that fetches
             gtag.js, and only after the visitor agrees in the consent banner. --}}
        @if (config('services.google_analytics.id') && ! request()->is('login', 'settings', 'dashboard*', 'meal-plans/shared*', 'my*'))
            <script nonce="{{ $cspNonce ?? '' }}">window.GA_ID = @json(config('services.google_analytics.id'));</script>
        @endif
    </body>
</html>
