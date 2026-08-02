# Deployment and Update Guide

This document outlines the requirements, deployment process, server configuration, and maintenance routines for deploying **Wasfatna (وصفاتنا)** to staging or production environments.

---

## 1. System Requirements

### Server Environment
- **Operating System**: Linux (Ubuntu 22.04 / 24.04 LTS recommended)
- **PHP**: `^8.2` or higher
  - Required PHP Extensions: `pdo`, `pdo_sqlite` (or `pdo_mysql`), `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`, `gd` or `imagick`, `curl`.
- **Node.js**: `^18.0` or `^20.0` (with `npm` v9+)
- **Database**: SQLite (default / small setups) or MySQL 8.0+ / MariaDB 10.6+ / PostgreSQL 14+.
- **Web Server**: Nginx or Apache with `mod_rewrite`.
- **Composer**: `v2.5+`

---

## 2. Fresh Installation & Initial Deployment

### Step 1: Clone Repository
```bash
git clone https://github.com/your-org/wasfatna.git /var/www/wasfatna
cd /var/www/wasfatna
```

### Step 2: Install PHP & Node Dependencies
```bash
# Install PHP dependencies without development packages
composer install --no-dev --optimize-autoloader

# Install Node dependencies
npm ci
```

### Step 3: Configure Environment Variables
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` to configure production settings:
```ini
APP_NAME=وصفاتنا
APP_ENV=production
APP_DEBUG=false
APP_URL=https://wasfatna.com

DB_CONNECTION=sqlite
# Or for MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=wasfatna
# DB_USERNAME=wasfatna_user
# DB_PASSWORD=your_secure_password

SESSION_DRIVER=database
QUEUE_CONNECTION=database

# Google Auth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://wasfatna.com/auth/google/callback
```

### Step 4: Run Database Migrations & Seeders
```bash
# Run database migrations
php artisan migrate --force

# (Optional) Seed initial Syrian cities and default admin
php artisan db:seed --force
```

### Step 5: Build Frontend Production Assets
```bash
npm run build
```

### Step 6: Create Storage Symlink & Set File Permissions
```bash
# Create public storage symlink
php artisan storage:link

# Set proper ownership and write permissions
chown -R www-data:www-data /var/www/wasfatna
chmod -R 775 /var/www/wasfatna/storage /var/www/wasfatna/bootstrap/cache
```

---

## 3. Nginx Server Configuration

Create an Nginx configuration file (e.g., `/etc/nginx/sites-available/wasfatna`):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name wasfatna.com www.wasfatna.com;
    root /var/www/wasfatna/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/wasfatna /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 4. Application Update Protocol (Standard Deployment Update)

When deploying updates or pull requests to production, run the following automated deployment script:

```bash
#!/bin/bash
set -e

echo "Starting deployment..."

# Enable maintenance mode
php artisan down --refresh=15 --retry=60

# Fetch latest code
git pull origin main

# Update PHP dependencies
composer install --no-dev --optimize-autoloader

# Update Node dependencies & Build Frontend Assets
npm ci
npm run build

# Run database migrations
php artisan migrate --force

# Clear and optimize application caches
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache

# Restart queue workers (if background queues are used)
php artisan queue:restart

# Disable maintenance mode
php artisan up

echo "Deployment completed successfully!"
```

---

## 5. Security & Performance Maintenance Checklist

- [ ] Ensure `APP_DEBUG=false` in production `.env`.
- [ ] Confirm `/dev-login` route is disabled in production (automatically scoped to `local` environment).
- [ ] Ensure `.env` and sensitive production credential files are outside web root and restricted (`chmod 600`).
- [ ] Schedule regular database backups (`database/database.sqlite` or MySQL dumps).
- [ ] Monitor log storage in `storage/logs/laravel.log`.
