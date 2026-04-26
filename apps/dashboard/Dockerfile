FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY services/api/package.json ./services/api/package.json
COPY services/consumer-worker/package.json ./services/consumer-worker/package.json
COPY services/replay-worker/package.json ./services/replay-worker/package.json
COPY services/dlq-monitor/package.json ./services/dlq-monitor/package.json
COPY services/scheduled-replay-worker/package.json ./services/scheduled-replay-worker/package.json
COPY apps/dashboard/package.json ./apps/dashboard/package.json


RUN npm ci --workspace=apps/dashboard

COPY prisma ./prisma
COPY packages ./packages
COPY apps/dashboard ./apps/dashboard

RUN npx prisma generate


RUN mkdir -p ./apps/dashboard/node_modules/@prisma/client && \
    cp -r generated/prisma/* ./apps/dashboard/node_modules/@prisma/client/


WORKDIR /app/apps/dashboard
RUN npm run build


ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]