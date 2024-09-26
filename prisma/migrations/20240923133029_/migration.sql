-- CreateEnum
CREATE TYPE "SubStepOCStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "collectionId" TEXT,
ADD COLUMN     "subStepId" TEXT;

-- CreateTable
CREATE TABLE "SubStepOC" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "status" "SubStepOCStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "index" INTEGER NOT NULL,
    "indoorId" TEXT,
    "outdoorId" TEXT,
    "imageCollectionId" TEXT,

    CONSTRAINT "SubStepOC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageCollection" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ImageCollection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubStepOC_stepId_idx" ON "SubStepOC"("stepId");

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_indoorId_fkey" FOREIGN KEY ("indoorId") REFERENCES "ImageCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubStepOC" ADD CONSTRAINT "SubStepOC_outdoorId_fkey" FOREIGN KEY ("outdoorId") REFERENCES "ImageCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_subStepId_fkey" FOREIGN KEY ("subStepId") REFERENCES "SubStepOC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "ImageCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
