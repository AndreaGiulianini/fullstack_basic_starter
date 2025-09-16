FROM node:24-slim AS base
WORKDIR /home/node/frontend

# Install system dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Set environment variables
ENV PATH=/home/node/frontend/node_modules/.bin:$PATH
ENV NODE_ENV=production

# Install dependencies with proper handling of native modules
RUN npm install --no-audit --loglevel info || \
    (echo "Standard install failed, trying with legacy peer deps..." && \
     npm install --legacy-peer-deps --no-audit --loglevel info) || \
    (echo "Legacy install failed, trying with force..." && \
     npm install --force --no-audit --loglevel info)

# Clean npm cache
RUN npm cache clean --force

# Disable Nuxt telemetry
RUN npx nuxt telemetry disable

# Handle oxc-parser native binding issues
RUN if [ -f "node_modules/oxc-parser/bindings.js" ]; then \
      echo "Checking oxc-parser bindings..." && \
      node -e "try { require('./node_modules/oxc-parser/bindings.js'); console.log('oxc-parser bindings OK'); } catch(e) { console.log('oxc-parser bindings failed, continuing...'); }" || true; \
    fi

# Copy application files
COPY ./ ./

FROM base AS base-remote
ARG NUXT_PUBLIC_ENVIRONMENT
RUN echo 'NUXT_PUBLIC_ENVIRONMENT=${NUXT_PUBLIC_ENVIRONMENT}' > /home/node/frontend/.env
RUN npm run build

FROM base AS image-development
CMD [ "npm", "run", "dev" ]

FROM base-remote AS image-production
CMD [ "npm", "run", "preview" ]
