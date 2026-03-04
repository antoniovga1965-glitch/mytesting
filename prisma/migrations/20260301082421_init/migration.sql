/*
  Warnings:

  - You are about to drop the column `status` on the `Applicants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Applicants" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "university_applicants" (
    "id" SERIAL NOT NULL,
    "NAMES" TEXT NOT NULL,
    "UNIPHONENO" TEXT NOT NULL,
    "UNICOUNTY" TEXT NOT NULL,
    "UNIWARD" TEXT NOT NULL,
    "UNIVERSITYNAME" TEXT NOT NULL,
    "REGNO" TEXT NOT NULL,
    "confidencescore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_applicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "university_applicants_UNIPHONENO_key" ON "university_applicants"("UNIPHONENO");

-- CreateIndex
CREATE UNIQUE INDEX "university_applicants_REGNO_key" ON "university_applicants"("REGNO");
