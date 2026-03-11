#!/bin/sh

echo "Initializing Nginx configuration..."

if [ "$ENABLE_HTTPS" = "true" ]; then
    echo "HTTPS Enabled. Using SSL config."
    cp /etc/nginx/custom-templates/https.conf.template /etc/nginx/conf.d/default.conf
else
    echo "HTTPS Disabled. Using HTTP config."
    cp /etc/nginx/custom-templates/http.conf.template /etc/nginx/conf.d/default.conf
fi

# Substitute environment variables
# Only replace ${DOMAIN} to preserve Nginx variables like $host
envsubst '${DOMAIN}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf

echo "Nginx configuration generated."
