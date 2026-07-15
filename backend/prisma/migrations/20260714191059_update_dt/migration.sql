-- CreateEnum
CREATE TYPE "PredictionModel" AS ENUM ('GEMINI');

-- CreateTable
CREATE TABLE "MatchAIPrediction" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeWinProbability" DOUBLE PRECISION NOT NULL,
    "drawProbability" DOUBLE PRECISION NOT NULL,
    "awayWinProbability" DOUBLE PRECISION NOT NULL,
    "model" "PredictionModel" NOT NULL,

    CONSTRAINT "MatchAIPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchAIPrediction_matchId_model_key" ON "MatchAIPrediction"("matchId", "model");

-- AddForeignKey
ALTER TABLE "MatchAIPrediction" ADD CONSTRAINT "MatchAIPrediction_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
