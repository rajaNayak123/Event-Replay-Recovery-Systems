FROM node:20-alpine AS builder
WORKDIR /app

# Copy root workspace files if applicable, or local files
COPY package.json package-lock.json ./
COPY apps/dashboard/package.json ./apps/dashboard/package.json

RUN npm ci

COPY apps/dashboard ./apps/dashboard
COPY tsconfig.json ./ 

# Build the Next.js app
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