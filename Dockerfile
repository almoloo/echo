FROM node:23-slim AS base

FROM base AS deps
# RUN apk add --no-cache libc6-compat
RUN apt-get update \
    && apt-get install python3 make gcc g++ git -y

WORKDIR /app

COPY package.json package-lock.json* .npmrc* ./
RUN npm install

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG DB_URI
ARG OPENAI_API_KEY
ARG NEXT_PUBLIC_URL

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# RUN apk add --no-cache sharp
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]