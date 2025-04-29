FROM node:23-slim AS base
WORKDIR /home/node
COPY package*.json ./
ENV PATH=/home/node/node_modules/.bin:$PATH
RUN npm install --force --no-optional --no-audit --loglevel info && npm cache clean --force
RUN npx next telemetry disable
RUN npx next telemetry status
WORKDIR /home/node/app
COPY ./ ./

FROM base AS base-remote
ARG NEXT_PUBLIC_ENVIRONMENT
RUN echo 'NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}' > /home/node/app/.env
RUN npm run build

FROM base AS image-development
CMD [ "npm", "run", "dev" ]

FROM base-remote AS image-production
CMD [ "npm", "run", "start" ]
