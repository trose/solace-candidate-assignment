-- Convert specialties column from jsonb to text[]
-- This will truncate the table as the data types are incompatible
TRUNCATE TABLE "advocates" CASCADE;
ALTER TABLE "advocates" DROP COLUMN "specialties";
ALTER TABLE "advocates" ADD COLUMN "specialties" text[] DEFAULT '{}' NOT NULL;
