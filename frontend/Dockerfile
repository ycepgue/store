# ---------- stage: install & build ----------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

WORKDIR /app

# Install deps first (layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source & build
COPY . .

ARG NUXT_PUBLIC_API_BASE_URL
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL

RUN pnpm build

# ---------- stage: production ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL
ENV PORT=80
ENV HOST=0.0.0.0

COPY --from=builder /app/.output /app/.output

EXPOSE 80

CMD ["node", ".output/server/index.mjs"]
