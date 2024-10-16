-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "phoneNumber" TEXT NOT NULL DEFAULT '0541129519';

-- CreateTable
CREATE TABLE "ManagerInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "stepType" "StepTypes" NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "ManagerInvitation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ManagerInvitation" ADD CONSTRAINT "ManagerInvitation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
