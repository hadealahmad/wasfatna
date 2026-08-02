# Software Map & Technology Stack

## 1. Executive Overview

**Wasfatna (وصفاتنا)** is a full-stack web application designed for discovering, sharing, and planning authentic Syrian recipes across different cities and regions. 

The architecture follows a modern monolithic pattern using **Inertia.js** to bridge the Laravel 12 backend with a Vue 3 single-page application (SPA) frontend, alongside a dedicated **Sanctum REST API** for mobile applications and external client integrations.

---

## 2. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | [Laravel](https://laravel.com) | `^12.0` | Application routing, ORM, security, auth & APIs |
| **Language (Backend)** | [PHP](https://www.php.net) | `^8.2` | Server-side execution |
| **Frontend Framework** | [Vue.js](https://vuejs.org) | `^3.5` | Reactive Single Page Application |
| **SPA Bridge** | [Inertia.js](https://inertiajs.com) | `^2.3` | Monolithic SPA bridge (no separate API routing needed for web) |
| **Language (Frontend)** | [TypeScript](https://www.typescriptlang.org) | `^5.9` | Type safety across Vue components |
| **Styling & Design** | [Tailwind CSS](https://tailwindcss.com) | `^4.0` | Utility-first responsive CSS styling |
| **UI Primitives** | [Radix Vue](https://www.radix-vue.com) / Shadcn | `^1.9` | Accessible unstyled UI primitives (Dialog, Select, Tabs, etc.) |
| **Build Tooling** | [Vite](https://vitejs.dev) | `^7.0` | Lightning-fast asset bundling and HMR |
| **Icons** | [Lucide Vue Next](https://lucide.dev) | `^0.562` | Modern icon library |
| **Authentication** | [Laravel Sanctum](https://laravel.com/docs/sanctum) | `^4.2` | Web session & API token authentication |
| **OAuth** | [Laravel Socialite](https://laravel.com/docs/socialite) | `^5.24` | Google Auth integration |
| **Image Processing** | [Intervention Image](https://image.intervention.io) | `^1.5` | Server-side image manipulation & compression |
| **Database** | SQLite / MySQL / PostgreSQL | - | Persistent data storage |

---

## 3. Software Map & Directory Architecture

```
cooking/
├── app/
│   ├── Console/Commands/       # CLI Artisan commands (image/data import)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/            # REST API Controllers (Sanctum authenticated)
│   │   │   └── Web/            # Inertia.js Page Controllers
│   │   │       └── My/         # User dashboard & personal resource controllers
│   │   └── Middleware/         # Custom auth middleware (EnsureUserNotBanned, Moderator, Admin)
│   ├── Models/                 # Eloquent ORM Models
│   └── Services/               # Domain service logic (ImageService, etc.)
├── config/                     # Laravel application configuration
├── database/
│   ├── factories/              # Database factories for unit testing
│   ├── migrations/             # Schema migration history
│   └── seeders/                # Initial seeders (Cities, Admins, Sample Data)
├── docs/                       # Project documentation
├── public/                     # Public web server root (index.php, static graphics, Vite build output)
├── resources/
│   ├── css/                    # Core stylesheets (app.css)
│   ├── js/
│   │   ├── components/         # Vue UI components
│   │   │   ├── admin/          # Management tables (UnifiedRecipeTable, UnifiedUserTable)
│   │   │   ├── features/       # Feature modules (lists, meal-plans)
│   │   │   ├── layout/         # Public header & navigation
│   │   │   ├── randomizer/     # Recipe randomizer components
│   │   │   ├── recipes/        # Recipe cards, grid, form, revisions
│   │   │   └── ui/             # Reusable Shadcn UI primitives (Button, Card, Input, Dialog, etc.)
│   │   ├── Layouts/            # Page layouts (PublicLayout, DashboardLayout, MyDashboardLayout)
│   │   ├── lib/                # Utility helpers (image-utils.ts, utils.ts)
│   │   ├── Pages/              # Inertia Page Views (27 views matching routes)
│   │   ├── types/              # TypeScript declaration files
│   │   └── app.ts              # Inertia SPA initialization entry point
│   └── views/
│       └── app.blade.php       # Main HTML root template for Inertia
├── routes/
│   ├── api.php                 # REST API endpoints (/api/*)
│   └── web.php                 # Web frontend routes (/ recipes, cities, lists, dashboard)
├── storage/                    # Uploaded files, logs, sessions, framework cache
├── study/                      # Code audit & optimization study files
└── vite.config.js              # Vite build & Rollup chunking configuration
```

---

## 4. Key Models & Relationships

- **User**: System users (Roles: `user`, `moderator`, `admin`). Has many `Recipe`, `RecipeList`, `MealPlan`, `Report`.
- **Recipe**: Core recipe record (Title, slug, ingredients, steps, preparation time, difficulty). Belongs to `City`, `User`, `AnonymousAuthor`. Has many `Tag` and `RecipeRevision`.
- **City**: Syrian cities (Damascus, Aleppo, Homs, etc.). Has many `Recipe`.
- **Tag**: Categories (Desserts, Main Dish, Vegetarian, etc.). Belongs to many `Recipe`.
- **RecipeList**: Custom user collections. Belongs to `User`. Belongs to many `Recipe` via `ListItem`.
- **MealPlan**: User weekly meal plan. Has many `MealPlanEntry`.
- **MealPlanEntry**: Maps recipes to specific days & meal slots (breakfast, lunch, dinner).
- **Report**: Community flag/report system for recipes, comments, or lists.
