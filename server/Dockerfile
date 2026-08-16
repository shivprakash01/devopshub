# ==============================================================================
# DevOpsHub Server - Production Dockerfile
# Maintainer: shivayadav70
# ==============================================================================

FROM node:20-alpine AS base

# Install curl for container health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package descriptors first to take advantage of Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev

# Copy application source code
COPY src ./src

# Expose backend API port
EXPOSE 5000

# Set production environment defaults
ENV NODE_ENV=production \
    PORT=5000

# Container healthcheck querying the health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start the Node.js API server
CMD ["node", "src/server.js"]
