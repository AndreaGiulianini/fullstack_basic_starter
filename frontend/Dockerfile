# Base stage with common dependencies
FROM node:24-slim AS base
WORKDIR /home/node/frontend

# Install system dependencies for native modules in a single layer
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set environment variables
ENV NODE_ENV=production
ENV PATH=/home/node/frontend/node_modules/.bin:$PATH

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies with proper error handling
RUN npm ci --only=production --no-audit --loglevel=warn || \
    (echo "Production install failed, trying with legacy peer deps..." && \
     npm ci --only=production --legacy-peer-deps --no-audit --loglevel=warn) || \
    (echo "Legacy install failed, trying with force..." && \
     npm ci --only=production --force --no-audit --loglevel=warn)

# Clean npm cache and disable telemetry
RUN npm cache clean --force && \
    npx nuxt telemetry disable

# =============================================================================
# Development stage
# =============================================================================
FROM base AS image-development

# Install all dependencies (including devDependencies) for development
RUN npm ci --no-audit --loglevel=warn || \
    (echo "Dev install failed, trying with legacy peer deps..." && \
     npm ci --legacy-peer-deps --no-audit --loglevel=warn) || \
    (echo "Legacy dev install failed, trying with force..." && \
     npm ci --force --no-audit --loglevel=warn)

# Copy application files
COPY . .

# Expose port for development
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]

# =============================================================================
# Production build stage
# =============================================================================
FROM base AS build-stage

# Install all dependencies for building
RUN npm ci --no-audit --loglevel=warn || \
    (echo "Build install failed, trying with legacy peer deps..." && \
     npm ci --legacy-peer-deps --no-audit --loglevel=warn) || \
    (echo "Legacy build install failed, trying with force..." && \
     npm ci --force --no-audit --loglevel=warn)

# Copy application files
COPY . .

# Build argument for environment
ARG NUXT_PUBLIC_ENVIRONMENT=production
ENV NUXT_PUBLIC_ENVIRONMENT=${NUXT_PUBLIC_ENVIRONMENT}

# Build the application
RUN npm run build

# =============================================================================
# Production stage
# =============================================================================
FROM node:24-slim AS image-production
WORKDIR /home/node/frontend

# Create non-root user for security
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --no-audit --loglevel=warn && \
    npm cache clean --force

# Copy built application from build stage
COPY --from=build-stage /home/node/frontend/.output /home/node/frontend/.output
COPY --from=build-stage /home/node/frontend/package*.json /home/node/frontend/

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /home/node/frontend
USER nodejs

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "run", "preview"]
