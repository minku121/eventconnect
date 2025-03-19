-- AlterTable
ALTER TABLE "events" ADD COLUMN     "certificate_template_id" INTEGER,
ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');
