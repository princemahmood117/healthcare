-- -- AlterTable
-- ALTER TABLE "doctor" ALTER COLUMN "currentWorkingPLace" DROP NOT NULL;

ALTER TABLE "doctor"
RENAME COLUMN "currentWorkingPLace" TO "currentWorkingPlace";