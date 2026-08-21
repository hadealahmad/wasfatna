# Design Guidelines & Styling

Conventions for UI work in `resources/`.

## 1. Styling Stack

- **Tailwind CSS v4** via `@tailwindcss/vite` — CSS-first config in `resources/css/app.css` (no `tailwind.config.js`).
- Theme tokens defined with `@theme inline` mapping to CSS variables (`--background`, `--foreground`, `--primary`, `--sidebar-*`, `--chart-1..5`, …) — shadcn-style semantic palette.
- **Dark mode:** class-based via custom variant — `@custom-variant dark (&:is(.dark *))`. Toggle the `.dark` class on `<html>`.
- Fonts: `'IBM Plex Sans Arabic', 'Instrument Sans'` as the sans stack (Arabic-first typography).

## 2. RTL / Bilingual

- Primary content language is **Arabic**; difficulty enums and labels are stored in Arabic.
- Layout must remain RTL-safe: prefer logical properties (`ps-`, `pe-`, `ms-`, `me-`) over physical (`pl-`, `pr-`).

## 3. Component Conventions

- **UI primitives** live in `resources/js/components/ui/` — shadcn-style wrappers around **Radix Vue**, one component per file, exported from `ui/index.ts`.
- Class merging uses the `cn()` helper (`clsx` + `tailwind-merge`) from `resources/js/lib/utils.ts`.
- Variants use `class-variance-authority` (see `Button.vue`).
- Icons: `lucide-vue-next` only — no inline SVG duplicates.
- Toasts: `vue-sonner`.
- Feature components are grouped by domain under `components/{recipes,features,admin,reports,randomizer,layout}`.

## 4. Frontend Patterns

- Pages in `resources/js/Pages/**` rendered through Inertia; props typed with TypeScript interfaces.
- Named routes via Ziggy's `route()` helper — never hardcode URLs in Vue.
- Forms submit via Inertia router; small interactive mutations go to `/web-api/*` JSON endpoints with axios/fetch.
- Drag-and-drop ordering (ingredients, list items, meal entries) uses `vuedraggable`; it is isolated into a `vendor-draggable` chunk — import it only where needed.
- Images: validate + compress client-side before upload using `lib/image-utils.ts`; server re-compresses via `App\Services\ImageService`.
- OG images use `.webp` (`public/og-image.webp`) — keep payloads small.

## 5. Performance Rules

- Keep manual chunk groups in `vite.config.js` (`vendor-vue`, `vendor-ui`, `vendor-draggable`) intact when adding heavy deps; add new large libraries to their own chunk.
- SSR is enabled (`ssr.ts`) — components must be SSR-safe (guard browser APIs in `onMounted`, not at setup top-level).

## 6. Backend Conventions

- Controllers split by surface: `Http/Controllers/Web` (Inertia pages) vs `Http/Controllers/Api` (JSON).
- Authorization via role middleware (`moderator`, `admin`, `not-banned`), not inline checks in controllers.
- PHP style enforced with Laravel Pint (`./vendor/bin/pint`).
