/*
  Warnings:

  - Added the required column `PHONE` to the `registered_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registered_user" ADD COLUMN     "PHONE" TEXT NOT NULL;
