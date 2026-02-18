-- CreateEnum
CREATE TYPE "ApiProvider" AS ENUM ('PAGESPEED_INSIGHTS', 'GOOGLE_KEYWORDS', 'AHREFS', 'SEMRUSH', 'MOZ');

-- CreateEnum
CREATE TYPE "ApiRequestStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RATE_LIMITED', 'QUOTA_EXCEEDED');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CompetitionLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CoreWebVitalStatus" AS ENUM ('GOOD', 'NEEDS_IMPROVEMENT', 'POOR');

-- CreateEnum
CREATE TYPE "CrawlStatus" AS ENUM ('PENDING', 'QUEUED', 'RUNNING', 'PAUSED', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('SITE_EXPLORER', 'KEYWORDS_EXPLORER', 'RANK_TRACKER', 'SITE_AUDIT', 'WEB_ANALYTICS', 'CONTENT_EXPLORER', 'AI_CONTENT_HELPER', 'DASHBOARD', 'PORTFOLIOS', 'SITEMAP_CHECKING', 'AMAZON_KEYWORD_SEARCH');

-- CreateEnum
CREATE TYPE "IssueSeverity" AS ENUM ('CRITICAL', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('PDF', 'CSV', 'JSON', 'HTML');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FULL_AUDIT', 'SEO_SUMMARY', 'ACCESSIBILITY_SUMMARY', 'PERFORMANCE_SUMMARY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SEOToolType" AS ENUM ('META_TAGS', 'KEYWORD_DENSITY', 'HEADER_TAGS', 'INTERNAL_LINKS', 'ALT_TEXT', 'BROKEN_LINKS', 'ROBOTS_TXT', 'SITEMAP', 'SEO_SCORE', 'READABILITY', 'TITLE_PREVIEW', 'DESCRIPTION_PREVIEW', 'STRUCTURED_DATA', 'CANONICAL_URL', 'MOBILE_FRIENDLY', 'FULL_AUDIT', 'ACCESSIBILITY_AUDIT', 'PERFORMANCE_AUDIT', 'COMPETITOR_ANALYSIS');

-- CreateEnum
CREATE TYPE "SearchIntent" AS ENUM ('INFORMATIONAL', 'COMMERCIAL', 'TRANSACTIONAL', 'NAVIGATIONAL');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FREELANCER', 'CLIENT');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiCost" (
    "id" TEXT NOT NULL,
    "provider" "ApiProvider" NOT NULL,
    "userId" TEXT,
    "dailyLimit" DECIMAL(10,4) NOT NULL,
    "dailySpent" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "monthlyLimit" DECIMAL(10,4) NOT NULL,
    "monthlySpent" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "perRequestCost" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "dailyResetTime" TIMESTAMP(3),
    "monthlyResetTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiQuota" (
    "id" TEXT NOT NULL,
    "provider" "ApiProvider" NOT NULL,
    "userId" TEXT,
    "dailyLimit" INTEGER NOT NULL,
    "dailyUsed" INTEGER NOT NULL DEFAULT 0,
    "monthlyLimit" INTEGER NOT NULL,
    "monthlyUsed" INTEGER NOT NULL DEFAULT 0,
    "perSecondLimit" INTEGER NOT NULL,
    "perSecondUsed" INTEGER NOT NULL DEFAULT 0,
    "dailyResetTime" TIMESTAMP(3),
    "monthlyResetTime" TIMESTAMP(3),
    "perSecondResetTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiQuota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsage" (
    "id" TEXT NOT NULL,
    "provider" "ApiProvider" NOT NULL,
    "userId" TEXT,
    "requestType" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 1,
    "cost" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "status" "ApiRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestId" TEXT,
    "requestData" JSONB,
    "responseData" JSONB,
    "errorMessage" TEXT,
    "responseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiUsage_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "BacklinkData" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "backlinks" INTEGER NOT NULL DEFAULT 0,
    "referringDomains" INTEGER NOT NULL DEFAULT 0,
    "domainAuthority" INTEGER NOT NULL DEFAULT 0,
    "pageAuthority" INTEGER NOT NULL DEFAULT 0,
    "spamScore" INTEGER NOT NULL DEFAULT 0,
    "anchorTexts" JSONB,
    "newBacklinks" INTEGER NOT NULL DEFAULT 0,
    "lostBacklinks" INTEGER NOT NULL DEFAULT 0,
    "provider" "ApiProvider" NOT NULL,
    "apiUsageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BacklinkData_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "CompetitorData" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "traffic" INTEGER NOT NULL DEFAULT 0,
    "keywords" INTEGER NOT NULL DEFAULT 0,
    "backlinks" INTEGER NOT NULL DEFAULT 0,
    "domainAuthority" INTEGER NOT NULL DEFAULT 0,
    "rankDistribution" JSONB,
    "topKeywords" JSONB,
    "contentGaps" JSONB,
    "provider" "ApiProvider" NOT NULL,
    "apiUsageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompetitorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startUrl" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "status" "CrawlStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "pausedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "totalPages" INTEGER NOT NULL DEFAULT 0,
    "crawledPages" INTEGER NOT NULL DEFAULT 0,
    "failedPages" INTEGER NOT NULL DEFAULT 0,
    "skippedPages" INTEGER NOT NULL DEFAULT 0,
    "queuedPages" INTEGER NOT NULL DEFAULT 0,
    "averageResponseTime" DOUBLE PRECISION,
    "totalDataSize" BIGINT NOT NULL DEFAULT 0,
    "errorsCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "lastErrorAt" TIMESTAMP(3),

    CONSTRAINT "CrawlJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrawlResult" (
    "id" TEXT NOT NULL,
    "crawlJobId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "parentUrl" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "status" "CrawlStatus" NOT NULL DEFAULT 'PENDING',
    "statusCode" INTEGER,
    "contentType" TEXT,
    "responseTime" DOUBLE PRECISION,
    "contentLength" BIGINT NOT NULL DEFAULT 0,
    "finalUrl" TEXT,
    "discoveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "queuedAt" TIMESTAMP(3),
    "startedCrawlingAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "title" TEXT,
    "description" TEXT,
    "headings" JSONB,
    "textContent" TEXT,
    "htmlContent" TEXT,
    "links" JSONB,
    "images" JSONB,
    "forms" JSONB,
    "structuredData" JSONB,
    "metaTags" JSONB,
    "openGraph" JSONB,
    "twitterCard" JSONB,
    "performanceMetrics" JSONB,
    "screenshot" TEXT,
    "error" TEXT,
    "errorType" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CrawlResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "domainName" TEXT NOT NULL,
    "ipAddress" TEXT,
    "pdfData" BYTEA,
    "pdfPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordData" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "searchVolume" INTEGER NOT NULL DEFAULT 0,
    "competition" "CompetitionLevel" NOT NULL DEFAULT 'MEDIUM',
    "cpc" DECIMAL(10,4) NOT NULL DEFAULT 0.0000,
    "competitionIndex" INTEGER NOT NULL DEFAULT 0,
    "trend" JSONB,
    "intent" "SearchIntent" NOT NULL DEFAULT 'INFORMATIONAL',
    "relatedKeywords" JSONB,
    "suggestions" JSONB,
    "provider" "ApiProvider" NOT NULL,
    "apiUsageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeywordData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeywordSearch" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "searchType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "results" JSONB NOT NULL,
    "userId" TEXT,

    CONSTRAINT "KeywordSearch_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "PageSpeedResults" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "performanceScore" INTEGER NOT NULL,
    "accessibilityScore" INTEGER NOT NULL,
    "bestPracticesScore" INTEGER NOT NULL,
    "seoScore" INTEGER NOT NULL,
    "fcp" DECIMAL(10,2),
    "fcpStatus" "CoreWebVitalStatus",
    "lcp" DECIMAL(10,2),
    "lcpStatus" "CoreWebVitalStatus",
    "cls" DECIMAL(10,4),
    "clsStatus" "CoreWebVitalStatus",
    "tbt" INTEGER,
    "tbtStatus" "CoreWebVitalStatus",
    "tti" INTEGER,
    "ttiStatus" "CoreWebVitalStatus",
    "recommendations" JSONB,
    "opportunities" JSONB,
    "diagnostics" JSONB,
    "passedAudits" JSONB,
    "apiUsageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSpeedResults_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SEOToolResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "toolType" "SEOToolType" NOT NULL,
    "url" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SEOToolResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "question" TEXT NOT NULL,
    "websiteType" TEXT NOT NULL,
    "reference" TEXT,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "brandAge" TEXT NOT NULL,
    "brandDescription" TEXT NOT NULL,
    "hasDomain" BOOLEAN NOT NULL,
    "domainName" TEXT,
    "websitesUnderDomain" TEXT,
    "hasHosting" BOOLEAN NOT NULL,
    "needsLogo" BOOLEAN NOT NULL,
    "categoryPages" TEXT NOT NULL,
    "needsContent" BOOLEAN NOT NULL,
    "providingProductImages" BOOLEAN NOT NULL,
    "additionalRequirements" TEXT,
    "budget" TEXT NOT NULL,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clerkId" TEXT,
    "hasTrial" BOOLEAN NOT NULL DEFAULT false,
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionEndsAt" TIMESTAMP(3),
    "subscriptionPlan" "SubscriptionPlan" DEFAULT 'FREE',

    CONSTRAINT "User_new_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFeatureAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feature" "FeatureType" NOT NULL,
    "hasAccess" BOOLEAN NOT NULL DEFAULT false,
    "trialAccess" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFeatureAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrial" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "lastRenewed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTrial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUsage" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "freeReportsUsed" INTEGER NOT NULL DEFAULT 0,
    "freeSearchesUsed" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "ApiCost_dailySpent_idx" ON "ApiCost"("dailySpent");

-- CreateIndex
CREATE INDEX "ApiCost_monthlySpent_idx" ON "ApiCost"("monthlySpent");

-- CreateIndex
CREATE INDEX "ApiCost_provider_idx" ON "ApiCost"("provider");

-- CreateIndex
CREATE INDEX "ApiCost_userId_idx" ON "ApiCost"("userId");

-- CreateIndex
CREATE INDEX "ApiQuota_dailyUsed_idx" ON "ApiQuota"("dailyUsed");

-- CreateIndex
CREATE INDEX "ApiQuota_monthlyUsed_idx" ON "ApiQuota"("monthlyUsed");

-- CreateIndex
CREATE INDEX "ApiQuota_provider_idx" ON "ApiQuota"("provider");

-- CreateIndex
CREATE INDEX "ApiQuota_userId_idx" ON "ApiQuota"("userId");

-- CreateIndex
CREATE INDEX "ApiUsage_createdAt_idx" ON "ApiUsage"("createdAt");

-- CreateIndex
CREATE INDEX "ApiUsage_provider_idx" ON "ApiUsage"("provider");

-- CreateIndex
CREATE INDEX "ApiUsage_status_idx" ON "ApiUsage"("status");

-- CreateIndex
CREATE INDEX "ApiUsage_userId_idx" ON "ApiUsage"("userId");

-- CreateIndex
CREATE INDEX "AuditIssue_auditId_idx" ON "AuditIssue"("auditId");

-- CreateIndex
CREATE INDEX "AuditIssue_category_idx" ON "AuditIssue"("category");

-- CreateIndex
CREATE INDEX "AuditIssue_severity_idx" ON "AuditIssue"("severity");

-- CreateIndex
CREATE INDEX "AuditReport_auditId_idx" ON "AuditReport"("auditId");

-- CreateIndex
CREATE INDEX "AuditReport_reportType_idx" ON "AuditReport"("reportType");

-- CreateIndex
CREATE INDEX "AuditResult_auditId_idx" ON "AuditResult"("auditId");

-- CreateIndex
CREATE INDEX "AuditResult_category_idx" ON "AuditResult"("category");

-- CreateIndex
CREATE INDEX "BacklinkData_createdAt_idx" ON "BacklinkData"("createdAt");

-- CreateIndex
CREATE INDEX "BacklinkData_domainAuthority_idx" ON "BacklinkData"("domainAuthority");

-- CreateIndex
CREATE INDEX "BacklinkData_provider_idx" ON "BacklinkData"("provider");

-- CreateIndex
CREATE INDEX "BacklinkData_url_idx" ON "BacklinkData"("url");

-- CreateIndex
CREATE INDEX "CompetitorAnalysis_primaryDomain_idx" ON "CompetitorAnalysis"("primaryDomain");

-- CreateIndex
CREATE INDEX "CompetitorAnalysis_userId_idx" ON "CompetitorAnalysis"("userId");

-- CreateIndex
CREATE INDEX "CompetitorData_createdAt_idx" ON "CompetitorData"("createdAt");

-- CreateIndex
CREATE INDEX "CompetitorData_domainAuthority_idx" ON "CompetitorData"("domainAuthority");

-- CreateIndex
CREATE INDEX "CompetitorData_domain_idx" ON "CompetitorData"("domain");

-- CreateIndex
CREATE INDEX "CompetitorData_provider_idx" ON "CompetitorData"("provider");

-- CreateIndex
CREATE INDEX "CrawlJob_createdAt_idx" ON "CrawlJob"("createdAt");

-- CreateIndex
CREATE INDEX "CrawlJob_status_idx" ON "CrawlJob"("status");

-- CreateIndex
CREATE INDEX "CrawlJob_userId_idx" ON "CrawlJob"("userId");

-- CreateIndex
CREATE INDEX "CrawlResult_crawlJobId_idx" ON "CrawlResult"("crawlJobId");

-- CreateIndex
CREATE INDEX "CrawlResult_discoveredAt_idx" ON "CrawlResult"("discoveredAt");

-- CreateIndex
CREATE INDEX "CrawlResult_status_idx" ON "CrawlResult"("status");

-- CreateIndex
CREATE INDEX "CrawlResult_url_idx" ON "CrawlResult"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domainName_key" ON "Domain"("domainName");

-- CreateIndex
CREATE INDEX "KeywordData_createdAt_idx" ON "KeywordData"("createdAt");

-- CreateIndex
CREATE INDEX "KeywordData_keyword_idx" ON "KeywordData"("keyword");

-- CreateIndex
CREATE INDEX "KeywordData_provider_idx" ON "KeywordData"("provider");

-- CreateIndex
CREATE INDEX "KeywordData_searchVolume_idx" ON "KeywordData"("searchVolume");

-- CreateIndex
CREATE INDEX "KeywordTracking_isTracking_idx" ON "KeywordTracking"("isTracking");

-- CreateIndex
CREATE INDEX "KeywordTracking_keyword_idx" ON "KeywordTracking"("keyword");

-- CreateIndex
CREATE INDEX "KeywordTracking_userId_idx" ON "KeywordTracking"("userId");

-- CreateIndex
CREATE INDEX "PageSpeedResults_createdAt_idx" ON "PageSpeedResults"("createdAt");

-- CreateIndex
CREATE INDEX "PageSpeedResults_overallScore_idx" ON "PageSpeedResults"("overallScore");

-- CreateIndex
CREATE INDEX "PageSpeedResults_strategy_idx" ON "PageSpeedResults"("strategy");

-- CreateIndex
CREATE INDEX "PageSpeedResults_url_idx" ON "PageSpeedResults"("url");

-- CreateIndex
CREATE INDEX "SEOToolResult_toolType_idx" ON "SEOToolResult"("toolType");

-- CreateIndex
CREATE INDEX "SEOToolResult_userId_idx" ON "SEOToolResult"("userId");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ServiceRequest_email_idx" ON "ServiceRequest"("email");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "SiteAudit_createdAt_idx" ON "SiteAudit"("createdAt");

-- CreateIndex
CREATE INDEX "SiteAudit_status_idx" ON "SiteAudit"("status");

-- CreateIndex
CREATE INDEX "SiteAudit_userId_idx" ON "SiteAudit"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFeatureAccess_userId_feature_key" ON "UserFeatureAccess"("userId", "feature");

-- CreateIndex
CREATE UNIQUE INDEX "UserSubscription_userId_key" ON "UserSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTrial_userId_key" ON "UserTrial"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "ApiCost" ADD CONSTRAINT "ApiCost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiQuota" ADD CONSTRAINT "ApiQuota_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsage" ADD CONSTRAINT "ApiUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditIssue" ADD CONSTRAINT "AuditIssue_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditResult" ADD CONSTRAINT "AuditResult_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BacklinkData" ADD CONSTRAINT "BacklinkData_apiUsageId_fkey" FOREIGN KEY ("apiUsageId") REFERENCES "ApiUsage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorAnalysis" ADD CONSTRAINT "CompetitorAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorData" ADD CONSTRAINT "CompetitorData_apiUsageId_fkey" FOREIGN KEY ("apiUsageId") REFERENCES "ApiUsage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlJob" ADD CONSTRAINT "CrawlJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrawlResult" ADD CONSTRAINT "CrawlResult_crawlJobId_fkey" FOREIGN KEY ("crawlJobId") REFERENCES "CrawlJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordData" ADD CONSTRAINT "KeywordData_apiUsageId_fkey" FOREIGN KEY ("apiUsageId") REFERENCES "ApiUsage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KeywordTracking" ADD CONSTRAINT "KeywordTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSpeedResults" ADD CONSTRAINT "PageSpeedResults_apiUsageId_fkey" FOREIGN KEY ("apiUsageId") REFERENCES "ApiUsage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SEOToolResult" ADD CONSTRAINT "SEOToolResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiteAudit" ADD CONSTRAINT "SiteAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeatureAccess" ADD CONSTRAINT "UserFeatureAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrial" ADD CONSTRAINT "UserTrial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

