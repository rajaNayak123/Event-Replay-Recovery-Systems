FROM node:20-alpine AS base

WORKDIR /app

# Copy root lockfiles and all package.json files to optimize layer caching
COPY package.json package-lock.json ./
COPY services/api/package.json ./services/api/package.json
COPY services/consumer-worker/package.json ./services/consumer-worker/package.json
COPY services/replay-worker/package.json ./services/replay-worker/package.json
COPY packages/shared/package.json ./packages/shared/package.json

# Install dependencies
RUN npm ci

# Copy source code
COPY tsconfig.json ./
COPY prisma ./prisma
COPY packages ./packages
COPY services ./services

# Generate Prisma client and build shared/api packages
RUN npx prisma generate
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=services/api

EXPOSE 8000

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node services/api/dist/server.js"]