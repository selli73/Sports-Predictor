-- CreateEnum
CREATE TYPE "MatchFinishType" AS ENUM ('REGULAR', 'PENALTIES');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "FinishType" "MatchFinishType" NOT NULL DEFAULT 'REGULAR',
ADD COLUMN     "awayPenaltyScore" INTEGER,
ADD COLUMN     "homePenaltyScore" INTEGER;
