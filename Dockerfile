FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Prerender stage — needs a glibc base so Playwright's bundled Chromium can launch
# (Alpine/musl is not supported by Playwright's browser binaries).
FROM mcr.microsoft.com/playwright:v1.61.1-noble AS prerender
WORKDIR /app
# node_modules is installed fresh here (not copied from the alpine builder)
# because rollup/esbuild ship libc-specific native binaries — a musl (alpine)
# install won't load on this glibc (Ubuntu) base image.
COPY package.json package-lock.json* ./
RUN npm ci
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/app/data/brands.ts ./src/app/data/brands.ts
COPY --from=builder /app/src/app/data/blogs.ts ./src/app/data/blogs.ts
COPY --from=builder /app/src/lib/leadGate.ts ./src/lib/leadGate.ts
COPY scripts/prerender.mjs ./scripts/prerender.mjs
RUN node scripts/prerender.mjs

FROM nginxinc/nginx-unprivileged:1.27-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=prerender /app/dist/_prerendered /usr/share/nginx/html/_prerendered
COPY --from=prerender /app/dist/sitemap.xml /usr/share/nginx/html/sitemap.xml
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
