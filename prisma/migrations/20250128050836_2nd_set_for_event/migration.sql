-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "createdById" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "tournamentId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "createdById" DROP DEFAULT;
