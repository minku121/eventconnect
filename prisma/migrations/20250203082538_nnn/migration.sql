/*
  Warnings:

  - You are about to drop the column `attandee` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "attandee",
DROP COLUMN "time",
ADD COLUMN     "attendee" INTEGER,
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
