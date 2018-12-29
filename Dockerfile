FROM node


WORKDIR /app

COPY package*.json ./

RUN yarn install

# Bundle app source
COPY . /app

ENV  NODE_ENV production

EXPOSE 3000
CMD [ "node", "server.js"]
