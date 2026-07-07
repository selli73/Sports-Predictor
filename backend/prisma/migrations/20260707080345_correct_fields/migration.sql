/*
  Warnings:

  - You are about to drop the column `apiId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamAId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamAScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamBId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `teamBScore` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `apiId` on the `Team` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `awayTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamAId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_teamBId_fkey";

-- DropIndex
DROP INDEX "Match_apiId_key";

-- DropIndex
DROP INDEX "Team_apiId_key";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "apiId",
DROP COLUMN "teamAId",
DROP COLUMN "teamAScore",
DROP COLUMN "teamBId",
DROP COLUMN "teamBScore",
ADD COLUMN     "awayTeamId" TEXT NOT NULL,
ADD COLUMN     "awayTeamScore" INTEGER,
ADD COLUMN     "homeTeamId" TEXT NOT NULL,
ADD COLUMN     "homeTeamScore" INTEGER;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "apiId";

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
