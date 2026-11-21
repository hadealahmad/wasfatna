# Development Guide

How to set up and run Wasfatna locally.

## 1. Prerequisites

- PHP `^8.2` (production image runs 8.4) with extensions: `pdo_sqlite`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `gd`, `exif`, `intl`, `curl`
- Composer 2.5+
- Bun (the lockfile is `bun.lock`; the production build uses Bun), or Node.js 20+
- Docker (optional) — to build and run the production image locally
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

Google OAuth requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env` (Socialite). Without them, use the `/dev-login` route for authenticated testing — it exists **only when `APP_ENV=local`** and logs you in as the first admin.

Notes on `.env`:
- `GA_MEASUREMENT_ID=` is empty in `.env.example`, which turns analytics and the consent banner off locally. Leave it empty in development.
- `TRUSTED_PROXIES` stays empty unless you run behind a reverse proxy.
- The default theme is `dark-blue`; clear `localStorage` (`wasfatna-theme`) to see the default again.

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

> `bun run build` always produces the SSR bundle; production renders every page server-side (`INERTIA_SSR_ENABLED=true`). To test SSR locally: `bun run build`, then `node bootstrap/ssr/ssr.js` (port 13714) next to `php artisan serve`, and curl a page — the per-page `<title>`, meta tags and JSON-LD must be in the raw HTML. Every page's SEO goes through `components/SeoHead.vue` (helpers in `lib/seo.ts`).
>
> To test the production container locally, see [deployment-and-updates.md §2](deployment-and-updates.md#2-run-the-production-image-locally).

## 4. Testing & Quality

```bash
composer test        # config:clear + php artisan test (PHPUnit 11, tests/)
npx tsc --noEmit     # TypeScript check
bun run build        # client + SSR build (catches broken imports)
./vendor/bin/pint    # PHP code style fixer (run on the files you touched)
```

Run all four before merging to `main` — pushes to `main` deploy automatically.

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
- **Design system:** tokens, themes, icons, search and consent conventions are in [design-guidelines.md](../design-guidelines.md).
- **Image uploads** are validated and compressed client-side (`resources/js/lib/image-utils.ts`) and processed server-side by `App\Services\ImageService` (Intervention Image).
- **Roles:** simple string column `users.role` (`user` / `moderator` / `admin`) checked via middleware `EnsureUserCanModerate`, `EnsureUserIsAdmin`, `EnsureUserNotBanned`.
