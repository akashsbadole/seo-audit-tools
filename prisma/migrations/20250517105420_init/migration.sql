-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('FREELANCER', 'CLIENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SEOToolType" AS ENUM ('META_TAGS', 'KEYWORD_DENSITY', 'HEADER_TAGS', 'INTERNAL_LINKS', 'ALT_TEXT', 'BROKEN_LINKS', 'ROBOTS_TXT', 'SITEMAP', 'SEO_SCORE', 'READABILITY', 'TITLE_PREVIEW', 'DESCRIPTION_PREVIEW', 'STRUCTURED_DATA', 'CANONICAL_URL', 'MOBILE_FRIENDLY');

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

    CONSTRAINT "User_new_pkey" PRIMARY KEY ("id")
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
    "userId" TEXT NOT NULL,
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
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE INDEX "ServiceRequest_email_idx" ON "ServiceRequest"("email");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "ContactRequest_userId_idx" ON "ContactRequest"("userId");

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

-- AddForeignKey
ALTER TABLE "SEOToolResult" ADD CONSTRAINT "SEOToolResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
