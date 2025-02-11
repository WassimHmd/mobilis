-- CreateEnum
CREATE TYPE "InvitationTypes" AS ENUM ('NEGOCIATOR', 'BUREAU');

-- AlterEnum
ALTER TYPE "StepTypes" ADD VALUE 'DEMOC';

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "siteId" INTEGER NOT NULL,
    "type" "InvitationTypes" NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
