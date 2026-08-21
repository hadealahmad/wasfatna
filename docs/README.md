# Wasfatna (وصفاتنا) — Documentation

Documentation for **Wasfatna**, a full-stack Syrian recipe platform (discover, share, plan meals) built with Laravel 12 + Vue 3 via Inertia.js, plus a Sanctum REST API for mobile clients.

> Production: `food.syrian.zone` — deployed automatically on push to `main` via GitHub Actions (self-hosted runner).

## Documentation Map

```
docs/
├── README.md                        ← You are here (index & navigation)
├── architecture/
│   ├── software-map.md              ← Tech stack, directory map, request lifecycle
│   └── database-schema.md           ← ERD / schema charts for all tables
├── features/
│   ├── user-features.md             ← Public & authenticated user features
│   ├── admin-moderation.md          ← Moderator/admin dashboard & API
│   └── api-reference.md             ← Sanctum REST API endpoint map
├── guides/
│   ├── development.md               ← Local dev setup, commands, workflows
│   └── deployment-and-updates.md    ← Requirements, deploy pipeline, maintenance
├── design-guidelines.md             ← Styling, theming, RTL, component conventions
└── history/
    └── audit_report.md              ← 2026-08 repo audit & optimization record
```

## Quick Links

| I want to… | Go to |
|---|---|
| Run the project locally | [guides/development.md](guides/development.md) |
| Understand the stack & structure | [architecture/software-map.md](architecture/software-map.md) |
| Understand the data model | [architecture/database-schema.md](architecture/database-schema.md) |
| See what the app can do | [features/user-features.md](features/user-features.md) |
| Moderate content / use the dashboard | [features/admin-moderation.md](features/admin-moderation.md) |
| Integrate with the mobile/REST API | [features/api-reference.md](features/api-reference.md) |
| Follow styling conventions | [design-guidelines.md](design-guidelines.md) |
| Deploy or update production | [guides/deployment-and-updates.md](guides/deployment-and-updates.md) |

## The Stack at a Glance

- **Backend:** PHP ^8.2, Laravel 12, Sanctum 4, Socialite (Google), Intervention Image, Ziggy
- **Frontend:** Vue 3.5 + TypeScript, Inertia.js 2 (with SSR), Tailwind CSS 4, Radix Vue/shadcn-style UI, Lucide icons
- **Build:** Vite 7 (`bun run build` in CI; `npm` also works)
- **Database:** SQLite (default) / MySQL / PostgreSQL
- **Tests:** PHPUnit 11 (`composer test`)
