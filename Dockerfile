# ---------- Stage 1: Build ----------
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev --no-audit --no-fund --no-progress

COPY . .
RUN npm run build

# ---------- Stage 2: Runtime ----------
FROM nginx:1.27-alpine AS runtime

RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Overwrite main config (untuk pid & log path)
COPY nginx-main.conf /etc/nginx/nginx.conf

# Server block
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root user
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /usr/share/nginx/html \
    && chown -R app:app /var/cache/nginx \
    && chown -R app:app /var/log/nginx \
    && chown -R app:app /etc/nginx/conf.d

USER app

EXPOSE 8020

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8020/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
