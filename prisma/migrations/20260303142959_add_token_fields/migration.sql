-- AlterTable
ALTER TABLE "registered_user" ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "token" TEXT;
