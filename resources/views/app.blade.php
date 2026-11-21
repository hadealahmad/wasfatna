@php
    $themeRegistry = json_decode((string) file_get_contents(resource_path('data/themes.json')), true) ?: [];
    $themeKey = $themeRegistry['theme']['key'] ?? 'wasfatna-theme';
    $systemTheme = $themeRegistry['theme']['system'] ?? 'system';
    $fontKey = $themeRegistry['font']['key'] ?? 'wasfatna-font';
    $defaultFont = $themeRegistry['font']['default'] ?? 'ibm-plex';
    $validFonts = array_values(array_map(
        static fn (array $opt): string => (string) $opt['id'],
        $themeRegistry['font']['options'] ?? [['id' => 'ibm-plex'], ['id' => 'system']],
    ));
    $legacyThemeKeys = $themeRegistry['legacyKeys'] ?? ['color-scheme', 'vueuse-color-scheme'];
    $themesList = $themeRegistry['themes'] ?? [];
    $validThemeIds = array_values(array_map(
        static fn (array $theme): string => (string) $theme['id'],
        $themesList,
    ));
    $darkThemeIds = array_values(array_map(
        static fn (array $theme): string => (string) $theme['id'],
        array_filter($themesList, static fn (array $theme): bool => ! empty($theme['isDark'])),
    ));
@endphp
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light" data-scheme="light" data-font="{{ $defaultFont }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="color-scheme" content="light dark">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Theme & Font Flash Prevention: resolves theme/font from resources/data/themes.json before first paint -->
        <script nonce="{{ $cspNonce ?? '' }}">
            (function() {
                try {
                    var root = document.documentElement;
                    var themeKey = @json($themeKey);
                    var systemTheme = @json($systemTheme);
                    var legacyKeys = @json($legacyThemeKeys);
                    var validThemeIds = @json($validThemeIds);
                    var darkThemeIds = @json($darkThemeIds);
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

                    if (!theme || theme === systemTheme || validThemeIds.indexOf(theme) === -1) {
                        theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                    }

                    var scheme = darkThemeIds.indexOf(theme) !== -1 ? 'dark' : 'light';
                    root.setAttribute('data-theme', theme);
                    root.setAttribute('data-scheme', scheme);

                    var meta = document.querySelector('meta[name="color-scheme"]');
                    if (meta) {
                        meta.setAttribute('content', scheme);
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
        <meta head-key="description" name="description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        <meta name="keywords" content="وصفات سورية, طبخ سوري, أكلات سورية, مطبخ سوري, طعام عربي, وصفات عربية">
        <meta name="author" content="وصفاتنا">
        <meta name="robots" content="index, follow">
        <link rel="canonical" href="{{ url()->current() }}">
        <link rel="alternate" type="text/markdown" href="{{ url('/llms.txt') }}" title="LLMs Index">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:site_name" content="وصفاتنا">
        <meta property="og:locale" content="ar_SY">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta head-key="og:title" property="og:title" content="وصفاتنا">
        <meta head-key="og:description" property="og:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        <meta head-key="og:image" property="og:image" content="{{ asset('og-image.webp') }}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta head-key="twitter:title" name="twitter:title" content="وصفاتنا">
        <meta head-key="twitter:description" name="twitter:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        <meta head-key="twitter:image" name="twitter:image" content="{{ asset('og-image.webp') }}">

        <title inertia>وصفاتنا</title>

        <link rel="dns-prefetch" href="https://www.googletagmanager.com">

        <!-- Scripts -->
        @routes(nonce: $cspNonce ?? '')
        @vite(['resources/js/app.ts', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        @unless(request()->is('login', 'settings', 'dashboard*', 'meal-plans/shared*'))
            <!-- Google tag (gtag.js) -->
            <script async fetchpriority="low" referrerpolicy="no-referrer" nonce="{{ $cspNonce ?? '' }}" src="https://www.googletagmanager.com/gtag/js?id=G-JKT27FY67J"></script>
            <script nonce="{{ $cspNonce ?? '' }}">
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-JKT27FY67J');
            </script>
        @endunless
    </body>
</html>
