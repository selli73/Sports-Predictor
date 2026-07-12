/*
  Warnings:

  - A unique constraint covering the columns `[matchKey]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchKey` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Match_homeTeamId_awayTeamId_startAt_key";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_matchKey_key" ON "Match"("matchKey");
