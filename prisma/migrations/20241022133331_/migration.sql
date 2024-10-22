/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Site` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Site_code_key" ON "Site"("code");
