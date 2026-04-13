-- CreateEnum
CREATE TYPE "FailedEventStatus" AS ENUM ('FAILED', 'REPLAY_PENDING', 'REPLAYED', 'REPLAY_FAILED');

-- CreateEnum
CREATE TYPE "ReplayLogStatus" AS ENUM ('SUCCESS', 'FAILED', 'REQUESTED', 'SKIPPED_ALREADY_PROCESSED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'CREATED',
    "inventoryStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "streamName" TEXT NOT NULL,
    "orderId" TEXT,
    "originalPayload" JSONB NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "status" "FailedEventStatus" NOT NULL DEFAULT 'FAILED',
    "firstFailedAt" TIMESTAMP(3) NOT NULL,
    "lastFailedAt" TIMESTAMP(3) NOT NULL,
    "replayedAt" TIMESTAMP(3),
    "replayRequestedBy" TEXT,
    "replayMetadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "failed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processed_events" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "orderId" TEXT,
    "sourceStream" TEXT NOT NULL,
    "replayed" BOOLEAN NOT NULL DEFAULT false,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processor" TEXT NOT NULL,
    "checksum" TEXT,
    "metadata" JSONB,

    CONSTRAINT "processed_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replay_logs" (
    "id" TEXT NOT NULL,
    "failedEventId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "status" "ReplayLogStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestPayload" JSONB,
    "resultPayload" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "replay_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_tenantId_idx" ON "orders"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "failed_events_eventId_key" ON "failed_events"("eventId");

-- CreateIndex
CREATE INDEX "failed_events_status_idx" ON "failed_events"("status");

-- CreateIndex
CREATE INDEX "failed_events_tenantId_idx" ON "failed_events"("tenantId");

-- CreateIndex
CREATE INDEX "failed_events_orderId_idx" ON "failed_events"("orderId");

-- CreateIndex
CREATE INDEX "failed_events_eventType_idx" ON "failed_events"("eventType");

-- CreateIndex
CREATE UNIQUE INDEX "processed_events_eventId_key" ON "processed_events"("eventId");

-- CreateIndex
CREATE INDEX "processed_events_tenantId_idx" ON "processed_events"("tenantId");

-- CreateIndex
CREATE INDEX "processed_events_orderId_idx" ON "processed_events"("orderId");

-- CreateIndex
CREATE INDEX "processed_events_eventType_idx" ON "processed_events"("eventType");

-- CreateIndex
CREATE INDEX "replay_logs_failedEventId_idx" ON "replay_logs"("failedEventId");

-- CreateIndex
CREATE INDEX "replay_logs_eventId_idx" ON "replay_logs"("eventId");

-- AddForeignKey
ALTER TABLE "replay_logs" ADD CONSTRAINT "replay_logs_failedEventId_fkey" FOREIGN KEY ("failedEventId") REFERENCES "failed_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
