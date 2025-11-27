# =============================================================================
# Angular 21 Dockerfile
# Multi-stage build for development and production
# =============================================================================

# -----------------------------------------------------------------------------
# Base stage - Install dependencies
# -----------------------------------------------------------------------------
FROM node:24-slim AS base

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install since package-lock.json may not exist)
RUN npm install

# Copy source files
COPY . .

# -----------------------------------------------------------------------------
# Development stage
# -----------------------------------------------------------------------------
FROM base AS development

EXPOSE 4200

# Start Angular dev server
CMD ["npm", "start"]

# -----------------------------------------------------------------------------
# Build stage - Build for production
# -----------------------------------------------------------------------------
FROM base AS build

# Build the Angular application
RUN npm run build:prod

# -----------------------------------------------------------------------------
# Production stage - Serve with Node.js static server
# -----------------------------------------------------------------------------
FROM node:24-slim AS production

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy built application from build stage
COPY --from=build /app/dist/fullstack-app/browser ./dist

EXPOSE 80

# Serve static files with SPA fallback
CMD ["serve", "-s", "dist", "-l", "80"]
