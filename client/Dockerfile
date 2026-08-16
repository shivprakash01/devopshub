# ==============================================================================
# DevOpsHub Client - Production Multi-Stage Dockerfile
# Maintainer: shivayadav70
# ==============================================================================

# Stage 1: Build React SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy source files and configuration
COPY vite.config.js index.html ./
COPY src ./src

# Build static production bundle
RUN npm run build

# Stage 2: Serve with Nginx Alpine
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/nginx-health || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
