/*
  Warnings:

  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('UPCOMING', 'IN_PROGRESS', 'HALF_TIME', 'EXTRA_TIME', 'PENALTIES', 'FINISHED');

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status",
ADD COLUMN     "status" "MatchStatus" NOT NULL;
