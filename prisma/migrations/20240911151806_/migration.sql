-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Manager" DROP CONSTRAINT "Manager_stepId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "Step"("id") ON DELETE CASCADE ON UPDATE CASCADE;
