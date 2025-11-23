-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
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
    "status" TEXT NOT NULL DEFAULT 'PENDING'
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "session_state" TEXT
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ContactRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "service" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Domain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domainName" TEXT NOT NULL,
    "ipAddress" TEXT,
    "pdfData" BLOB,
    "pdfPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT
);

-- CreateTable
CREATE TABLE "KeywordSearch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyword" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "searchType" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "results" JSONB NOT NULL,
    "userId" TEXT
);

-- CreateTable
CREATE TABLE "SEOToolResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "toolType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SEOToolResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UserUsage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "freeReportsUsed" INTEGER NOT NULL DEFAULT 0,
    "freeSearchesUsed" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SiteAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
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
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SiteAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "maxScore" INTEGER NOT NULL DEFAULT 100,
    "data" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditResult_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditIssue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pageUrl" TEXT,
    "element" TEXT,
    "suggestion" TEXT,
    "isFixed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditIssue_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reportType" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "filePath" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditReport_auditId_fkey" FOREIGN KEY ("auditId") REFERENCES "SiteAudit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeywordTracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KeywordTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CompetitorAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "primaryDomain" TEXT NOT NULL,
    "competitorDomain" TEXT NOT NULL,
    "analysisData" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompetitorAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BacklinkAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "referringDomains" INTEGER NOT NULL DEFAULT 0,
    "domainAuthority" REAL,
    "spamScore" REAL DEFAULT 0,
    "newBacklinks" INTEGER NOT NULL DEFAULT 0,
    "lostBacklinks" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BacklinkAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Backlink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "backlinkAnalysisId" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceDomain" TEXT NOT NULL,
    "sourceTitle" TEXT,
    "targetUrl" TEXT NOT NULL,
    "anchorText" TEXT,
    "linkType" TEXT NOT NULL DEFAULT 'TEXT',
    "isDofollow" BOOLEAN NOT NULL DEFAULT true,
    "domainAuthority" REAL,
    "pageAuthority" REAL,
    "spamScore" REAL DEFAULT 0,
    "firstSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Backlink_backlinkAnalysisId_fkey" FOREIGN KEY ("backlinkAnalysisId") REFERENCES "BacklinkAnalysis" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "KeywordResearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "cpc" REAL,
    "competition" TEXT,
    "trend" JSONB,
    "relatedKeywords" JSONB,
    "serpFeatures" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "KeywordResearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SerpAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "searchEngine" TEXT NOT NULL DEFAULT 'google',
    "location" TEXT NOT NULL DEFAULT 'us',
    "language" TEXT NOT NULL DEFAULT 'en',
    "results" JSONB NOT NULL,
    "serpFeatures" JSONB,
    "topCompetitors" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SerpAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContentAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "wordCount" INTEGER,
    "readabilityScore" REAL,
    "keywordDensity" JSONB,
    "sentimentScore" REAL,
    "topicRelevance" JSONB,
    "contentQuality" JSONB,
    "recommendations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ContentAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PositionTracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "targetUrl" TEXT,
    "searchEngine" TEXT NOT NULL DEFAULT 'google',
    "location" TEXT NOT NULL DEFAULT 'us',
    "device" TEXT NOT NULL DEFAULT 'DESKTOP',
    "currentRank" INTEGER,
    "previousRank" INTEGER,
    "rankHistory" JSONB,
    "searchVolume" INTEGER,
    "difficulty" INTEGER,
    "urlCount" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PositionTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DomainOverview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "domainAge" INTEGER,
    "domainAuthority" REAL,
    "pageAuthority" REAL,
    "spamScore" REAL,
    "backlinkCount" INTEGER,
    "referringDomains" INTEGER,
    "organicKeywords" INTEGER,
    "organicTraffic" INTEGER,
    "paidKeywords" INTEGER,
    "paidTraffic" INTEGER,
    "topPages" JSONB,
    "topKeywords" JSONB,
    "competitorData" JSONB,
    "technicalSeo" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DomainOverview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TopicResearch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "searchVolume" INTEGER,
    "difficulty" REAL,
    "relevanceScore" REAL,
    "relatedTopics" JSONB,
    "questions" JSONB,
    "subtopics" JSONB,
    "contentGap" JSONB,
    "serpIntent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopicResearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WhiteLabelSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "logo" TEXT,
    "brandColor" TEXT DEFAULT '#1a365d',
    "removeBranding" BOOLEAN NOT NULL DEFAULT false,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "contactWebsite" TEXT,
    "footerText" TEXT,
    "defaultReportTitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WhiteLabelSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Suggestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "ServiceRequest_email_idx" ON "ServiceRequest"("email");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Domain_domainName_key" ON "Domain"("domainName");

-- CreateIndex
CREATE INDEX "SEOToolResult_toolType_idx" ON "SEOToolResult"("toolType");

-- CreateIndex
CREATE INDEX "SEOToolResult_userId_idx" ON "SEOToolResult"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

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

-- CreateIndex
CREATE INDEX "BacklinkAnalysis_userId_idx" ON "BacklinkAnalysis"("userId");

-- CreateIndex
CREATE INDEX "BacklinkAnalysis_domain_idx" ON "BacklinkAnalysis"("domain");

-- CreateIndex
CREATE INDEX "Backlink_backlinkAnalysisId_idx" ON "Backlink"("backlinkAnalysisId");

-- CreateIndex
CREATE INDEX "Backlink_sourceDomain_idx" ON "Backlink"("sourceDomain");

-- CreateIndex
CREATE INDEX "Backlink_status_idx" ON "Backlink"("status");

-- CreateIndex
CREATE INDEX "KeywordResearch_userId_idx" ON "KeywordResearch"("userId");

-- CreateIndex
CREATE INDEX "KeywordResearch_keyword_idx" ON "KeywordResearch"("keyword");

-- CreateIndex
CREATE INDEX "SerpAnalysis_userId_idx" ON "SerpAnalysis"("userId");

-- CreateIndex
CREATE INDEX "SerpAnalysis_keyword_idx" ON "SerpAnalysis"("keyword");

-- CreateIndex
CREATE INDEX "ContentAnalysis_userId_idx" ON "ContentAnalysis"("userId");

-- CreateIndex
CREATE INDEX "ContentAnalysis_url_idx" ON "ContentAnalysis"("url");

-- CreateIndex
CREATE INDEX "PositionTracking_userId_idx" ON "PositionTracking"("userId");

-- CreateIndex
CREATE INDEX "PositionTracking_keyword_idx" ON "PositionTracking"("keyword");

-- CreateIndex
CREATE INDEX "PositionTracking_targetUrl_idx" ON "PositionTracking"("targetUrl");

-- CreateIndex
CREATE INDEX "DomainOverview_userId_idx" ON "DomainOverview"("userId");

-- CreateIndex
CREATE INDEX "DomainOverview_domain_idx" ON "DomainOverview"("domain");

-- CreateIndex
CREATE INDEX "TopicResearch_userId_idx" ON "TopicResearch"("userId");

-- CreateIndex
CREATE INDEX "TopicResearch_topic_idx" ON "TopicResearch"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "WhiteLabelSettings_userId_key" ON "WhiteLabelSettings"("userId");

-- CreateIndex
CREATE INDEX "WhiteLabelSettings_userId_idx" ON "WhiteLabelSettings"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Suggestion_email_idx" ON "Suggestion"("email");

-- CreateIndex
CREATE INDEX "Suggestion_createdAt_idx" ON "Suggestion"("createdAt");
