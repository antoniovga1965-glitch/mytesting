/*
  Warnings:

  - You are about to drop the column `PASSWORD` on the `registered_user` table. All the data in the column will be lost.
  - Added the required column `hashedpassword` to the `registered_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registered_user" DROP COLUMN "PASSWORD",
ADD COLUMN     "hashedpassword" TEXT NOT NULL;
