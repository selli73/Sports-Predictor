/*
  Warnings:

  - You are about to drop the column `FinishType` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "FinishType",
ADD COLUMN     "finishType" "MatchFinishType" NOT NULL DEFAULT 'REGULAR';
