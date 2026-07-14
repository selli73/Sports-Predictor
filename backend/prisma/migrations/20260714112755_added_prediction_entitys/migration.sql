/*
  Warnings:

  - You are about to drop the column `outCome` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `outcome` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PredictionOutcome" AS ENUM ('HOME_WIN', 'AWAY_WIN', 'DRAW');

-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "outCome",
ADD COLUMN     "outcome" "PredictionOutcome" NOT NULL;

-- DropEnum
DROP TYPE "PredictionOutCome";
