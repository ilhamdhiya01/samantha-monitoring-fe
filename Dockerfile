# syntax=docker/dockerfile:1

# ---- Stage 1: build (vite build → dist/) ----
FROM node:24.14.0-alpine AS builder
ENV HUSKY=0
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@12.8.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
# Nilai VITE_* di-inline saat build. Produksi selalu pakai backend asli,
# satu origin dengan Nginx di bawah (API_BASE_URL kosong → /api/v1/...).
ENV VITE_USE_MOCK=false
ENV VITE_API_URL=
RUN pnpm build

# ---- Stage 2: Nginx statis + proxy /api/v1 ke monitor-api ----
FROM nginx:1.27-alpine AS runner
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
