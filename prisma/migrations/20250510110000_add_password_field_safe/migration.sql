-- First check if the column doesn't exist
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