/*
  Warnings:

  - You are about to drop the column `confidencescore` on the `university_applicants` table. All the data in the column will be lost.
  - Added the required column `userId` to the `university_applicants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "university_applicants" DROP COLUMN "confidencescore",
ADD COLUMN     "confidenceScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "university_applicants" ADD CONSTRAINT "university_applicants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "registered_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
