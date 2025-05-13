/*
  Warnings:

  - You are about to drop the `web_push_subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "web_push_subscriptions" DROP CONSTRAINT "web_push_subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "endTime" SET DEFAULT (now() + interval '1 hour');

-- DropTable
DROP TABLE "web_push_subscriptions";
