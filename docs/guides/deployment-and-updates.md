# Deployment and Updates

Wasfatna ships as a single Docker image built from the repository `Dockerfile`.
Pushes to `main` are built and deployed automatically; there is no deploy
workflow in `.github/workflows/`.

---

## 1. The container image

`Dockerfile` (multi-stage):

| Stage | Base | Does |
|---|---|---|
| `frontend-builder` | `oven/bun:1` | `bun install --frozen-lockfile` + `bun run build` (client **and** SSR bundles) |
| `ssr-deps` | `oven/bun:1` | production `node_modules` for the optional SSR server |
| runtime | `serversideup/php:8.4-fpm-nginx` | nginx + php-fpm, `composer install --no-dev`, PHP extensions `gd exif intl`, Node 22 for SSR, `mariadb-client` |

The app listens on **port 8080**. Health check: `GET /up` (Laravel's built-in route).

### Startup (`docker/10-startup.sh`, runs before nginx/php-fpm)

1. Waits up to ~60 s for the database (`artisan db:show`).
2. `php artisan migrate --force` — a failed migration stops the boot, so a rolling
   deploy keeps the previous container serving.
3. `storage:link --force`, then `optimize:clear` and `config/route/view/event:cache`.

### Long-running services (S6 Overlay, `docker/s6/`)

| Service | Command |
|---|---|
| `queue-worker` | `php artisan queue:work --tries=3 --timeout=300` |
| `laravel-scheduler` | `php artisan schedule:run` every 60 s |
| `inertia-ssr` | `node bootstrap/ssr/ssr.js` on 127.0.0.1:13714 — on by default; idles when `INERTIA_SSR_ENABLED=false` |

### Persistent data

- **Uploads:** mount a persistent volume at `/var/www/html/storage/app/public`
  (recipe and avatar images). Without it every deploy loses uploaded files.
- **Database:** external MySQL/PostgreSQL (sessions, cache and queue also use
  the database by default).
- Logs: set `LOG_CHANNEL=stderr` so they appear in the container logs.

### Environment variables that matter for the container

Start from `.env.example`; pass values as container environment variables (no
`.env` file is baked into the image — `.dockerignore` excludes it).

| Variable | Notes |
|---|---|
| `APP_ENV` | **`production`**. `local` enables the passwordless `/dev-login` admin route and the relaxed CSP — never use it on a public host. |
| `APP_KEY` | Keep it stable across deploys; changing it invalidates sessions and encrypted values. |
| `APP_URL` | Public HTTPS URL. |
| `TRUSTED_PROXIES` | `*` when behind a reverse proxy that terminates TLS, so Laravel sees HTTPS and the real client IP. Empty = trust none. |
| `INERTIA_SSR_ENABLED` | Image default `true`: pages are server-rendered, so crawlers and link previews get per-page titles, meta tags, JSON-LD and content. `false` falls back to client-side rendering with the generic head from `app.blade.php`. |
| `GA_MEASUREMENT_ID` | Google Analytics id (consent-gated, see `resources/js/lib/analyticsConsent.ts`). Empty disables analytics and the consent banner. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REDIRECT_URI` | Google sign-in (Socialite). |
| `DB_*`, `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION`, `FILESYSTEM_DISK=public` | As in `.env.example`. |

With `APP_ENV=production` the app also sends HSTS, uses the strict CSP
(`'strict-dynamic'` + nonce) and names the session cookie with the `__Host-`
prefix (requires HTTPS, no `SESSION_DOMAIN`).

---

## 2. Run the production image locally

```bash
docker build -t wasfatna .

docker network create wasfatna-test
docker run -d --name wt-db --network wasfatna-test \
  -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=wasfatna \
  -e MYSQL_USER=wasfatna -e MYSQL_PASSWORD=secret mysql:8.4

docker run -d --name wt-app --network wasfatna-test -p 18080:8080 \
  -e APP_ENV=production -e APP_DEBUG=false \
  -e APP_KEY="base64:$(head -c32 /dev/urandom | base64)" \
  -e APP_URL=http://localhost:18080 \
  -e DB_CONNECTION=mysql -e DB_HOST=wt-db -e DB_DATABASE=wasfatna \
  -e DB_USERNAME=wasfatna -e DB_PASSWORD=secret \
  -e SESSION_DRIVER=database -e CACHE_STORE=database -e QUEUE_CONNECTION=database \
  -e FILESYSTEM_DISK=public -e LOG_CHANNEL=stderr -e GA_MEASUREMENT_ID= \
  wasfatna

docker inspect -f '{{.State.Health.Status}}' wt-app   # → healthy
curl -I http://localhost:18080/up
```

`APP_ENV=production` sets secure session cookies, so signing in over plain
`http://localhost` will not stick; use `APP_ENV=local` for interactive testing
of authenticated pages, or put the container behind HTTPS.

Clean up: `docker rm -f wt-app wt-db && docker network rm wasfatna-test`.

---

## 3. Updating production

1. Merge to `main` (CI-quality checks first: `bun run build`, `npx tsc --noEmit`,
   `php artisan test`, `./vendor/bin/pint --test` on touched PHP files).
2. The push triggers an image build and a rolling deploy; the new container
   runs migrations on boot and only receives traffic once `/up` is healthy.
3. Migrations must be safe to run while the previous release is still serving
   (additive changes first, destructive clean-ups in a later release).

---

## 4. Deploying without containers (generic server)

Requirements: PHP 8.2+ (`pdo_mysql`/`pdo_sqlite`, `mbstring`, `openssl`,
`tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `gd`, `exif`, `curl`, `intl`),
Composer 2, Bun (or Node 20+), a web server with the document root at `public/`.
`proc_open` must be allowed for the CLI (Composer and Artisan need it).

```bash
php artisan down --retry=60
git pull origin main
composer install --no-dev --optimize-autoloader
bun install --frozen-lockfile && bun run build
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache && php artisan event:cache
php artisan storage:link --force
php artisan queue:restart
php artisan inertia:stop-ssr || true   # only if an SSR server is running
php artisan up
```

Keep a queue worker (`php artisan queue:work`) and the scheduler
(`php artisan schedule:run` every minute) running under a process manager.

---

## 5. Production checklist

- [ ] `APP_ENV=production`, `APP_DEBUG=false` (`/dev-login` must return 404).
- [ ] `APP_KEY` unchanged between releases.
- [ ] Uploads directory on persistent storage.
- [ ] Regular database backups.
- [ ] `TRUSTED_PROXIES` set when behind a TLS-terminating proxy.
