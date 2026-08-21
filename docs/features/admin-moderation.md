# Admin & Moderation Features

Dashboard entry: `/dashboard` (requires `auth` + `not-banned` + `moderator` role). Admin-only sections additionally require the `admin` role.

## Moderator Capabilities

### Dashboard Overview
- `Dashboard/Index.vue` — moderation stats and queues.

### Recipe Moderation (`/dashboard/recipes`)
- List all recipes with filters; bulk actions (`bulk`, `bulk-tag`).
- Approve / reject (with reason) / unpublish individual recipes.
- Rejected recipes return to authors with `rejection_reason`.

### AI Processing
- `POST /dashboard/ai/process` → `Api\AiController@process` — AI-assisted recipe processing pipeline from the dashboard.

### Reports (`/dashboard/reports`)
- Review polymorphic reports, bulk actions, reply to users (visible at `/my/reports`).

### Tag Moderation
- Admin tag screens (`Web\AdminTagController`) + API bulk destroy of tags.

## Admin-Only Capabilities

### Users (`/dashboard/users`)
- List/search users, bulk actions, change roles, ban/unban, delete.
- Deletion requests flow: users request account deletion via API (`user/request-deletion`), admins review.

### Cities (`/dashboard/cities`)
- CRUD for Syrian cities incl. image upload; bulk actions.

### Settings (`/dashboard/settings`)
- App-wide key/value settings editor + data import trigger.

### Import (`/dashboard/import`)
- Web UI over the import pipeline (`AdminImportController`, backed by `ImportRecipes` / `ImportRecipeImages` commands). Creates recipes, ingredients, cities, anonymous authors.

### Meal Plan Presets (`/dashboard/meal-plan-presets`)
- CRUD curated plan templates (e.g. Ramadan plans) that users can instantiate.

## Related REST API

All admin/moderation actions are mirrored in the Sanctum API under `/api/admin/*` — see [api-reference.md](api-reference.md).
