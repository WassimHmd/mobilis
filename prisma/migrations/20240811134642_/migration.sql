/*
  Warnings:

  - You are about to drop the column `subconctractorId` on the `Site` table. All the data in the column will be lost.
  - Added the required column `subcontractorId` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Wilayas" ADD VALUE 'PARIS';

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_subconctractorId_fkey";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "subconctractorId",
ADD COLUMN     "subcontractorId" TEXT NOT NULL,
ALTER COLUMN "progression" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_subcontractorId_fkey" FOREIGN KEY ("subcontractorId") REFERENCES "SubContractor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
