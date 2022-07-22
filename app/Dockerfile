FROM node:18

WORKDIR /home/node
COPY package.json ./
RUN npm install && npm cache clean --force
ENV PATH /home/node/node_modules/.bin:$PATH
WORKDIR /home/node/app
ENV WATCHPACK_POLLING=true 

CMD [ "npm", "run", "dev" ]