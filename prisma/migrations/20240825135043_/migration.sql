/*
  Warnings:

  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DocTypes" AS ENUM ('RECEIPT', 'SA1', 'SA2', 'SA3', 'SA4', 'ANF');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "type",
ADD COLUMN     "type" "DocTypes" NOT NULL;

-- DropEnum
DROP TYPE "docTypes";
