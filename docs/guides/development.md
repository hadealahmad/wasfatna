# Development Guide

How to set up and run Wasfatna locally.

## 1. Prerequisites

- PHP `^8.2` with extensions: `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `gd` (or `imagick`), `curl`
- Composer 2.5+
- Node.js 18/20+ (npm) **or** Bun (CI uses Bun)
- SQLite (default), or MySQL/PostgreSQL if preferred

## 2. Setup

```bash
git clone <repo-url> && cd cooking
composer install
cp .env.example .env          # then edit DB / OAuth settings
php artisan key:generate
touch database/database.sqlite # default SQLite DB
php artisan migrate --seed    # seeders in database/seeders/
npm install                   # or: bun install
```

Google OAuth requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env` (Socialite). Without them, use the `/dev-login` route locally for authenticated testing.

## 3. Running in Development

### One-command dev (recommended)

Defined in `composer.json` → runs Laravel server, queue listener, Pail (log tail), and Vite together:

```bash
composer dev
```

### Individually

| Process | Command |
|---|---|
| Laravel server | `php artisan serve` |
| Vite dev server (HMR) | `npm run dev` |
| Queue worker | `php artisan queue:listen --tries=1` |
| Log tail | `php artisan pail` |
| SSR build | `npm run build:ssr` |
| Full production build (client + SSR) | `npm run build` |

> Inertia SSR is enabled — the production deploy restarts the SSR process (`php artisan inertia:stop-ssr`). For local SSR testing, run a Node SSR service after building (`npm run build && php artisan inertia:start-ssr`).

## 4. Testing & Quality

```bash
composer test        # config:clear + php artisan test (PHPUnit 11, tests/)
./vendor/bin/pint    # PHP code style fixer
```

Config lives in `phpunit.xml`; feature tests exercise web + API controllers.

## 5. Artisan Commands (app-specific)

Located in `app/Console/Commands/`:

| Command class | Purpose |
|---|---|
| `ImportRecipes` | Bulk import recipes from data files |
| `ImportRecipeImages` | Attach/compress images for imported recipes |
| `FixIngredientSortOrder` | Repair `sort_order` on recipe ingredients |

## 6. Key Dev Notes

- **Routes:** Web routes in `routes/web.php` (Inertia pages + `/web-api/*` fetch endpoints used by the SPA itself); REST API in `routes/api.php` (Sanctum tokens).
- **Ziggy** exposes named routes to the frontend (`route()` helper in Vue).
- **Vite alias:** `@` → `resources/js`.
- **Manual chunks:** `vendor-vue`, `vendor-ui`, `vendor-draggable` are split in `vite.config.js` to keep page chunks small.
- **Image uploads** are validated and compressed client-side (`resources/js/lib/image-utils.ts`) and processed server-side by `App\Services\ImageService` (Intervention Image).
- **Roles:** simple string column `users.role` (`user` / `moderator` / `admin`) checked via middleware `EnsureUserCanModerate`, `EnsureUserIsAdmin`, `EnsureUserNotBanned`.
