FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable || true
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable || true

COPY package.json yarn.lock ./
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./tsconfig.json
COPY src ./src

RUN yarn build

FROM node:20-alpine
WORKDIR /app

RUN corepack enable || true
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist
EXPOSE 8787
	
CMD ["node","dist/index.js"]
