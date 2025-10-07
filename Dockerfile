FROM node:20-alpine
WORKDIR /app

RUN corepack enable || true

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile || yarn install --immutable
COPY . .

ENV NODE_ENV=production
EXPOSE 8787

CMD ["yarn, "start"]
