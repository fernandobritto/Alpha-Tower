FROM node:18-alpine AS development

RUN apk add --no-cache \
    curl \
    wget \
    bash \
    postgresql-client

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN mkdir -p uploads logs

RUN chown -R node:node /app
USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

CMD ["yarn", "localhost"]

FROM node:18-alpine AS production

RUN apk add --no-cache curl wget bash postgresql-client

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

RUN rm -rf node_modules && yarn install --frozen-lockfile --production

RUN yarn add typescript ts-node tsconfig-paths && yarn cache clean

RUN mkdir -p uploads logs
RUN addgroup -g 1001 -S nodejs && \
    adduser -S node -u 1001

RUN chown -R node:nodejs /app
USER node

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3333/health || exit 1

CMD ["yarn", "start"]
