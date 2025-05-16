-- First, ensure the password column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "password" TEXT;
    END IF;
END $$;

-- Fix any constraint issues
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'UserUsage' 
        AND constraint_name = 'UserUsage_new_pkey'
    ) THEN
        ALTER TABLE "UserUsage" RENAME CONSTRAINT "UserUsage_new_pkey" TO "UserUsage_pkey";
    END IF;
END $$; 