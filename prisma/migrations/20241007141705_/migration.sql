/*
  Warnings:

  - The primary key for the `Site` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Site` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `siteId` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `siteId` on the `ManagerInvitation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `moderatorId` to the `Site` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `siteId` on the `Step` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_siteId_fkey";

-- DropForeignKey
ALTER TABLE "ManagerInvitation" DROP CONSTRAINT "ManagerInvitation_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_siteId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "siteId",
ADD COLUMN     "siteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ManagerInvitation" DROP COLUMN "siteId",
ADD COLUMN     "siteId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Site" DROP CONSTRAINT "Site_pkey",
ADD COLUMN     "moderatorId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Site_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Step" DROP COLUMN "siteId",
ADD COLUMN     "siteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "Moderator"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerInvitation" ADD CONSTRAINT "ManagerInvitation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
