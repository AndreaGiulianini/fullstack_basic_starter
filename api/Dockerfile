FROM node:22

WORKDIR /home/node
COPY package.json ./
RUN npm install --no-optional && npm cache clean --force
ENV PATH /home/node/node_modules/.bin:$PATH
WORKDIR /home/node/api
COPY ./ ./

CMD [ "npm", "run", "dev"]