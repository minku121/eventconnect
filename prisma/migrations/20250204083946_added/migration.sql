/*
  Warnings:

  - You are about to drop the column `privateId` on the `Event` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Event_privateId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "privateId",
ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "eventPin" TEXT DEFAULT 'null';

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");
