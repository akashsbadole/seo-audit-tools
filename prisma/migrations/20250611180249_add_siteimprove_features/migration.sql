-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('CRITICAL', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FULL_AUDIT', 'SEO_SUMMARY', 'ACCESSIBILITY_SUMMARY', 'PERFORMANCE_SUMMARY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'CSV', 'JSON', 'HTML');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SEOToolType" ADD VALUE 'FULL_AUDIT';
ALTER TYPE "SEOToolType" ADD VALUE 'ACCESSIBILITY_AUDIT';
ALTER TYPE "SEOToolType" ADD VALUE 'PERFORMANCE_AUDIT';
ALTER TYPE "SEOToolType" ADD VALUE 'COMPETITOR_ANALYSIS';

-- CreateTable
CREATE TABLE "SiteAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "AuditStatus" NOT NULL DEFAULT 'PENDING',
    "digitalCertaintyIndex" INTEGER DEFAULT 0,
    "seoScore" INTEGER DEFAULT 0,
    "accessibilityScore" INTEGER DEFAULT 0,
    "performanceScore" INTEGER DEFAULT 0,
    "qualityScore" INTEGER DEFAULT 0,
    "totalPages" INTEGER DEFAULT 0,
    "crawledPages" INTEGER DEFAULT 0,
    "totalIssues" INTEGER DEFAULT 0,
    "criticalIssues" INTEGER DEFAULT 0,
    "warningIssues" INTEGER DEFAULT 0,
    "infoIssues" INTEGER DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditResult" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditIssue" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "severity" "IssueSeverity" NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pageUrl" TEXT,
    "element" TEXT,
    "suggestion" TEXT,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditReport" (
    "id" TEXT NOT NULL,
    "auditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportType" "ReportType" NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "filePath" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "targetUrl" TEXT NOT NULL,
    "currentRank" INTEGER,
    "previousRank" INTEGER,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "country" TEXT NOT NULL DEFAULT 'US',
    "language" TEXT NOT NULL DEFAULT 'en',
    "isTracking" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeywordTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryDomain" TEXT NOT NULL,
    "competitorDomain" TEXT NOT NULL,
    "analysisData" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitorAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SiteAudit_userId_idx" ON "SiteAudit"("userId");

-- CreateIndex
CREATE INDEX "SiteAudit_status_idx" ON "SiteAudit"("status");

-- CreateIndex
CREATE INDEX "SiteAudit_createdAt_idx" ON "SiteAudit"("createdAt");

-- CreateIndex
CREATE INDEX "AuditResult_auditId_idx" ON "AuditResult"("auditId");

-- CreateIndex
CREATE INDEX "AuditResult_category_idx" ON "AuditResult"("category");

-- CreateIndex
CREATE INDEX "AuditIssue_auditId_idx" ON "AuditIssue"("auditId");

-- CreateIndex
CREATE INDEX "AuditIssue_severity_idx" ON "AuditIssue"("severity");

-- CreateIndex
CREATE INDEX "AuditIssue_category_idx" ON "AuditIssue"("category");

-- CreateIndex
CREATE INDEX "AuditReport_auditId_idx" ON "AuditReport"("auditId");

-- CreateIndex
CREATE INDEX "AuditReport_reportType_idx" ON "AuditReport"("reportType");

-- CreateIndex
CREATE INDEX "KeywordTracking_userId_idx" ON "KeywordTracking"("userId");

-- CreateIndex
CREATE INDEX "KeywordTracking_keyword_idx" ON "KeywordTracking"("keyword");

-- CreateIndex
CREATE INDEX "KeywordTracking_isTracking_idx" ON "KeywordTracking"("isTracking");

-- CreateIndex
CREATE INDEX "CompetitorAnalysis_userId_idx" ON "CompetitorAnalysis"("userId");

-- CreateIndex
CREATE INDEX "CompetitorAnalysis_primaryDomain_idx" ON "CompetitorAnalysis"("primaryDomain");

-- AddForeignKey
ALTER TABLE "SiteAudit" ADD CONSTRAINT "SiteAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditResult" ADD CONSTRAINT "AuditResult_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditIssue" ADD CONSTRAINT "AuditIssue_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordTracking" ADD CONSTRAINT "KeywordTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
