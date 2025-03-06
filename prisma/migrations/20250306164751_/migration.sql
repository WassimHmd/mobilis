-- AlterEnum
ALTER TYPE "StepTypes" ADD VALUE 'RP';

-- AlterTable
ALTER TABLE "Step" ADD COLUMN     "meetDate" TIMESTAMP(3);
