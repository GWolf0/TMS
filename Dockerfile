FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nodejs npm \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing project files (optional here since we mount the volume)
COPY . .
COPY .env.docker .env

RUN node -v && npm -v

# Set permissions (optional)
RUN chown -R www-data:www-data /var/www
