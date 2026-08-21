# Database Schema

Source of truth: `database/migrations/`. Default connection is SQLite (`database/database.sqlite`); MySQL/PostgreSQL supported via `.env`.

## 1. Entity Relationship Overview

```
users ──────────┬──< recipes >──── cities
                │        │  \
                │        │   >── anonymous_authors
                │        ├──< recipe_ingredients >── ingredients
                │        ├──< recipe_tags >──────── tags
                │        └──< recipe_revisions
                ├──< lists (recipe_lists) >──< list_items >── recipes
                ├──< meal_plans ──< meal_plan_entries >── recipes
                │        └──> meal_plan_presets (nullable)
                ├──< reports (polymorphic: reportable)
                └──< personal_access_tokens (Sanctum)

settings            (key/value app settings)
cities              (image_path column for city artwork)
```

## 2. Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | pk | |
| name, email | string | email unique |
| role | string | `user` / `moderator` / `admin` |
| password | string | nullable for OAuth-only accounts |
| … | | standard Laravel auth columns |

### recipes
| Column | Type | Notes |
|---|---|---|
| id | pk | |
| name / slug | string | slug used in URLs; `/{slug}.md` serves markdown |
| image_path | string? | compressed via ImageService |
| time_needed | json | supports per-step times |
| servings | string? | |
| steps | json | grouped or simple arrays |
| difficulty | enum | `سهلة جداً` / `سهلة` / `متوسطة` / `صعبة` / `صعبة جداً` |
| status | enum | `draft` / `pending` / `approved` / `rejected` / `unpublished` |
| rejection_reason | text? | |
| approved_by → users, approved_at | | moderation trail |
| needs_reapproval | bool | set when an approved recipe is edited |
| is_anonymous | bool | + `anonymous_author_id` FK |
| city_id → cities, user_id → users | FK nullable | nullOnDelete |
| description | text? | added 2026-02-14 migration |
| indexes | | `name`, `status`, `(name,status)` |

### recipe_ingredients (pivot)
`recipe_id`, `ingredient_id`, structured columns (quantity/unit added 2025-12-14), `sort_order` (2026-01-03) for drag-and-drop ordering.

### ingredients
`name` (+ searchable via `/api/ingredients/search`).

### tags / recipe_tags
Simple tag system; bulk destroy available to moderators.

### cities
`name`, `slug`, `image_path`. Recipes optionally belong to a city (Syrian regions).

### anonymous_authors
Named authors for imported/legacy recipes not tied to a user account. Admin-manageable ("anonymous authors" screen).

### lists (recipe_lists) & list_items
| lists | notes |
|---|---|
| user_id | owner |
| name, slug?, description?, cover_image? | |
| is_default | per-user default favorites list |
| is_public | visibility |
| status | `draft` / `review` / `approved` / `rejected` — publish requires moderator approval (`request-publish`) |

`list_items`: `list_id`, `recipe_id`, `order`; unique `(list_id, recipe_id)`.

### recipe_revisions
Version history snapshots of recipe edits (shown on `/recipes/{slug}/variations`).

### reports
Polymorphic: `reportable_id` / `reportable_type` (recipes, lists, users…), `type` (`content_issue` / `feedback`), `message`, `status` (`pending` / `fixed` / `rejected`), `admin_note`, `admin_reply`. Users can view their own reports at `/my/reports`.

### meal_plan_presets
Admin-curated plan templates: `name`, `slug`, `description`, `start_date`, `end_date`, `type` (`ramadan` / `custom`), `is_active`.

### meal_plans
Per-user plans: `user_id`, `name`, `slug`, `description`, `start_date`, `end_date`, optional `preset_id`, `is_public`, `share_token` (unique — powers public `/meal-plans/shared/{token}`).

### meal_plan_entries
`meal_plan_id`, `date`, `recipe_id?` (or `custom_title`), `notes`, `meal_type` (`main` / `iftar` / `suhoor` / `dessert`), `is_done`, `order`. Index `(meal_plan_id, date)`.

### settings
Key/value store managed at `/dashboard/settings`; includes data import tooling (`/dashboard/import`).

### Laravel framework tables
`cache`, `jobs` (queues), `personal_access_tokens` (Sanctum).

## 3. Migration Timeline (summary)

| Date | Migration |
|---|---|
| baseline | users, cache, jobs |
| 2025-12-13 | cities, anonymous_authors, ingredients, recipes, recipe_ingredients, sanctum tokens |
| 2025-12-14 | drop recipes.ingredients JSON → pivot; structured ingredient columns; city images; tags, recipe_tags |
| 2025-12-15 | lists tables, settings, recipe_revisions |
| 2025-12-16 | reports |
| 2026-01-03 | ingredient sort_order |
| 2026-02-14 | meal plan tables (presets, plans, entries); recipes.description |
