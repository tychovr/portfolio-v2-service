ARG NODE_VERSION=21.2.0

FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install --omit=peer

USER node

COPY . .

EXPOSE 8787

CMD npm start