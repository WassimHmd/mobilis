-- DropForeignKey
ALTER TABLE "Bureau" DROP CONSTRAINT "Bureau_userId_fkey";

-- DropForeignKey
ALTER TABLE "Moderator" DROP CONSTRAINT "Moderator_userId_fkey";

-- DropForeignKey
ALTER TABLE "Negociator" DROP CONSTRAINT "Negociator_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubContractor" DROP CONSTRAINT "SubContractor_userId_fkey";

-- AddForeignKey
ALTER TABLE "Moderator" ADD CONSTRAINT "Moderator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubContractor" ADD CONSTRAINT "SubContractor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negociator" ADD CONSTRAINT "Negociator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bureau" ADD CONSTRAINT "Bureau_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
