/*
  Warnings:

  - Added the required column `extractedData` to the `university_applicants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "university_applicants" ADD COLUMN     "extractedData" JSONB NOT NULL;
