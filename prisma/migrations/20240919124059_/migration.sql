-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('PENDING', 'CHOSEN');

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "path" TEXT;

-- CreateTable
CREATE TABLE "SA1Candidate" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "long" TEXT NOT NULL,
    "lat" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "SA1Candidate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SA1Candidate" ADD CONSTRAINT "SA1Candidate_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
