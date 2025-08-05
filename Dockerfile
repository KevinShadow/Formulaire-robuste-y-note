FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    unzip \
    zip \
    git \
    curl \
    libpq-dev \
    gnupg \
    && docker-php-ext-install intl pdo pdo_pgsql zip

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Autoriser l'exécution des plugins Composer (comme symfony/flex)
ENV COMPOSER_ALLOW_SUPERUSER=1

# Installer Caddy sans apt-key (méthode moderne et sécurisée)
RUN curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" > /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && apt-get install -y caddy

WORKDIR /var/www/html


COPY . .


RUN composer install --no-dev --optimize-autoloader


RUN chown -R www-data:www-data var vendor


COPY Caddyfile /etc/caddy/Caddyfile


EXPOSE 80


CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
