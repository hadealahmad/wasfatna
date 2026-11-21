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
    <title>@yield('title', 'خطأ') | وصفاتنا</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="preload" as="font" type="font/woff2" crossorigin href="/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-regular.woff2">
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
                            break;
                        }
                        if (legacy === 'auto') {
                            theme = systemTheme;
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
                if (meta) meta.setAttribute('content', scheme);

                var font = localStorage.getItem(fontKey);
                if (!font || validFonts.indexOf(font) === -1) font = defaultFont;
                root.setAttribute('data-font', font);
            } catch (e) {}
        })();
    </script>
    <style>
        @font-face {
            font-family: 'IBM Plex Sans Arabic';
            src: local('IBM Plex Sans Arabic'), local('IBMPlexSansArabic'),
                url('/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'IBM Plex Sans Arabic';
            src: local('IBM Plex Sans Arabic SemiBold'), local('IBMPlexSansArabic-SemiBold'),
                url('/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-semibold.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'IBM Plex Sans Arabic';
            src: local('IBM Plex Sans Arabic Bold'), local('IBMPlexSansArabic-Bold'),
                url('/fonts/ibm-plex-sans-arabic/ibm-plex-sans-arabic-bold.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }
        :root {
            color-scheme: light;
            --site-font: 'IBM Plex Sans Arabic', system-ui, -apple-system, sans-serif;
            --background: 0 0% 100%;
            --foreground: 0 0% 3.9%;
            --card: 0 0% 100%;
            --card-foreground: 0 0% 3.9%;
            --primary: 105 15.2% 36.1%;
            --primary-foreground: 0 0% 98%;
            --secondary: 0 0% 96.1%;
            --secondary-foreground: 0 0% 9%;
            --muted-foreground: 0 0% 45.1%;
            --border: 0 0% 89.8%;
            --ring: 105 15.2% 36.1%;
            --radius: 0.5rem;
        }
        [data-theme="jasmine"] {
            --background: 45 60% 97%;
            --foreground: 30 25% 12%;
            --card: 45 50% 100%;
            --card-foreground: 30 25% 12%;
            --primary: 34 88% 33%;
            --primary-foreground: 0 0% 100%;
            --secondary: 42 35% 92%;
            --secondary-foreground: 30 25% 15%;
            --muted-foreground: 30 18% 42%;
            --border: 38 30% 85%;
            --ring: 38 85% 45%;
        }
        [data-scheme="dark"] {
            color-scheme: dark;
            --background: 203 13.3% 11.8%;
            --foreground: 0 0% 100%;
            --card: 195 23.5% 6.7%;
            --card-foreground: 0 0% 100%;
            --primary: 105 28% 56%;
            --primary-foreground: 203 25% 8%;
            --secondary: 200 15% 12%;
            --secondary-foreground: 0 0% 100%;
            --muted-foreground: 200 10% 65%;
            --border: 0 0% 100% / 10%;
            --ring: 105 28% 56%;
        }
        [data-theme="dark-blue"] {
            --background: 219 36% 9%;
            --foreground: 210 40% 98%;
            --card: 219 36% 6.5%;
            --card-foreground: 210 40% 98%;
            --primary: 217 91% 65%;
            --primary-foreground: 219 45% 8%;
            --secondary: 219 25% 15%;
            --secondary-foreground: 210 40% 98%;
            --muted-foreground: 215 20% 65%;
            --border: 219 25% 17%;
            --ring: 217 91% 60%;
        }
        [data-theme="dark-purple"] {
            --background: 270 30% 8%;
            --foreground: 270 40% 98%;
            --card: 270 30% 5.5%;
            --card-foreground: 270 40% 98%;
            --primary: 285 75% 68%;
            --primary-foreground: 270 45% 8%;
            --secondary: 270 20% 14%;
            --secondary-foreground: 270 40% 98%;
            --muted-foreground: 270 20% 65%;
            --border: 270 20% 16%;
            --ring: 285 75% 68%;
        }
        [data-theme="dark-green"] {
            --background: 135 29% 8%;
            --foreground: 135 40% 98%;
            --card: 135 29% 5.5%;
            --card-foreground: 135 40% 98%;
            --primary: 132 48% 52%;
            --primary-foreground: 135 45% 7%;
            --secondary: 135 20% 14%;
            --secondary-foreground: 135 40% 98%;
            --muted-foreground: 130 18% 65%;
            --border: 135 20% 16%;
            --ring: 132 48% 52%;
        }
        [data-theme="high-contrast"] {
            --background: 0 0% 0%;
            --foreground: 0 0% 100%;
            --card: 0 0% 0%;
            --card-foreground: 0 0% 100%;
            --primary: 120 100% 50%;
            --primary-foreground: 0 0% 0%;
            --secondary: 0 0% 10%;
            --secondary-foreground: 0 0% 100%;
            --muted-foreground: 0 0% 85%;
            --border: 120 100% 50%;
            --ring: 120 100% 50%;
        }
        [data-theme="damascus-rose"] {
            --background: 345 28% 8%;
            --foreground: 10 15% 96%;
            --card: 345 32% 5.5%;
            --card-foreground: 10 15% 96%;
            --primary: 340 68% 62%;
            --primary-foreground: 345 45% 8%;
            --secondary: 345 22% 13%;
            --secondary-foreground: 10 15% 95%;
            --muted-foreground: 340 18% 62%;
            --border: 340 35% 20%;
            --ring: 340 68% 58%;
        }
        html[data-font="system"], html[data-font="system"] body {
            --site-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            font-family: var(--site-font);
            line-height: 1.6;
        }
        .error-card {
            width: 100%;
            max-width: 28rem;
            background-color: hsl(var(--card));
            color: hsl(var(--card-foreground));
            border: 1px solid hsl(var(--border));
            border-radius: calc(var(--radius) + 4px);
            padding: 2rem;
            text-align: center;
        }
        .error-code {
            display: inline-block;
            font-size: 0.875rem;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            color: hsl(var(--primary));
            margin-bottom: 0.75rem;
        }
        h1 {
            margin: 0 0 0.5rem;
            font-size: 1.5rem;
            font-weight: 700;
            line-height: 1.3;
        }
        p {
            margin: 0 0 1.5rem;
            font-size: 0.9375rem;
            color: hsl(var(--muted-foreground));
        }
        .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            justify-content: center;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: var(--radius);
            padding: 0.625rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            border: 1px solid transparent;
        }
        .btn-primary {
            background-color: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
        }
        .btn-outline {
            background-color: transparent;
            color: hsl(var(--foreground));
            border-color: hsl(var(--border));
        }
        .btn:focus-visible {
            outline: 2px solid hsl(var(--ring));
            outline-offset: 2px;
        }
    </style>
</head>
<body>
    <main class="error-card">
        <div class="error-code" dir="ltr">@yield('code')</div>
        <h1>@yield('heading')</h1>
        <p>@yield('message')</p>
        <div class="actions">
            <a href="/" class="btn btn-primary">العودة إلى الرئيسية</a>
            <a href="/recipes" class="btn btn-outline">تصفح الوصفات</a>
        </div>
    </main>
</body>
</html>
