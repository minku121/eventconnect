-- AlterTable
ALTER TABLE "EventAttendee" ADD COLUMN     "totalDuration" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');
