-- CreateTable
CREATE TABLE "Lawyer" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "phoneNumber" TEXT,
    "nbaNumber" TEXT,
    "callToBarYear" INTEGER,
    "stateOfCall" TEXT,
    "profileImageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lawyer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_email_key" ON "Lawyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_phoneNumber_key" ON "Lawyer"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Lawyer_nbaNumber_key" ON "Lawyer"("nbaNumber");

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "Lawyer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
