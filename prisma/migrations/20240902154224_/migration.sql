/*
  Warnings:

  - Added the required column `type` to the `Manager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Manager" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "validation" SET DEFAULT 'PENDING';
