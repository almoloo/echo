# Install dependencies only when needed
FROM node:22-slim AS deps
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM node:22-slim AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Production image, copy all the files you need
FROM node:22-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# If you're using Next.js >= 13 and App Router:
# Uncomment if you’re using next/image with remote images
# RUN apk add --no-cache sharp

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]