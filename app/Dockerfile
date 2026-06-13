FROM node:26-slim AS base
WORKDIR /home/node/app
ENV PATH=/home/node/app/node_modules/.bin:$PATH
COPY package*.json ./
RUN npm install --no-audit --loglevel info && npm cache clean --force
COPY ./ ./

FROM base AS base-remote
ARG VITE_PUBLIC_ENVIRONMENT
RUN echo 'VITE_PUBLIC_ENVIRONMENT=${VITE_PUBLIC_ENVIRONMENT}' > /home/node/app/.env
RUN npm run build

FROM base AS image-development
CMD [ "npm", "run", "dev" ]

FROM base-remote AS image-production
CMD [ "node", ".output/server/index.mjs" ]
