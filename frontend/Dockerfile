# Base stage with common dependencies
FROM node:26-slim AS base
WORKDIR /home/node/frontend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy package files
COPY package*.json ./

# Install production dependencies (skip scripts since nuxt is in devDependencies)
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# =============================================================================
# Development stage
# =============================================================================
FROM base AS image-development

# Install all dependencies for development
RUN npm ci

# Copy application files
COPY . .

# Run nuxt prepare
RUN npx nuxt prepare

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# =============================================================================
# Production build stage
# =============================================================================
FROM base AS build-stage

# Install all dependencies for building
RUN npm ci

# Copy application files
COPY . .

# Build argument for environment
ARG NUXT_PUBLIC_ENVIRONMENT=production
ENV NUXT_PUBLIC_ENVIRONMENT=${NUXT_PUBLIC_ENVIRONMENT}

# Run nuxt prepare and build
RUN npx nuxt prepare && npm run build

# =============================================================================
# Production stage
# =============================================================================
FROM node:26-slim AS image-production
WORKDIR /home/node/frontend

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=build-stage --chown=node:node /home/node/frontend/.output ./.output

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
