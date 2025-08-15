-- CreateTable
CREATE TABLE "coverLetter" (
    "id" TEXT NOT NULL,
    "caseNumber" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coverLetter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "coverLetter" ADD CONSTRAINT "coverLetter_caseNumber_fkey" FOREIGN KEY ("caseNumber") REFERENCES "Case"("caseNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coverLetter" ADD CONSTRAINT "coverLetter_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
