-- CreateMigration
BEGIN;

-- First, add birthDate as nullable
ALTER TABLE "User" ADD COLUMN "birthDate" TIMESTAMP(3);

-- Update existing records with a calculated birth date based on age
-- This assumes age is in years, and sets birthDate to that many years ago
UPDATE "User" 
SET "birthDate" = CURRENT_DATE - ("age" || ' years')::INTERVAL;

-- Now make birthDate required
ALTER TABLE "User" ALTER COLUMN "birthDate" SET NOT NULL;

-- Finally, remove the age column
ALTER TABLE "User" DROP COLUMN "age";

COMMIT;