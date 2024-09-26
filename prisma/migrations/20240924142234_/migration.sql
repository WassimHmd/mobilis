-- DropForeignKey
ALTER TABLE "SubStepOC" DROP CONSTRAINT "SubStepOC_indoorId_fkey";

-- DropForeignKey
ALTER TABLE "SubStepOC" DROP CONSTRAINT "SubStepOC_outdoorId_fkey";

-- AlterTable
ALTER TABLE "Images" ALTER COLUMN "stepId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_indoorId_fkey" FOREIGN KEY ("indoorId") REFERENCES "ImageCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_outdoorId_fkey" FOREIGN KEY ("outdoorId") REFERENCES "ImageCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_imageCollectionId_fkey" FOREIGN KEY ("imageCollectionId") REFERENCES "ImageCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
