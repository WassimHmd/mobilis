-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "bureauId" TEXT;

-- CreateTable
CREATE TABLE "Bureau" (
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bureau_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bureau_userId_key" ON "Bureau"("userId");

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_bureauId_fkey" FOREIGN KEY ("bureauId") REFERENCES "Bureau"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bureau" ADD CONSTRAINT "Bureau_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
