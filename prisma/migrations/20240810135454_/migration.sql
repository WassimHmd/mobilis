-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "SubContractor" (
    "userId" TEXT NOT NULL,
    "status" DOUBLE PRECISION NOT NULL,
    "FullName" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "CAF" INTEGER NOT NULL,
    "SPOC" TEXT NOT NULL,
    "Deployment" BOOLEAN NOT NULL,
    "Maintenance" BOOLEAN NOT NULL,

    CONSTRAINT "SubContractor_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubContractor_userId_key" ON "SubContractor"("userId");

-- AddForeignKey
ALTER TABLE "SubContractor" ADD CONSTRAINT "SubContractor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
