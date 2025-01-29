-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EVENT_JOINED', 'TEAM_JOINED', 'NEW_MESSAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('EVENT_CREATION', 'TEAM_CREATION', 'EVENT_JOINED', 'TEAM_JOINED', 'OTHER');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "attandee" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "islimited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ispublic" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "image" SET DEFAULT 'https://i.sstatic.net/y9DpT.jpg';

-- AlterTable
ALTER TABLE "History" ADD COLUMN     "duration" INTEGER;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAnalytics" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "totalJoined" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamAnalytics" (
    "id" SERIAL NOT NULL,
    "teamId" INTEGER NOT NULL,
    "totalPlayers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAnalytics_eventId_key" ON "EventAnalytics"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamAnalytics_teamId_key" ON "TeamAnalytics"("teamId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAnalytics" ADD CONSTRAINT "EventAnalytics_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAnalytics" ADD CONSTRAINT "TeamAnalytics_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
