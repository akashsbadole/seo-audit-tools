-- CreateEnum
CREATE TYPE "SEOToolType" AS ENUM (
    'META_TAGS',
    'KEYWORD_DENSITY',
    'HEADER_TAGS',
    'INTERNAL_LINKS',
    'ALT_TEXT',
    'BROKEN_LINKS',
    'ROBOTS_TXT',
    'SITEMAP',
    'SEO_SCORE',
    'READABILITY',
    'TITLE_PREVIEW',
    'DESCRIPTION_PREVIEW',
    'STRUCTURED_DATA',
    'CANONICAL_URL',
    'MOBILE_FRIENDLY'
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

-- CreateIndex
CREATE INDEX "SEOToolResult_userId_idx" ON "SEOToolResult"("userId");

-- CreateIndex
CREATE INDEX "SEOToolResult_toolType_idx" ON "SEOToolResult"("toolType");

-- AddForeignKey
ALTER TABLE "SEOToolResult" ADD CONSTRAINT "SEOToolResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE; 