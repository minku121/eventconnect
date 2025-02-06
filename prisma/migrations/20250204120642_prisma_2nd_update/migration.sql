/*
  Warnings:

  - The values [TEAM_CREATION,TEAM_JOINED,TOURNAMENT_CREATION] on the enum `ActivityType` will be removed. If these variants are still used in the database, this will fail.
  - The values [TEAM_JOINED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Team` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tournament` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityType_new" AS ENUM ('EVENT_CREATION', 'EVENT_JOINED', 'OTHER');
ALTER TABLE "Activity" ALTER COLUMN "type" TYPE "ActivityType_new" USING ("type"::text::"ActivityType_new");
ALTER TYPE "ActivityType" RENAME TO "ActivityType_old";
ALTER TYPE "ActivityType_new" RENAME TO "ActivityType";
DROP TYPE "ActivityType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('EVENT_JOINED', 'NEW_MESSAGE', 'OTHER');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropForeignKey
ALTER TABLE "EventAnalytics" DROP CONSTRAINT "EventAnalytics_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "TeamAnalytics" DROP CONSTRAINT "TeamAnalytics_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_createdById_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Team";

-- DropTable
DROP TABLE "TeamAnalytics";

-- DropTable
DROP TABLE "Tournament";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "rating" DOUBLE PRECISION,
    "profilePic" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "events_created" INTEGER NOT NULL DEFAULT 0,
    "events_joined" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT,
    "image" TEXT DEFAULT 'https://i.sstatic.net/y9DpT.jpg',
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ispublic" BOOLEAN NOT NULL DEFAULT true,
    "islimited" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "meetingId" TEXT,
    "eventId" TEXT NOT NULL,
    "eventPin" TEXT DEFAULT 'null',
    "participant_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventParticipant" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventParticipant_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventCreator" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EventCreator_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "events_meetingId_key" ON "events"("meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "events_eventId_key" ON "events"("eventId");

-- CreateIndex
CREATE INDEX "_EventParticipant_B_index" ON "_EventParticipant"("B");

-- CreateIndex
CREATE INDEX "_EventCreator_B_index" ON "_EventCreator"("B");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAnalytics" ADD CONSTRAINT "EventAnalytics_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventParticipant" ADD CONSTRAINT "_EventParticipant_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventParticipant" ADD CONSTRAINT "_EventParticipant_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCreator" ADD CONSTRAINT "_EventCreator_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventCreator" ADD CONSTRAINT "_EventCreator_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
