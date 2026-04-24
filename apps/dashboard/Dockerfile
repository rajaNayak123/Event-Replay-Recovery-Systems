FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/dashboard/package.json ./apps/dashboard/package.json
COPY packages/shared/package.json ./packages/shared/package.json

RUN npm ci --workspace=apps/dashboard

COPY prisma ./prisma
COPY apps/dashboard ./apps/dashboard

RUN npx prisma generate

# Copy generated prisma client into the dashboard's node_modules
RUN cp -r generated/prisma ./apps/dashboard/node_modules/@prisma/client/

WORKDIR /app/apps/dashboard
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/apps/dashboard/public ./public
COPY --from=builder /app/apps/dashboard/.next ./.next
COPY --from=builder /app/apps/dashboard/node_modules ./node_modules
COPY --from=builder /app/apps/dashboard/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]