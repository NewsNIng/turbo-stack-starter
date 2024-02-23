# ---
FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend/server/package.json ./backend/server/
COPY database/models/package.json ./database/models/
COPY frontend/web/package.json ./frontend/web/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/


RUN corepack enable pnpm && pnpm i



FROM base AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN  corepack enable pnpm && pnpm install --offline

RUN cd frontend/web && pnpm build



#---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001




# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing

COPY --from=builder --chown=nextjs:nodejs /app/frontend/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/web/.next/static ./frontend/web/.next/static



COPY --from=builder /app/frontend/web/public ./frontend/web/public



USER nextjs

EXPOSE 3001

ENV PORT 3001
# ENV HOSTNAME 0.0.0.0

CMD ["node", "frontend/web/server.js"]