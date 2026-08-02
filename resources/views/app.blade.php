<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="rtl">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- SEO Meta Tags -->
        <meta name="description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
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
        <meta property="og:title" content="{{ config('app.name', 'وصفاتنا') }}">
        <meta property="og:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        <meta property="og:image" content="{{ asset('og-image.webp') }}">

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ config('app.name', 'وصفاتنا') }}">
        <meta name="twitter:description" content="وصفاتنا - مجتمع الطبخ السوري. اكتشف أشهى الوصفات السورية من مختلف المدن والمناطق.">
        <meta name="twitter:image" content="{{ asset('og-image.webp') }}">

        <title inertia>{{ config('app.name', 'وصفاتنا') }}</title>

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JKT27FY67J"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JKT27FY67J');
        </script>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @routes
        @vite(['resources/js/app.ts', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
