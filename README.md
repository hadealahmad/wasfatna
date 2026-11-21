# Wasfatna 🍲

Wasfatna is a modern Syrian recipe platform built with Laravel 12, Vue 3, and Inertia.js. Users can browse, create, and moderate recipes by region (Syrian cities), organize custom lists, plan meals, and more — featuring AI-powered recipe processing, a Sanctum REST API for mobile clients, and a beautiful RTL-first responsive UI.

## Features

-   📖 **Recipe Management**: Create, edit, and organize recipes with structured ingredients, steps, tags, difficulty levels, and revision history.
-   🏙️ **City Explorer**: Discover recipes grouped by Syrian cities (Damascus, Aleppo, Homs, …).
-   📋 **Custom Lists**: Public/private recipe collections with moderator-approved publishing.
-   🗓️ **Meal Planning**: Weekly calendar planner with presets (e.g. Ramadan), random fill, and shareable public links.
-   🎡 **Recipe Randomizer**: Pick recipes based on ingredients you have on hand.
-   🛡️ **Moderation Dashboard**: Recipe/list approval workflows, reports handling, user & role management, bulk import.
-   🤖 **AI Integration**: Automatically process and format recipes using AI.
-   📱 **REST API**: Sanctum-token API under `/api` for mobile/external clients; LLM-friendly `/llms.txt` and markdown recipe endpoints.
-   🌗 **Modern UI**: Vue 3 + Radix Vue + Lucide icons, dark mode, SSR-enabled Inertia SPA.

## Tech Stack

-   **Backend**: [Laravel 12](https://laravel.com) (PHP 8.2+), [Laravel Sanctum](https://laravel.com/docs/sanctum), [Socialite](https://github.com/laravel/socialite) (Google OAuth)
-   **Frontend**: [Vue 3](https://vuejs.org) + TypeScript with [Inertia.js](https://inertiajs.com) (SSR)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
-   **Build**: [Vite 7](https://vite.dev) — [Bun](https://bun.sh) in CI (npm also works), [Composer](https://getcomposer.org)
-   **Icons / UI**: [Lucide Vue Next](https://lucide.dev), Radix Vue (shadcn-style primitives)
-   **Image Processing**: [Intervention Image](https://image.intervention.io)
-   **Testing**: PHPUnit 11

> 📚 **Full documentation lives in [`docs/`](docs/README.md)** — architecture map, database schema, feature lists, API reference, design guidelines, dev & deployment guides.

---

## Local Development Setup

To get Wasfatna running locally on your machine, follow these steps:

### Prerequisites

-   **PHP 8.2+**
-   **Composer**
-   **Bun** (recommended) or Node.js
-   **SQLite** (default) or MySQL/PostgreSQL

### Setup Steps

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/hadealahmad/wasfatna.git
    cd wasfatna
    ```

2.  **Run the automated setup command**:
    The project includes a custom setup script that handles dependencies, environment setup, and migrations.
    ```bash
    composer run setup
    ```

    *Alternatively, you can run the steps manually:*
    ```bash
    composer install
    cp .env.example .env
    php artisan key:generate
    php artisan migrate --force
    bun install
    bun run build
    ```

3.  **Configure Environment**:
    Edit the `.env` file to configure your database and third-party services (like Google OAuth if needed).

4.  **Start the Development Servers**:
    The project uses a custom command to run the backend server, Vite dev server, and queue worker concurrently:
    ```bash
    composer run dev
    ```
    This will start:
    -   Laravel Development Server (`php artisan serve`)
    -   Vite HMR Server (`npm run dev`)
    -   Queue Listener (`php artisan queue:listen`)
    -   Log Tailer (`php artisan pail`)

---

## Deployment

Production runs the Docker image built from the repository `Dockerfile`
(PHP 8.4 fpm + nginx, queue worker and scheduler under S6). Every push to `main`
is built and deployed automatically, and the container runs migrations on boot —
so run the checks below before merging.

- Image, environment variables, persistent storage and the production checklist:
  [docs/guides/deployment-and-updates.md](docs/guides/deployment-and-updates.md)
- Run the production image locally: same guide, section 2.

---

## Testing

```bash
composer test
```

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

Wasfatna is open-sourced software licensed under the [MIT license](LICENSE).
