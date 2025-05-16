-- Add clerkId column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'clerkId'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "clerkId" TEXT;
    END IF;
END $$;

-- Add unique constraint to clerkId if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'User' 
        AND constraint_name = 'User_clerkId_key'
    ) THEN
        ALTER TABLE "User" ADD CONSTRAINT "User_clerkId_key" UNIQUE ("clerkId");
    END IF;
END $$;

-- Remove password column if it exists (since we're using Clerk)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE "User" DROP COLUMN "password";
    END IF;
END $$; 