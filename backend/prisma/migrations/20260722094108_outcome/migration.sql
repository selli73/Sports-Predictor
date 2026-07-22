/*
  Warnings:

  - You are about to drop the column `winner` on the `Match` table. All the data in the column will be lost.
  - Changed the type of `outcome` on the `Prediction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MatchOutcome" AS ENUM ('HOME', 'AWAY', 'DRAW');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "winner",
ADD COLUMN     "outcome" "MatchOutcome";

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "outcome",
ADD COLUMN     "outcome" "MatchOutcome" NOT NULL;

-- DropEnum
DROP TYPE "MatchWinner";

-- DropEnum
DROP TYPE "PredictionOutcome";
