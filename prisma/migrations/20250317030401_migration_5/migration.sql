-- AlterTable
ALTER TABLE "events" ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');
