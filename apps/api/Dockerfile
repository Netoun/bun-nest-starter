FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root workspace files first
COPY package.json bun.lockb tsconfig.json ./

COPY packages/db ./packages/db
COPY packages/contract ./packages/contract

COPY apps/api/package.json ./apps/api/

RUN bun install --frozen-lockfile
RUN bun run build:packages

# Copy the rest of the api application
COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN bun run build

FROM oven/bun:1-slim

WORKDIR /app

# Copy workspace structure for dependencies
COPY package.json bun.lockb ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/

# Copy built files
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN bun install --frozen-lockfile --production

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

WORKDIR /app/apps/api
CMD ["bun", "run", "start"] 