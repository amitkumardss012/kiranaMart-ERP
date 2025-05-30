FROM node:20-alpine AS builder


RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /build


COPY package.json pnpm-lock.yaml ./


COPY prisma ./prisma


RUN pnpm install --frozen-lockfile


COPY . .


RUN pnpm run build

# --- Runtime Image ---
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/public ./public
COPY --from=builder /build/package.json .
COPY --from=builder /build/public ./public
COPY --from=builder /build/.env ./.env
COPY --from=builder /build/generated ./generated
COPY --from=builder /build/prisma ./prisma

CMD ["node", "public/index.js"]
