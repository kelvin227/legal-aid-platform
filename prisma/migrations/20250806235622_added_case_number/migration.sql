/*
  Warnings:

  - You are about to drop the column `caseId` on the `CourtHearing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[caseNumber]` on the table `Case` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseNumber` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `caseNumber` to the `CourtHearing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CourtHearing" DROP CONSTRAINT "CourtHearing_caseId_fkey";

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "caseNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CourtHearing" DROP COLUMN "caseId",
ADD COLUMN     "caseNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");

-- AddForeignKey
ALTER TABLE "CourtHearing" ADD CONSTRAINT "CourtHearing_caseNumber_fkey" FOREIGN KEY ("caseNumber") REFERENCES "Case"("caseNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
