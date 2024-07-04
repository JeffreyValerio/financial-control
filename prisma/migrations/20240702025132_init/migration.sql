-- CreateEnum
CREATE TYPE "Type" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "Type" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
