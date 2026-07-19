# ---------- stage: install & build ----------
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.7.0 --activate

WORKDIR /app

# Install deps first (layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source & build
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm build

# ---------- stage: production ----------
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
