# Software Map & Technology Stack

## 1. Overview

**Wasfatna (وصفاتنا)** is a full-stack web application for discovering, sharing, and planning authentic Syrian recipes across cities and regions.

Architecture: a modern Laravel monolith using **Inertia.js** to bridge the Laravel 12 backend with a Vue 3 SPA (with SSR), alongside a dedicated **Sanctum REST API** (`routes/api.php`) for mobile/external clients. The SPA also talks to small session-authenticated `/web-api/*` endpoints for interactive actions (lists, meal plans).

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| Backend framework | Laravel | `^12.0` | Routing, ORM, auth, queues |
| Backend language | PHP | `^8.2` | Server-side execution |
| Frontend framework | Vue.js | `^3.5` | Reactive SPA |
| SPA bridge | Inertia.js (`@inertiajs/vue3` / `inertiajs/inertia-laravel`) | `^2.3` / `^2.0` | Monolithic SPA bridge + SSR |
| Frontend language | TypeScript | `^5.9` | Type safety |
| Styling | Tailwind CSS | `^4.0` | Utility-first CSS (`@tailwindcss/vite`) |
| UI primitives | Radix Vue (shadcn-style wrappers in `resources/js/components/ui/`) | `^1.9` | Accessible Dialogs, Selects, Tabs, etc. |
| Build tooling | Vite | `^7.0` | Bundling + HMR; separate SSR bundle (`ssr.ts`) |
| Icons | Lucide Vue Next | `^0.562` | Icon library |
| Auth (web) | Laravel Sanctum | `^4.2` | Session auth + API tokens |
| OAuth | Laravel Socialite | `^5.24` | Google sign-in |
| Images | Intervention Image (`intervention/image-laravel`) | `^1.5` | Server-side compression/manipulation |
| Routes on frontend | Ziggy (`tightenco/ziggy`, `ziggy-js`) | `^2.6` | Named routes in JS |
| Toasts | vue-sonner | `^2.0` | Notifications |
| Utilities | @vueuse/core, clsx, tailwind-merge, class-variance-authority, vuedraggable | – | Composables, styling helpers, drag-and-drop |
| Database | SQLite / MySQL / PostgreSQL | – | Storage (SQLite default) |
| Testing | PHPUnit | `^11.5` | Feature/unit tests |
| Deployment | Docker image (`Dockerfile`: Bun build → `serversideup/php:8.4-fpm-nginx`, S6 services) | – | Built and deployed on every push to `main` |

## 3. Directory Map

```
cooking/
├── app/
│   ├── Console/Commands/        # ImportRecipes, ImportRecipeImages, FixIngredientSortOrder
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/             # Sanctum REST API controllers (15)
│   │   │   │                    #   AdminController, AdminListController, AiController,
│   │   │   │                    #   AuthController, CityController, ImportController,
│   │   │   │                    #   IngredientController, ListController, MealPlanController,
│   │   │   │                    #   RandomizerController, RecipeController, ReportController,
│   │   │   │                    #   SettingController, TagController, UserController
│   │   │   └── Web/             # Inertia page controllers (+ Web/My/ for owned resources)
│   │   └── Middleware/          # EnsureUserIsAdmin, EnsureUserCanModerate,
│   │                            # EnsureUserNotBanned, HandleInertiaRequests
│   ├── Models/                  # User, Recipe, City, Ingredient, Tag, AnonymousAuthor,
│   │                            # RecipeList, ListItem, RecipeRevision, Report, Setting,
│   │                            # MealPlan, MealPlanEntry, MealPlanPreset
│   ├── Providers/
│   ├── Services/ImageService.php# Image processing/compression
│   └── Support/ArabicSearch.php # Arabic-folded LIKE search (hamza, ة/ه, ى/ي, tashkeel)
├── config/                      # Laravel config (app, auth, sanctum, services, …)
├── docker/                      # Container startup script + S6 service run scripts
├── database/
│   ├── migrations/              # See architecture/database-schema.md
│   ├── factories/  seeders/
├── docs/                        # This documentation
├── public/                      # Web entry (index.php), assets, og-image.webp
├── resources/
│   ├── css/app.css              # Tailwind v4 tokens (@theme), 9 theme blocks, fonts
│   ├── data/                    # themes.json (theme registry), project-icons.json (section icons)
│   ├── js/
│   │   ├── app.ts / ssr.ts      # Client & SSR entry points
│   │   ├── Pages/               # Inertia pages: Welcome, Recipes/, Cities/, Lists/,
│   │   │                        # MealPlans/, Randomizer/, Search/, Users/, Profile/,
│   │   │                        # Dashboard/ (admin), My/ (recipes, lists, meal-plans, reports),
│   │   │                        # Auth/, About, Privacy, Terms
│   │   ├── components/
│   │   │   ├── admin/           # Dashboard widgets/tables
│   │   │   ├── features/        # lists/, meal-plans/ feature components
│   │   │   ├── layout/          # PublicHeader (navbar), UserNav (account menu)
│   │   │   ├── randomizer/
│   │   │   ├── recipes/         # RecipeForm, RecipeGrid, SearchFilters, ShareButtons, …
│   │   │   ├── reports/         # ReportModal, …
│   │   │   ├── search/          # GlobalSearch (command palette), SmartFilterSearch
│   │   │   ├── AppearanceMenu.vue, ProjectIcon.vue, AnalyticsConsentBanner.vue
│   │   │   └── ui/              # shadcn-style primitives (Button, Dialog, Table, …)
│   │   ├── composables/         # useTheme, useColorScheme (compat), useGlobalSearch
│   │   └── lib/                 # utils.ts (cn), image-utils.ts, theme.ts, arabic.ts, analyticsConsent.ts
├── routes/
│   ├── web.php                  # Inertia pages + /web-api/* fetch endpoints
│   ├── api.php                  # Sanctum REST API (/api)
│   └── console.php              # Artisan closures
├── tests/                       # PHPUnit tests
├── Dockerfile / .dockerignore   # Production image
├── vite.config.js               # Client + SSR builds, manualChunks splitting
└── composer.json / package.json
```

## 4. Request Lifecycle

**Web (Inertia):**
`HTTP → routes/web.php → Web controller → Eloquent models → Inertia::render(Page, props) → Vue page (resources/js/Pages)`

**API (mobile/external):**
`HTTP /api/* → routes/api.php → Sanctum auth ('auth:sanctum') → Api controller → JSON resource response`

**Interactive SPA fetches:**
`Vue component → axios/fetch → /web-api/* (session-authenticated, in routes/web.php) → Api controller → JSON`

## 5. Roles & Authorization

Single `role` string column on `users`: `user` < `moderator` < `admin`.
- `moderator`: dashboard access — recipe approval/rejection, reports, tags moderation.
- `admin`: everything above plus users management, cities CRUD, settings, import, meal-plan presets.
- Middleware: `EnsureUserCanModerate`, `EnsureUserIsAdmin`, `EnsureUserNotBanned` (applied as `not-banned`).
- A hardcoded admin email fallback exists in `App\Models\User::isAdmin()`.

## 6. Content Moderation Flow

Recipes and lists follow a status workflow:
`draft → pending → approved | rejected` (plus `unpublished`; recipes also have `needs_reapproval` when edited after approval). Reports are polymorphic (`reportable`) with statuses `pending / fixed / rejected` and admin replies.

## 7. LLM-friendly Endpoints

`GET /llms.txt` and `GET /llms-full.txt` (`Web\LlmsController`) expose machine-readable site/recipe summaries for AI crawlers. Individual recipes are also available as markdown at `/recipes/{slug}.md`.
