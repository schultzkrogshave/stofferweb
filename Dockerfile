# Create webserver with health started
# https://hub.docker.com/_/php/

FROM php:7.0-apache
COPY health/ /var/www/html/

EXPOSE 80
