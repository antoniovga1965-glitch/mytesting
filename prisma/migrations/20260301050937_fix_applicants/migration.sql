/*
  Warnings:

  - Changed the type of `FEEBALANCE` on the `Applicants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Applicants" DROP COLUMN "FEEBALANCE",
ADD COLUMN     "FEEBALANCE" DOUBLE PRECISION NOT NULL;
