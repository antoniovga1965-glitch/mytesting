/*
  Warnings:

  - You are about to drop the column `pending` on the `Applicants` table. All the data in the column will be lost.
  - Added the required column `status` to the `Applicants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicants" DROP COLUMN "pending",
ADD COLUMN     "status" TEXT NOT NULL;
