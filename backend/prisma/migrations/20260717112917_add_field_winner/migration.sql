-- CreateEnum
CREATE TYPE "MatchWinner" AS ENUM ('HOME', 'AWAY', 'DRAW');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "winner" "MatchWinner";
