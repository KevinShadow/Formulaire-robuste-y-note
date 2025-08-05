
FROM php:8.2-fpm


RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install intl pdo pdo_pgsql zip


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Installer Caddy (serveur HTTP)
RUN apt-get install -y debian-keyring debian-archive-keyring apt-transport-https && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | apt-key add - && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && apt-get install -y caddy


WORKDIR /var/www/html

# Copier tout le projet
COPY . .


RUN composer install --no-dev --optimize-autoloader


RUN chown -R www-data:www-data var vendor


COPY Caddyfile /etc/caddy/Caddyfile


EXPOSE 80


CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
