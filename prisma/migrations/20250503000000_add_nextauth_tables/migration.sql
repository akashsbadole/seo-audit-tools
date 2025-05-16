-- Drop existing foreign keys
ALTER TABLE "Domain" DROP CONSTRAINT IF EXISTS "Domain_userId_fkey";
ALTER TABLE "KeywordSearch" DROP CONSTRAINT IF EXISTS "KeywordSearch_userId_fkey";
ALTER TABLE "UserUsage" DROP CONSTRAINT IF EXISTS "UserUsage_userId_fkey";

-- Create NextAuth tables
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

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create temporary table for User
CREATE TABLE "User_new" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_new_pkey" PRIMARY KEY ("id")
);

-- Copy data from old User table to new User table
INSERT INTO "User_new" ("id", "name", "email", "isPremium", "createdAt", "updatedAt")
SELECT CAST(id AS TEXT), name, email, "isPremium", "createdAt", "updatedAt" FROM "User";

-- Drop old User table
DROP TABLE "User";

-- Rename new User table
ALTER TABLE "User_new" RENAME TO "User";

-- Create temporary table for UserUsage
CREATE TABLE "UserUsage_new" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "freeReportsUsed" INTEGER NOT NULL DEFAULT 0,
    "freeSearchesUsed" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUsage_new_pkey" PRIMARY KEY ("id")
);

-- Copy data from old UserUsage table to new UserUsage table
INSERT INTO "UserUsage_new" ("id", "userId", "freeReportsUsed", "freeSearchesUsed", "lastResetDate", "createdAt", "updatedAt")
SELECT id, CAST("userId" AS TEXT), "freeReportsUsed", "freeSearchesUsed", "lastResetDate", "createdAt", "updatedAt" FROM "UserUsage";

-- Drop old UserUsage table
DROP TABLE "UserUsage";

-- Rename new UserUsage table
ALTER TABLE "UserUsage_new" RENAME TO "UserUsage";

-- Update Domain and KeywordSearch tables to use TEXT for userId
ALTER TABLE "Domain" ALTER COLUMN "userId" TYPE TEXT;
ALTER TABLE "KeywordSearch" ALTER COLUMN "userId" TYPE TEXT;

-- Create indexes
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "UserUsage_userId_key" ON "UserUsage"("userId");

-- Add foreign key constraints
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserUsage" ADD CONSTRAINT "UserUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "KeywordSearch" ADD CONSTRAINT "KeywordSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE; 