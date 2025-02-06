/*
  Warnings:

  - A unique constraint covering the columns `[meetingId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privateId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meetingId" TEXT,
ADD COLUMN     "privateId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_meetingId_key" ON "Event"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_privateId_key" ON "Event"("privateId");
