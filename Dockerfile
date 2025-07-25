FROM node:lts-alpine as deps-installer

RUN npm install -g pnpm

WORKDIR /tmp/deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM oven/bun:alpine as build-runner

WORKDIR /tmp/app

COPY package.json pnpm-lock.yaml ./

RUN bun install --frozen-lockfile

COPY src ./src
COPY tsconfig.json .

RUN bun run build

## production runner
FROM node:lts-alpine as prod-runner

RUN apk add --no-cache dumb-init && \
    npm install -g pnpm

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

COPY --from=build-runner /tmp/app/package.json ./
COPY --from=build-runner /tmp/app/pnpm-lock.yaml ./

COPY --from=deps-installer /tmp/deps/node_modules ./node_modules

COPY --from=build-runner /tmp/app/build ./build

RUN chown -R nextjs:nodejs /app
USER nextjs

ENTRYPOINT ["dumb-init", "--"]
CMD ["pnpm", "start"]

