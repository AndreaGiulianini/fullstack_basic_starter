FROM node:26-slim AS base
WORKDIR /home/node
COPY package*.json ./
ENV PATH=/home/node/node_modules/.bin:$PATH
RUN npm install --no-audit --loglevel info && npm cache clean --force
RUN npx next telemetry disable
RUN npx next telemetry status
WORKDIR /home/node/app
COPY ./ ./

FROM base AS base-remote
ARG NEXT_PUBLIC_ENVIRONMENT
# Double quotes on purpose: with single quotes the shell does not expand the
# ARG and the literal string "${NEXT_PUBLIC_ENVIRONMENT}" ends up in .env.
RUN echo "NEXT_PUBLIC_ENVIRONMENT=${NEXT_PUBLIC_ENVIRONMENT}" > /home/node/app/.env
RUN npm run build

FROM base AS image-development
CMD [ "npm", "run", "dev" ]

# `output: 'standalone'` emits a self-contained server plus only the traced
# dependencies, so production runs `node server.js` on a clean image instead of
# carrying the full node_modules tree and the Next CLI.
# The bundle mirrors the tracing root: standalone/app/ next to standalone/node_modules/.
FROM node:26-slim AS image-production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /home/node
COPY --from=base-remote /home/node/app/.next/standalone ./
COPY --from=base-remote /home/node/app/.next/static ./app/.next/static
COPY --from=base-remote /home/node/app/public ./app/public
USER node
EXPOSE 3000
CMD [ "node", "app/server.js" ]
