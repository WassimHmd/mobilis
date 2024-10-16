-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "signatureId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signatureId" TEXT;

-- CreateTable
CREATE TABLE "SignaNum" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignaNum_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "SignaNum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manager" ADD CONSTRAINT "Manager_signatureId_fkey" FOREIGN KEY ("signatureId") REFERENCES "SignaNum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
