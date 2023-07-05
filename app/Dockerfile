FROM node:20 as base
WORKDIR /home/node
COPY package*.json ./
ENV PATH /home/node/node_modules/.bin:$PATH

FROM base as base-dev
RUN npm install --no-optional --no-audit --loglevel info && npm cache clean --force
RUN npx next telemetry disable
RUN npx next telemetry status
WORKDIR /home/node/app
ENV WATCHPACK_POLLING=true 

FROM base as base-remote
RUN npm install --no-audit && npm cache clean --force
RUN npx next telemetry disable
RUN npx next telemetry status
WORKDIR /home/node/app
COPY ./ ./
ARG NEXT_PUBLIC_ENVIRONMENT
RUN echo 'NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}' > /home/node/app/.env
RUN npm run build

FROM base-dev as image-development
CMD [ "npm", "run", "dev" ]

FROM base-remote as image-staging
CMD [ "npm", "run", "start" ]

FROM base-remote as image-production
CMD [ "npm", "run", "start" ]