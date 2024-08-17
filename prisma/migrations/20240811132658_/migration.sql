/*
  Warnings:

  - You are about to drop the column `Address` on the `SubContractor` table. All the data in the column will be lost.
  - You are about to drop the column `Deployment` on the `SubContractor` table. All the data in the column will be lost.
  - You are about to drop the column `FullName` on the `SubContractor` table. All the data in the column will be lost.
  - You are about to drop the column `Maintenance` on the `SubContractor` table. All the data in the column will be lost.
  - Added the required column `address` to the `SubContractor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `SubContractor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "userTypes" AS ENUM ('MODERATOR', 'SUBCONTRACTOR', 'NEGOCIATOR', 'BUREAU');

-- CreateEnum
CREATE TYPE "SiteTypes" AS ENUM ('PYLON', 'TERASSE');

-- CreateEnum
CREATE TYPE "Wilayas" AS ENUM ('ADRAR', 'CHLEF', 'LAGHOUAT', 'OUM_EL_BOUAGHI', 'BATNA', 'BEJAIA', 'BISKRA', 'BECHAR', 'BLIDA', 'BOUIRA', 'TAMANRASSET', 'TBESSA', 'TLEMCEN', 'TIARET', 'TIZI_OUZOU', 'ALGER', 'DJELFA', 'JIJEL', 'SETIF', 'SAIDA', 'SKIKDA', 'SIDI_BEL_ABBES', 'ANNABA', 'GUELMA', 'CONSTANTINE', 'MEDEA', 'MOSTAGANEM', 'MSILA', 'MASCARA', 'OUARGLA', 'ORAN', 'EL_BAYADH', 'ILLIZI', 'BORDJ_BOU_ARRERIDJ', 'BOUMERDES', 'EL_TARF', 'TINDOUF', 'TISSEMSILT', 'EL_OUED', 'KHENCHELA', 'SOUK_AHRAS', 'TIPAZA', 'MILA', 'AIN_DEFLA', 'NAAMA', 'AIN_TEMOUCHENT', 'GHARDAIA', 'RELIZANE', 'EL_MGHAIR', 'EL_MENIA', 'OULED_DJELLAL', 'BORDJ_BAJI_MOKHTAR', 'BENI_ABBES', 'TIMIMOUN', 'TOUGGOURT', 'DJANET', 'IN_SALAH', 'IN_GUEZZAM');

-- AlterTable
ALTER TABLE "SubContractor" DROP COLUMN "Address",
DROP COLUMN "Deployment",
DROP COLUMN "FullName",
DROP COLUMN "Maintenance",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "deployment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "maintenance" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" SET DEFAULT 0,
ALTER COLUMN "CAF" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "userTypes" NOT NULL DEFAULT 'SUBCONTRACTOR';

-- CreateTable
CREATE TABLE "Site" (
    "id" TEXT NOT NULL,
    "type" "SiteTypes" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "wilaya" "Wilayas" NOT NULL,
    "location" TEXT NOT NULL,
    "progression" INTEGER NOT NULL,
    "negociatorId" TEXT,
    "subconctractorId" TEXT NOT NULL,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Negociator" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Negociator_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Negociator_userId_key" ON "Negociator"("userId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_subconctractorId_fkey" FOREIGN KEY ("subconctractorId") REFERENCES "SubContractor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_negociatorId_fkey" FOREIGN KEY ("negociatorId") REFERENCES "Negociator"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negociator" ADD CONSTRAINT "Negociator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
