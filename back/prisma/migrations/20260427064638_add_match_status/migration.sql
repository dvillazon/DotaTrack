-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "matchId" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
