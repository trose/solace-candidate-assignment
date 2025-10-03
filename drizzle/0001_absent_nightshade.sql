ALTER TABLE "advocates" RENAME COLUMN "payload" TO "specialties";
ALTER TABLE "advocates" ALTER COLUMN "specialties" SET DEFAULT '{}';