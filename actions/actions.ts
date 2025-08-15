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
  if (!uploadcase) {
    return { success: false, message: "Failed to create case" };
  }
  return { success: true, message: "Case created successfully" };
}


export async function createCourtHearing(caseNumber: string, date: Date, time: string, location: string, type: string) {

  // Validate inputs
  if (!caseNumber || !date || !time || !location) {
    return { success: false, message: "All fields are required" };
  }

  // Create a new court hearing
  const hearing = await prisma.courtHearing.create({
    data: {
      caseNumber,
      date: new Date(date),
      time,
      location,
      type: type,
    },
  });

  if (!hearing) {
    return { success: false, message: "Failed to create court hearing" };
  }
  
  return { success: true, message: "Court hearing created successfully" };
  
}

export async function SubmitCv(
  email: string,
  caseNumber: string,
  message: string,
){
  // Validate inputs
  if (!email || !caseNumber || !message) {
    return { success: false, message: "All fields are required" };
  }

  const fetchuser = await prisma.lawyer.findUnique({
    where: {
      email: email,
    },
  });

  // Create a new CV submission
  const cvSubmission = await prisma.coverLetter.create({
    data: {
      lawyerId: fetchuser?.id as string,
      caseNumber,
      content: message,
    },
  });

  if (!cvSubmission) {
    return { success: false, message: "Failed to submit CV" };
  }
  
  return { success: true, message: "CV submitted successfully" };
}