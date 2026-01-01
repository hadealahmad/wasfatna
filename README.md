# Wasfatna 🍲

Wasfatna is a modern recipe management platform built with Laravel, Vue 3, and Inertia.js. It allows users to browse, create, and manage recipes with ease, featuring AI-powered recipe processing and a beautiful, responsive UI.

## Features

-   📖 **Recipe Management**: Create, edit, and organize your favorite recipes.
-   🤖 **AI Integration**: Automatically process and format recipes using AI.
-   📱 **Responsive Design**: Optimized for all devices using Tailwind CSS.
-   🌗 **Modern UI**: Built with Vue 3, Radix Vue, and Lucide icons for a premium experience.
-   ⚡ **High Performance**: Powered by Bun and Vite for lightning-fast frontend builds.

## Tech Stack

-   **Backend**: [Laravel 12+](https://laravel.com)
-   **Frontend**: [Vue 3](https://vuejs.org) with [Inertia.js](https://inertiajs.com)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
-   **Package Manager**: [Bun](https://bun.sh) and [Composer](https://getcomposer.org)
-   **Icons**: [Lucide Vue Next](https://lucide.dev)
-   **Image Processing**: [Intervention Image](https://image.intervention.io)

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

## Dev Deployment

For deploying to a development or staging server, Wasfatna uses GitHub Actions for automation.

### Automated Deployment (GitHub Actions)

The project is configured with a self-hosted runner workflow. To deploy:

1.  Push your changes to the `main` branch.
2.  The `Deploy Application` workflow in `.github/workflows/deploy.yml` will trigger automatically.
3.  It performs the following:
    -   Sets up PHP and Node environments.
    -   Installs dependencies.
    -   Builds frontend assets.
    -   Deploys files to the target directory on the server.
    -   Runs migrations and clears caches.

### Manual Dev Deployment

If you need to deploy manually to a dev server:

1.  **Pull the latest changes**:
    ```bash
    git pull origin main
    ```

2.  **Update dependencies**:
    ```bash
    composer install --no-dev --optimize-autoloader
    bun install --frozen-lockfile
    ```

3.  **Build assets**:
    ```bash
    bun run build
    ```

4.  **Finalize deployment**:
    ```bash
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan storage:link --force
    ```

---

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

Wasfatna is open-sourced software licensed under the [MIT license](LICENSE).
