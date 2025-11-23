-- CreateTable
CREATE TABLE "AuditAttempt" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "userId" TEXT,
    "attemptDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuditAttempt_url_attemptDate_idx" ON "AuditAttempt"("url", "attemptDate");

-- CreateIndex
CREATE INDEX "AuditAttempt_userId_attemptDate_idx" ON "AuditAttempt"("userId", "attemptDate");

-- CreateIndex
CREATE INDEX "AuditAttempt_ipHash_attemptDate_idx" ON "AuditAttempt"("ipHash", "attemptDate");