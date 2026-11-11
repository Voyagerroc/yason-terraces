FROM nginx:1.27-alpine

LABEL maintainer="Voyagerroc <https://github.com/Voyagerroc>"
LABEL description="YASON TERRACES — Architectural Showcase & Digital Experience"

# Default fallback port for local docker and CI; overridden at runtime by Railway/PaaS
ENV PORT=80

# Railway and PaaS dynamic port support via default template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY index.html /usr/share/nginx/html/index.html

# Ensure secure file permissions
RUN chmod 644 /usr/share/nginx/html/index.html && \
    chmod 644 /etc/nginx/templates/default.conf.template

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:${PORT:-80}/ || exit 1

EXPOSE 80
