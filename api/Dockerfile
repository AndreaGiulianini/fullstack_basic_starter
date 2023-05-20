FROM node:20

WORKDIR /home/node
COPY package.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /home/node/node_modules/.bin:$PATH
WORKDIR /home/node/api

CMD [ "npm", "run", "start"]