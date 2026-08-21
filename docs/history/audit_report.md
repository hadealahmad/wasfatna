# Repository Audit & Optimization Report
**Project:** Wasfatna (وصفاتنا) — Syrian Cooking Platform  
**Date:** 2026-08-02  
**Status:** Audit Complete & Key Optimizations Executed ✅

---

## 1. Project Architecture Overview

This is a **dual-subproject Laravel monorepo** serving both a web app and a mobile API client:

| Layer | Description |
|---|---|
| **Inertia SSR Web App** | Vue 3 pages under `resources/js/Pages/` rendered via `app/Http/Controllers/Web/` and `routes/web.php` |
| **Sanctum JSON API** | `app/Http/Controllers/Api/` + `routes/api.php` — serves mobile clients or external subprojects |
| **Shared Infrastructure** | Laravel models, services, middleware, migrations — shared between both |
| **Build** | Vite + TailwindCSS v4 + TypeScript; SSR bundle built separately via `ssr.ts` |

---

## 2. Completed Fixes & Optimization Results

### 2.1 Asset & OG Image Optimization (Saved ~950 KB payload)
- **Updated** references from `og-image.png` to `og-image.webp` across `app.blade.php`, `Welcome.vue`, `Recipes/Show.vue`, and `Users/Show.vue`.
- **Deleted** the redundant `public/og-image.png` file (**1.2 MB**), leaving `public/og-image.webp` (**252 KB**) as the single active OG image asset.

### 2.2 CI/CD Lockfile Alignment
- **Generated** `bun.lock` via `bun install` to align with `.github/workflows/deploy.yml` (`bun install --frozen-lockfile`). CI/CD deployment builds are now deterministic and reliable.

### 2.3 Vendor Chunk & Code Splitting Optimization
- **Configured** `manualChunks` in `vite.config.js` to isolate `vuedraggable` into `vendor-draggable`.
- **Impact:** `RecipeForm.vue` chunk size dropped from **206 KB → 31.6 KB**, significantly speeding up page load time on recipe creation and editing pages.

### 2.4 PHP Dependency & Dead Code Cleanup
- **Moved** `laravel/tinker` from `require` to `require-dev` in `composer.json` to keep production vendor dependencies minimal.
- **Removed** empty Artisan console command `app/Console/Commands/TestImageConversion.php`.
- **Removed** empty leftover directory `resources/js/Components/` (capital C).

---

## 3. Verified Build Metrics

After optimization, `bun run build` output:

| Asset / Chunk | Before | After | Improvement |
|---|---|---|---|
| `public/og-image.png` | 1,200 KB | **0 KB (Deleted)** | **-1.2 MB** |
| `public/og-image.webp` | 252 KB | **252 KB (Active)** | WebP used everywhere |
| `RecipeForm.vue_*.js` | 206 KB | **31.6 KB** | **-85% chunk size** |
| `vendor-draggable-*.js` | — | 178 KB (Cached Vendor) | Separate cacheable vendor chunk |
| `vendor-vue-*.js` | 289 KB | 295 KB (Cached Vendor) | Shared Vue core |
| `vendor-ui-*.js` | 169 KB | 172 KB (Cached Vendor) | Shared UI primitives |
| `app-*.js` | 26 KB | 26.5 KB | Fast bootstrap |

---

## 4. File Inventory Summary

- **Vue Pages (`resources/js/Pages/`):** 37 pages — 100% active and routed in `routes/web.php`.
- **Vue UI Primitives (`components/ui/`):** 70 component files — all imported and tree-shaken by Vite.
- **PHP Models (`app/Models/`):** 14 models — all active and shared between Web and Sanctum API controllers.
- **Controllers:** 22 Web controllers, 15 API controllers — all mapped to active endpoints.
- **Middleware:** 4 middleware (`admin`, `moderator`, `not-banned`, `HandleInertiaRequests`) — all active.

---

## 5. Security & Maintenance Note

- `production.env`: Maintained as requested by user. Ensure this file is never tracked in git if repository visibility changes.
- SVG Optimization (Future): `logo-dark.svg` and `logo-light.svg` (70 KB each) and `favicon.svg` (19 KB) can be passed through `svgo` in the future for minor additional asset size savings.
