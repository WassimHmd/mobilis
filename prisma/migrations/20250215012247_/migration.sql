-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "invitedBureau" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invitedNegociator" BOOLEAN NOT NULL DEFAULT false;
