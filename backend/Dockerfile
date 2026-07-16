# ---------- stage: install & build ----------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

WORKDIR /app

# Install deps first (layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source & build
COPY . .
RUN npx prisma generate
RUN pnpm build

# ---------- stage: production ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/public ./public

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]
