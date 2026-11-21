#!/bin/sh
set -e
# Runs before nginx/php-fpm start. A failed migration must stop the boot so
# Coolify keeps the previous container serving.

# Wait (up to ~60s) for the database: after a host or DB restart the app can
# start first, and a migration against a closed port would fail the boot.
i=0
until php /var/www/html/artisan db:show >/dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -ge 30 ]; then echo "Database not reachable after 60s"; exit 1; fi
  echo "Waiting for database... ($i)"
  sleep 2
done

echo "Running database migrations..."
php /var/www/html/artisan migrate --force

# Uploads live on a persistent volume at storage/app/public; the public/storage
# symlink is not preserved by image layers, so recreate it on every boot.
php /var/www/html/artisan storage:link --force || true

echo "Caching configuration..."
php /var/www/html/artisan optimize:clear
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache
php /var/www/html/artisan event:cache
