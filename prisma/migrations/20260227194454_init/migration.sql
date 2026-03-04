-- CreateTable
CREATE TABLE "registered_user" (
    "id" SERIAL NOT NULL,
    "NAME" TEXT NOT NULL,
    "EMAIL" TEXT NOT NULL,
    "PASSWORD" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registered_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "registered_user_EMAIL_key" ON "registered_user"("EMAIL");
