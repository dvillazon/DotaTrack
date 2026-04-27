-- DropForeignKey
ALTER TABLE "TeamPlayer" DROP CONSTRAINT "TeamPlayer_userId_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "captainId" TEXT;

-- AlterTable
ALTER TABLE "TeamPlayer" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "teamSlots" INTEGER NOT NULL DEFAULT 8;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_captainId_fkey" FOREIGN KEY ("captainId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPlayer" ADD CONSTRAINT "TeamPlayer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
