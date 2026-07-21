/*
  Warnings:

  - Added the required column `tournament` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tournament" AS ENUM ('WORLD_CHAMPIONSHIP', 'NPL_ACT');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "tournament" "Tournament" NOT NULL;
