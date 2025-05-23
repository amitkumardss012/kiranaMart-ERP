FROM node:20-alpine AS builder

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /build

# Copy dependency-related files
COPY package.json pnpm-lock.yaml ./

# 🔧 COPY Prisma schema early for postinstall to work
COPY prisma ./prisma

# Install dependencies (runs prisma generate via postinstall)
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
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
