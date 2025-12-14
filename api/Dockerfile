FROM node:25-slim

WORKDIR /home/node/api

COPY package*.json ./

RUN npm install --legacy-peer-deps && \
    npm rebuild esbuild && \
    npm cache clean --force

COPY ./ ./

CMD [ "npm", "run", "dev"]
