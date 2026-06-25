# =============================================================================
# Laravel 13 API on FrankenPHP (PHP 8.5)
# =============================================================================
FROM dunglas/frankenphp:1-php8.5

# PHP extensions (predis is pure-PHP, so no redis ext needed)
RUN install-php-extensions pdo_pgsql intl zip opcache pcntl

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP dependencies first (better layer caching)
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-scripts --prefer-dist --no-progress

# Application source
COPY . .

# Serve config + runtime env scaffold
COPY Caddyfile /etc/frankenphp/Caddyfile
RUN cp .env.example .env \
    && composer dump-autoload --optimize \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

ENV SERVER_NAME=:5000
EXPOSE 5000

# Default FrankenPHP entrypoint runs `frankenphp run --config /etc/frankenphp/Caddyfile`
