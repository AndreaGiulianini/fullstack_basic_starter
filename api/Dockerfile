FROM node:26-slim

WORKDIR /home/node/api

COPY package*.json ./

RUN npm install && \
    npm rebuild esbuild && \
    npm cache clean --force

COPY ./ ./

CMD [ "npm", "run", "dev"]
