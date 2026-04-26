FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
COPY services/api/package.json ./services/api/package.json
COPY services/consumer-worker/package.json ./services/consumer-worker/package.json
COPY services/replay-worker/package.json ./services/replay-worker/package.json
COPY services/dlq-monitor/package.json ./services/dlq-monitor/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci

COPY tsconfig.json ./
COPY prisma ./prisma
COPY packages ./packages
COPY services ./services

RUN npx prisma generate

# Clean up any stale build info and build shared package
RUN rm -f packages/shared/tsconfig.tsbuildinfo && \
    npm run build --workspace=packages/shared

# Replace the symlink with actual files
RUN rm -rf node_modules/shared && \
    mkdir -p node_modules/shared && \
    cp packages/shared/package.json node_modules/shared/package.json && \
    cp -r packages/shared/dist node_modules/shared/dist

RUN npm run build --workspace=services/dlq-monitor

CMD ["node", "services/dlq-monitor/dist/index.js"]
