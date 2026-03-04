/*
  Warnings:

  - Added the required column `pending` to the `Applicants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicants" ADD COLUMN     "pending" TEXT NOT NULL;
