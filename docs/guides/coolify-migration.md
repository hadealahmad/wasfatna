# Migration plan: server.hadealahmad.com → Coolify

Move `food.syrian.zone` from the Virtualmin host (`server.hadealahmad.com`,
user `syrian`) to the Coolify host (`vmi2944963`, 62.171.131.239, dashboard at
`cool.hadealahmad.com`) **without losing any user data**: accounts, sessions,
recipes, lists, meal plans, reports and uploaded images.

## Why

The old host's CLI `php.ini` disables `proc_open`/`exec` for every user, so
`composer install` and `php artisan` cannot run during deploys. The current
workflow works around it with `php -d disable_functions=mail` (commit
`c67ad37`). In Coolify the app runs in its own container with its own PHP
config, deploys straight from GitHub, and no self-hosted runner is needed.

## Current production (audited 2026-11-21)

| Item | Value |
|---|---|
| Code | `/home/syrian/domains/food.syrian.zone/public_html` (rsync'd by the `cooking-runner` self-hosted runner) |
| Database | MySQL (`DB_CONNECTION=mysql`); sessions, cache and queue also in the DB |
| Uploads | `storage/app/public`, 89 MB (`FILESYSTEM_DISK=public`) |
| Queue worker | **not running** (database queue, nothing consumes it) |
| SSR server | **not running** (SSR bundle built, pages render client-side) |
| Scheduler | no cron for this app (the `schedule:run` cron in `syrian`'s crontab points at `/home/syrian/public_html/repo/backend`, a different app) |
| DNS | `food.syrian.zone` → Cloudflare (proxied). `apifood.syrian.zone` has **no DNS record** (unused) |
| Backup taken | `/home/syrian/backups/food-db-20261121-153754.sql.gz` (19 tables, before today's deploy) |

## Target on Coolify

- Coolify project **wasfatna**, environment **production**.
- **MySQL 8** database resource (internal network only, Coolify scheduled backups on).
- **Application** from GitHub `hadealahmad/wasfatna`, branch `main`, build pack
  **Dockerfile**, auto-deploy on push.
- **Persistent volume** mounted at `/var/www/html/storage/app/public` (uploads
  survive every redeploy).
- Processes in the one container via s6 (same pattern as SyrianZone's
  `serversideup/php` image): nginx + php-fpm, `queue:work`, `schedule:work`,
  and the Inertia SSR server.
- Health check on Laravel's `/up`.
- Domain `food.syrian.zone`, still proxied by Cloudflare.

## Data that must be preserved — and how

| Data | Method | Check |
|---|---|---|
| All DB tables (users, recipes, lists, meal plans, reports, sessions…) | `mysqldump --single-transaction --routines --triggers` → import into Coolify MySQL | row counts per table match on both sides |
| Uploaded images | `rsync -a` from old `storage/app/public` into the Coolify volume (twice: rehearsal + final delta) | file count and total bytes match; sample images load |
| `APP_KEY` | copy the **same** value into Coolify env | existing sessions and any encrypted values still decrypt; users stay signed in |
| Google sign-in | domain unchanged, so `GOOGLE_REDIRECT_URI` and the Google console stay as they are | sign in works after cutover |
| Other `.env` values (66 keys) | copy into Coolify environment variables; DB host/credentials point at the new MySQL | `php artisan about` in the container |

## Phases

### 1. Containerise (branch `feature/coolify-migration`)
- Multi-stage `Dockerfile`: Bun stage builds client + SSR assets → production
  stage `serversideup/php:8.4-fpm-nginx` with Composer `--no-dev`.
- s6 services for queue worker, scheduler and SSR; startup script runs
  `migrate --force`, `config/route/view/event:cache`, `storage:link`.
- `.dockerignore` (no `.env`, `node_modules`, `storage/app/public` contents, `.git`).
- Build and run it locally against a MySQL container loaded with a copy of the
  production dump; run the test suite.

### 2. Provision on Coolify
- Create the project, MySQL resource, application, volume and env vars.
- First deploy on a temporary hostname (e.g. `food-staging.syrian.zone` or a
  Coolify sslip.io URL), not the real domain.

### 3. Rehearsal migration (no downtime)
- Fresh dump from the old DB → import into Coolify MySQL; rsync uploads.
- Verify on the temporary hostname: pages, search, recipe images, randomizer,
  row counts, uploads count. (Google sign-in can only be fully tested on the
  real domain unless a temporary redirect URI is added in the Google console.)
- Fix anything found; repeat until clean.

### 4. Cutover (planned window, ~10–15 min of read-only time)
1. `php artisan down` on the old host (visitors see the maintenance page).
2. Final dump → import (replaces rehearsal data); final rsync of uploads delta.
3. Compare row counts and file counts.
4. In Cloudflare, point `food.syrian.zone` at 62.171.131.239 (keep proxied).
   Certificate: Coolify/Traefik Let's Encrypt, or a Cloudflare origin cert
   if the HTTP challenge is blocked by Cloudflare settings.
5. Smoke test on the real domain: sign in with Google, open a recipe, upload a
   test image, submit and delete a test report.

### 5. Rollback window and clean-up
- Keep the old host intact (maintenance mode on, data untouched) for 1–2
  weeks. **Rollback** = point DNS back and run `php artisan up` there (any data
  written on Coolify in the meantime would have to be copied back).
- After the window: stop and uninstall the `cooking-runner` service, remove
  the `php -d disable_functions` workaround and the self-hosted deploy
  workflow, archive a final dump.

## Needed from the owner before execution
- ~~Access to the Coolify dashboard/API~~ — done: root SSH to `vmi2944963` and an
  API token named `wasfatna-migration` (Root Team) created 2026-11-21; revoke it
  under Keys & Tokens in the dashboard after the migration.
- Cloudflare DNS access for `syrian.zone` (or making the DNS change yourself
  at cutover).
- A cutover time.

## Rehearsal results (2026-11-21)

- Coolify project `wasfatna` (`tpt9wkigjvtmwjyixncsdvgy`), MySQL 8.4 `wasfatna-mysql`
  (`fgxappb8efqhrz4fblorjxjj`, internal only), app `wasfatna-app`
  (`ja69lnzq7sc4zt6btnltevsa`) on branch `feature/coolify-migration`, staging URL
  `https://wasfatna.62.171.131.239.sslip.io` (Let's Encrypt).
- Env: 54 variables, taken from the old `.env` with Laravel's first-value-wins
  rule; effective production values kept (`APP_ENV=local`, `FILESYSTEM_DISK=public`,
  database session/cache/queue). DB_* point at the Coolify MySQL; `TRUSTED_PROXIES=*`,
  `LOG_CHANNEL=stderr`; `APP_URL` = staging URL and `GA_MEASUREMENT_ID` empty until cutover.
- Database: all 25 tables match row-for-row (120 users, 97 recipes, 53 lists,
  12 meal plans, 349 meal-plan entries, 19 sessions…).
- Uploads: 211 files / 92,838,410 bytes on both sides, owned by www-data (33).
- Container healthy; queue worker and scheduler running under s6; SSR idle.
- Cloudflare SSL mode is **Full** (origin reached on 443, self-signed accepted), so
  no certificate change is needed at cutover and no Flexible-mode redirect loop.

## Cutover runbook

1. Old host: `php artisan down` (as `syrian`).
2. Stream a final dump into the Coolify MySQL; compare per-table row counts.
3. Re-copy `storage/app/public` into the volume; compare file count and bytes.
4. Coolify: `APP_URL=https://food.syrian.zone`, remove the empty `GA_MEASUREMENT_ID`
   (falls back to the production id), add `https://food.syrian.zone` to domains,
   redeploy, wait for healthy; test the new origin with `--resolve`.
5. **Owner:** in Cloudflare set the `food.syrian.zone` A record to `62.171.131.239`
   (proxied); remove or update any AAAA record that points at the old host.
6. Smoke test on the real domain (Google sign-in, recipe, image upload, report).
7. Later: merge `feature/coolify-migration` → `main`, point the app at `main`
   with auto-deploy, remove the self-hosted workflow and stop `cooking-runner`;
   old host stays in maintenance mode as the rollback for 1–2 weeks.

Follow-up (separate from the move): production runs with `APP_ENV=local`.
Switching to `production` changes the session cookie name (`__Host-` prefix),
which signs everyone out once — do it deliberately, not during the move.

## Cutover completed (2026-11-21)

- Old host put in maintenance mode at 15:17 UTC; final DB dump (25 tables matched,
  incl. 120 users, 26 sessions) and uploads (211 files / 92,838,410 bytes matched)
  copied; owner switched the Cloudflare A record to 62.171.131.239 (proxied).
- Live smoke test on food.syrian.zone passed (all pages 200, images, search,
  Google OAuth redirect to the unchanged callback).
- Deploys now: push to `main` → GitHub webhook → Coolify build. The self-hosted
  `deploy.yml` workflow is removed; the old host keeps its data in maintenance
  mode as the rollback (point DNS back + `php artisan up`).
- Backups on the old host: `/home/syrian/backups/food-db-20261121-153754.sql.gz`
  and `food-db-cutover-20261121-161730.sql.gz`.
