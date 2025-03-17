-- AlterTable
ALTER TABLE "events" ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'SCHEDULED',
ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');
