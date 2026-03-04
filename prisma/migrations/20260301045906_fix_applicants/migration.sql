/*
  Warnings:

  - Added the required column `extractedData` to the `Applicants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Applicants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicants" ADD COLUMN     "extractedData" JSONB NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "FEEBALANCE" SET DATA TYPE TEXT,
ALTER COLUMN "GUARDIANPHONE" SET DATA TYPE TEXT,
ALTER COLUMN "INCOME" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Applicants" ADD CONSTRAINT "Applicants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "registered_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
