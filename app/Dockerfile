FROM node:19

WORKDIR /app
COPY . .
RUN npm ci
ENV WATCHPACK_POLLING=true 

CMD [ "npm", "run", "dev" ]