# build stage
FROM node:22.15.1-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base as prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --prod

FROM base as build
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base
COPY --from=prod-deps /app/node_modules node_modules/
COPY --from=build /app/build build/
COPY package.json .
ENV NODE_ENV=production

VOLUME [ "/app/db" ]

EXPOSE 3000
CMD node build