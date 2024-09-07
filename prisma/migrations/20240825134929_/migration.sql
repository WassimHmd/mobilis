-- CreateEnum
CREATE TYPE "docTypes" AS ENUM ('RECEIPT', 'SA1', 'SA2', 'SA3', 'SA4', 'ANF');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "type" "docTypes" NOT NULL,
    "data" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
