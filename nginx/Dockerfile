FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Create custom templates directory
RUN mkdir -p /etc/nginx/custom-templates

# Copy templates
COPY http.conf.template /etc/nginx/custom-templates/
COPY https.conf.template /etc/nginx/custom-templates/

# Copy initialization script
COPY init-config.sh /docker-entrypoint.d/99-init-config.sh
RUN chmod +x /docker-entrypoint.d/99-init-config.sh
