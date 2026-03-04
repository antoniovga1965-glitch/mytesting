-- CreateTable
CREATE TABLE "universitydocumentHash" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "fieldname" TEXT NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "universitydocumentHash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "universitydocumentHash_hash_key" ON "universitydocumentHash"("hash");
