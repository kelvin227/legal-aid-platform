"use server";

import { prisma } from "@/lib/db";

export async function CreateCaseAction(
    userId: string,
  caseName: string,
  caseDescription: string,
  caseType: string,
) {

    //Validate inputs
    if (!caseName || !caseDescription || !caseType) {
        return { success: false, message: "All fields are required" };
        }

    //generate a unique caseNumber
    const prefix = caseType.toUpperCase().substring(0, 2);
    const randomUUID = crypto.randomUUID().split('-')[0].toUpperCase();
     const caseNumber = `${prefix}-${randomUUID}`; 

  // Simulate a server-side action to create a case
  const uploadcase = await prisma.case.create({
    data:{
        title: caseName,
        description: caseDescription,
        caseNumber,
        caseType,
        userId,
        status: "active",
    }
  })
  return { success: true, message: "Case created successfully" };
}
