/*
  Warnings:

  - You are about to drop the column `published` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "published",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "ItemStatus" NOT NULL DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
