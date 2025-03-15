-- AlterTable
ALTER TABLE "events" ADD COLUMN     "durationMinutes" INTEGER,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');
