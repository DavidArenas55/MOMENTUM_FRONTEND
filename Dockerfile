FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist/momentum-frontend/browser /usr/share/nginx/html
COPY docker-entrypoint.sh ./
RUN chmod u+x ./docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]
