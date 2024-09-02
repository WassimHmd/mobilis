-- CreateEnum
CREATE TYPE "ManagerValidation" AS ENUM ('VALID', 'PENDING', 'REFUSED');

-- CreateEnum
CREATE TYPE "StepTypes" AS ENUM ('SA1', 'SA2', 'SA3', 'SA4', 'ANF', 'DOS', 'OC');

-- CreateEnum
CREATE TYPE "StepStatus" AS ENUM ('COMPLETED', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "Site" ALTER COLUMN "startDate" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Step" (
    "id" TEXT NOT NULL,
    "status" "StepStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "type" "StepTypes" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manager" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "validation" "ManagerValidation" NOT NULL,
    "stepId" TEXT NOT NULL,

    CONSTRAINT "Manager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
