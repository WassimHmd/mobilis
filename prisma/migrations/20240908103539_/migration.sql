-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('ONGOING', 'COMPLETED', 'CANCELLED', 'SUSPENDED', 'LATE');

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_siteId_fkey";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "status" "SiteStatus" NOT NULL DEFAULT 'ONGOING';

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
