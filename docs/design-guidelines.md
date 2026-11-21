# Design Guidelines & Styling

Conventions for UI work in `resources/`. The design system follows the
SyrianZone app (tokens, themes, fonts, navbar, search, icons), ported to Vue.

## 1. Styling stack

- **Tailwind CSS v4** via `@tailwindcss/vite`; CSS-first config in
  `resources/css/app.css` (no `tailwind.config.js`).
- **Colour is always a token.** Use the semantic classes (`bg-background`,
  `text-foreground`, `bg-card`, `bg-popover`, `bg-primary`, `text-primary-foreground`,
  `bg-secondary`, `bg-muted`, `text-muted-foreground`, `bg-accent`, `bg-destructive`,
  `bg-success`, `bg-warning`, `bg-info`, `fill-chart-1..6`, `border-border`,
  `border-input`, `ring-ring`) and their `/opacity` forms. Literal hex/rgb or
  palette colours (`amber-500`, `text-white`…) escape the themes and are bugs.
  Only exception: a dark scrim over photos.
- Tokens are HSL triplets (`--primary: 217 91% 65%`) mapped in `@theme` as
  `hsl(var(--x))`. Radius scale is based on `--radius: 0.5rem`.

## 2. Themes and appearance

- 9 themes: `system`, `light`, `dark`, `dark-blue` (**default**), `dark-purple`,
  `dark-green`, `high-contrast`, `damascus-rose`, `jasmine`.
- Registry: `resources/data/themes.json` (ids, Arabic labels, storage keys
  `wasfatna-theme` / `wasfatna-font`, default theme). Blade, CSS and TS all read it.
- A theme is two attributes on `<html>`: `data-theme="<id>"` and
  `data-scheme="light|dark"` (plus `data-font`). They are set before paint by the
  inline script in `resources/views/app.blade.php` and at runtime by
  `resources/js/lib/theme.ts`.
- Tailwind's `dark:` variant is `[data-scheme="dark"]` — never toggle a `.dark` class.
- Read/change appearance with `useTheme()` (`composables/useTheme.ts`:
  `theme`, `scheme`, `font`, `isDark`, `toasterTheme`, `setTheme`, `setFont`).
  `useColorScheme()` is a thin compatibility wrapper.
- `components/AppearanceMenu.vue` is the **only** theme/font switcher.
- Adding a theme: a CSS variable block in `app.css` for **every** token (including
  `success/warning/info/chart-*`) **and** an entry in `themes.json`; check contrast
  of `--primary` vs `--primary-foreground` and `--muted-foreground` on `--background`.

## 3. Fonts

- **IBM Plex Sans Arabic**, self-hosted in `public/fonts/ibm-plex-sans-arabic/`
  (weights 400/500/600/700, OFL-1.1) with a metric-matched local fallback face.
  No Google Fonts.
- Users can switch to the system font from the appearance menu (`data-font="system"`).

## 4. RTL and copy

- RTL is the default; use logical utilities (`ms/me`, `ps/pe`, `start/end`,
  `text-start/end`, `rounded-s/e`, `border-s/e`). Physical left/right only inside
  `dir="ltr"` islands (numbers, code, the randomizer reel).
- Numbers and times: `tabular-nums`, and `dir="ltr"` where the content is LTR.
- UI copy is Modern Standard Arabic; code, comments and docs are English.

## 5. Icons

- **UI icons:** `lucide-vue-next` only. No emoji as UI icons, no ad-hoc inline SVGs
  (brand logos such as the Google "G" excepted).
- **Section icons:** duotone drawings in `resources/data/project-icons.json`,
  rendered with `<ProjectIcon name="…" />` (`components/ProjectIcon.vue`), in the
  SyrianZone project-icon style (32×32, token colours). Names: `recipes`, `cities`,
  `lists`, `meal_plans`, `randomizer`, `search`, `add_recipe`, `about`, `dashboard`
  (aliases `meal-plans`, `add-recipe`, `crate`). Used in nav tiles, homepage
  shortcuts, section headers and empty states. New drawings must use token colour
  classes, never literal hex.

## 6. Components

- **Primitives:** `components/ui/` — shadcn-style wrappers around Radix Vue, one
  component per file, exported from `ui/index.ts`, class strings matching
  SyrianZone's `ui/*.tsx`. Extend an existing component with a variant instead of
  forking it. Includes `FilterChip` (toggle chip with `aria-pressed`) and `Separator`.
- `cn()` (`lib/utils.ts`) for class merging; `class-variance-authority` for variants.
- **Layout:** `Layouts/PublicLayout.vue` (skip link, one `<main id="main-content">`,
  footer, consent banner, global search shortcut) and
  `components/layout/PublicHeader.vue` (sticky `h-16` navbar, "المزيد" panel,
  full-screen mobile menu) + `UserNav.vue` (account menu).
- Toasts: `vue-sonner`. Feature components live under
  `components/{recipes,features,admin,reports,randomizer,search,layout}`.

## 7. Search

- **Global search:** `components/search/GlobalSearch.vue` (navbar trigger +
  command palette) backed by `GET /api/search/global?q=` (`SearchController@global`).
  Ctrl/Cmd+K and `/` are bound once by `useGlobalSearchShortcut()` in the layout —
  pages must not bind them.
- **Inline page search:** `SmartFilterSearch.vue` (search field + facet chips); it
  calls `registerInlineSearch()` so Ctrl/Cmd+K focuses it while the page is open.
- **Arabic matching:** normalise with `lib/arabic.ts` (client) and
  `App\Support\ArabicSearch` (server: hamza forms, ة/ه, ى/ي, tashkeel, tatweel;
  LIKE wildcards escaped). Keep both in step.

## 8. Analytics consent

Google Analytics is loaded only by `lib/analyticsConsent.ts`, and only after the
visitor accepts in `AnalyticsConsentBanner.vue`. Never add a gtag snippet to
Blade or a page. Global Privacy Control counts as a refusal; page views send the
path only. The privacy page documents the stored key (`wasfatna-analytics-consent`).

## 9. Frontend patterns

- Pages in `resources/js/Pages/**`, rendered through Inertia, props typed with
  TypeScript interfaces; one `<h1>` per page.
- Named routes via Ziggy's `route()` — never hardcode URLs in Vue.
- Forms submit via the Inertia router; small mutations go to `/web-api/*` JSON
  endpoints.
- Drag-and-drop uses `vuedraggable`, isolated in the `vendor-draggable` chunk.
- Images: validate + compress client-side (`lib/image-utils.ts`); the server
  re-encodes to WebP via `App\Services\ImageService`.
- Accessibility: icon-only buttons need `aria-label`; respect
  `prefers-reduced-motion`; announce async results with `aria-live`.

## 10. Performance and SSR

- Keep the manual chunk groups in `vite.config.js` (`vendor-vue`, `vendor-ui`,
  `vendor-draggable`); give new large libraries their own chunk.
- An SSR bundle (`ssr.ts`) is always built; whether it runs is controlled by
  `INERTIA_SSR_ENABLED` (see `guides/deployment-and-updates.md`). Components must
  stay SSR-safe either way: no `window`/`document`/`localStorage` at setup top
  level — read them in `onMounted` (see `useAnalyticsConsent()` for the pattern).

## 11. Backend conventions

- Controllers split by surface: `Http/Controllers/Web` (Inertia pages) vs
  `Http/Controllers/Api` (JSON).
- Authorization via middleware (`moderator`, `admin`, `not-banned`), not inline checks.
- PHP style: Laravel Pint (`./vendor/bin/pint`) on the files you touch.
