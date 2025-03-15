/*
  Warnings:

  - You are about to drop the column `dateTime` on the `events` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SCHEDULED', 'ACTIVE', 'ENDED');

-- AlterTable
ALTER TABLE "EventAnalytics" ADD COLUMN     "averageDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "joinRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "peakParticipants" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "dateTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL DEFAULT (now() + interval '1 hour'),
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'SCHEDULED';
