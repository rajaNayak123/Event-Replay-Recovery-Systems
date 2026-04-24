FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/dashboard/package.json ./apps/dashboard/package.json
COPY packages/shared/package.json ./packages/shared/package.json

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