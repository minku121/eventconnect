/*
  Warnings:

  - You are about to drop the column `status` on the `events` table. All the data in the column will be lost.
  - You are about to drop the `_EventCreator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventCreator" DROP CONSTRAINT "_EventCreator_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventCreator" DROP CONSTRAINT "_EventCreator_B_fkey";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "status",
ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');

-- DropTable
DROP TABLE "_EventCreator";

-- CreateTable
CREATE TABLE "EventAttendee" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "EventAttendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendee_eventId_userId_key" ON "EventAttendee"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendee" ADD CONSTRAINT "EventAttendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
