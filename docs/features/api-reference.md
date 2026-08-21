# REST API Reference (Sanctum)

Base prefix: `/api` (`routes/api.php`). Token auth via Laravel Sanctum; `not-banned` middleware enforced on authenticated routes.

## Public Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/recipes` | Paginated recipe list (filters: search, city, tags) |
| GET | `/api/recipes/randomizer` | Random recipe(s) |
| GET | `/api/recipes/{slug}` | Recipe detail |
| GET | `/api/recipes/{slug}/variations` | Revision history |
| GET | `/api/cities` | City list with counts |
| GET | `/api/cities/{slug}/recipes` | Recipes for a city |
| GET | `/api/users/{id}` | Public profile |
| GET | `/api/users/{id}/recipes` | User's published recipes |
| GET | `/api/ingredients/search` | Ingredient autocomplete |
| GET | `/api/tags` | Tag list |

### OAuth
- `GET /api/auth/google` → redirect
- `GET /api/auth/google/callback` → token exchange

## Authenticated (any user, not banned)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/user` | Current user |
| PUT | `/api/user/profile` | Update profile |
| POST | `/api/user/request-deletion` | Request account deletion |
| POST | `/api/user/cancel-deletion` | Cancel deletion request |
| POST | `/api/auth/logout` | Revoke token |
| GET | `/api/my-recipes` | Own recipes incl. drafts |
| POST | `/api/recipes` | Create recipe |
| PUT | `/api/recipes/{recipe}` | Update recipe (sets `needs_reapproval`) |
| POST | `/api/recipes/{recipe}/unpublish` | Unpublish own recipe |
| GET / DELETE | `/api/recipes/{recipe}/history` | View / clear revision history |
| POST | `/api/reports` | Report content |
| GET | `/api/my-reports` | Own reports + admin replies |

## Moderator (`auth:sanctum` + moderator, prefix `/api/admin`)

- `GET dashboard` — stats
- `GET recipes/pending`, `GET recipes`, `POST recipes/bulk`
- `POST recipes/{recipe}/approve|reject|unpublish`
- `GET ingredients`, `GET anonymous-authors`, `POST anonymous-authors`
- Tags CRUD: `GET tags`, `GET tags/adminIndex`, apiResource minus index/show, `POST tags/bulk` (bulk destroy)
- Lists moderation: `GET lists`, `GET lists/pending`, `POST lists/bulk`, `POST lists/{list}/approve|reject`
- Reports: `GET reports`, `GET reports/{report}`, `PUT reports/{report}`, `DELETE reports/{report}`, `POST reports/bulk`

## Admin-only (prefix `/api/admin`)

- `GET users`, `POST users/bulk`, `GET users/deletion-requests`
- `PUT users/{user}/role`, `POST users/{user}/ban|unban`, `DELETE users/{user}`
- `DELETE recipes/{recipe}` (hard delete)

## Web SPA fetch endpoints (`/web-api/*`, session auth — in routes/web.php)

Used by the Vue app for interactive features:

- Lists: `GET/POST /web-api/lists`, `POST /web-api/lists/{list}/toggle` (add/remove recipe)
- Meal plans: `POST /web-api/meal-plans/{plan}/entries`, `DELETE .../entries/{entry}`, `POST .../entries/{entry}/done`, `PUT .../entries/{entry}`, `POST .../random-fill`, `POST .../toggle-public`, `GET /web-api/recipes/search` (picker)
