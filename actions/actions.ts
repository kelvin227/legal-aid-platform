"use server";
import { Resend } from "resend";
import NotificationEmail from "../components/emails/NotificationEmail";
import { prisma } from "@/lib/db";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);


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
    include: {
      case: true, // Include the related case details
    },
  });

  if (!hearing) {
    return { success: false, message: "Failed to create court hearing" };
  }

  // Optionally, you can add a notification for the user about the new court hearing
  const notification = await prisma.notification.create({
    data: {
      title: `New Court Hearing Scheduled for Case ${caseNumber}`,
      userId: hearing.case.userId, // Assuming the case has a userId field
      message: `A new court hearing has been scheduled for case ${caseNumber} on ${date.toLocaleDateString()} at ${time}.`,
    },
  });

  if (!notification) {
    return { success: false, message: "Failed to create notification for court hearing, please notify client directly" };
  }

  // Send email to the case owner (best-effort; don't fail flow if email fails)
  try {
      const caseUser = await prisma.user.findUnique({
        where: { id: hearing.case.userId },
      });
      if (caseUser?.email) {
        await sendemailnotification(caseUser.email, caseUser.firstName ?? caseUser.email.split("@")[0],`Hearing scheduled — ${caseNumber}`, `A new court hearing has been scheduled for case ${caseNumber}.`, caseNumber, date, time, location,`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/cases/${caseNumber}`,
        );
      }
  } catch (err) {
    console.error("Failed to send court hearing email notification:", err);
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

export async function assignLawyerToCase(
  caseId: string,
  lawyerId: string
) {
  // Validate inputs
  if (!caseId || !lawyerId) {
    return { success: false, message: "Case ID and Lawyer ID are required" };
  }

  try {
    // Check if the lawyer exists
    const lawyer = await prisma.lawyer.findUnique({
      where: { id: lawyerId },
    });
    if (!lawyer) {
      return { success: false, message: "Lawyer not found" };
    }
    // Check if the case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: caseId },
    });
    if (!caseExists) {
      return { success: false, message: "Case not found" };
    }
    // Assign the lawyer to the case
  const updatedCase = await prisma.case.update({
    where: { id: caseId },
    data: { lawyerId, status: "assigned" },
  });
  // Check if the case was updated successfully
if (!updatedCase) {
    return { success: false, message: "Failed to assign lawyer to case" };
  }
  // add a notification for the lawyer
  const notification = await prisma.notification.create({
    data: {
      title: `case ${updatedCase.caseNumber} assigned to you`,
      lawyerId: lawyerId,
      message: `You have been assigned to case ${updatedCase.caseNumber}.`,
    },
  });
  if (!notification) {
    return { success: false, message: "Failed to create notification for lawyer" };
  }

  // Send email to the lawyer (best-effort)
  try {
    if (lawyer?.email) {
      await sendemailnotification(lawyer.email, lawyer.fullName ?? lawyer.email.split("@")[0], `New case assigned — ${updatedCase.caseNumber}`, `You have been assigned to case ${updatedCase.caseNumber}. Please review the case details.`, updatedCase.caseNumber, `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/web/dashboard/cases/${updatedCase.id}`,);
    }
  } catch (err) {
    console.error("Failed to send email to assigned lawyer:", err);
  }

  return { success: true, message: "Lawyer assigned to case successfully" };
  } catch (error) {
    console.error("Error checking case or lawyer:", error);
    return { success: false, message: "An error occurred while assigning lawyer to case" };
  }
  
}

export async function addNotification(
  who : string,
  userId: string,
  message: string,
) {
  // Validate inputs
  if (!userId || !message) {
    return { success: false, message: "User ID and message are required" };
  }
if (who !== "user" && who !== "lawyer") {
  return { success: false, message: "Invalid user type" };
}
if (who === "lawyer") {
  // Create a new notification
  const notification = await prisma.notification.create({
    data: {
      lawyerId: userId,
      message,
    },
  });
  if (!notification) {
    return { success: false, message: "Failed to create notification" };
  }

  // best-effort email to lawyer
  try {
    const lawyer = await prisma.lawyer.findUnique({ where: { id: userId } });
    if (lawyer?.email) {
      await sendemailnotification(lawyer.email,
        lawyer.fullName ?? lawyer.email.split("@")[0],
        "Notification from Legal Aid Platform",
        message,
        process.env.NEXT_PUBLIC_APP_URL ?? undefined,
    );
    }
  } catch (err) {
    console.error("Failed to send email to lawyer:", err);
  }

} else if (who === "user") {
  // Create a new notification for user
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
  if (!notification) {
    return { success: false, message: "Failed to create notification" };
  }

  // best-effort email to user
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await sendemailnotification(user.email, user.firstName ?? user.email.split("@")[0], "Notification from Legal Aid Platform", message, process.env.NEXT_PUBLIC_APP_URL ?? undefined);
    }
  } catch (err) {
    console.error("Failed to send email to user:", err);
  }
  }

  
  return { success: true, message: "Notification created successfully" };
}

export async function markNotificationAsRead(notificationId: string) {
  // Validate input
  if (!notificationId) {
    return { success: false, message: "Notification ID is required" };
  }

  // Update the notification to mark it as read
  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  if (!updatedNotification) {
    return { success: false, message: "Failed to mark notification as read" };
  }

  return { success: true, message: "Notification marked as read successfully" };
}

export async function sendemailnotification(
  email: string,
    recipientName: string,
    subject: string,
    message: string,
    caseNumber?: string,
    date?: string | Date,
    time?: string,
    location?: string,
    ctaUrl?: string,
) {
  try {

    // normalize date to human friendly string
    const dateString =
      date instanceof Date ? date.toLocaleDateString() : date ?? undefined;

    const resp = await resend.emails.send({
      from: "Notification <noreply@codegator.com.ng>",
      to: [email],
      subject,
      react: NotificationEmail({recipientName,subject,message,caseNumber,date: dateString,time,location,ctaUrl,})
    });

    if (!resp) {
      console.error("Resend returned no response:", resp);
      return { success: false, message: "unable to send email" };
    }

    return { success: true, message: "email sent successfully", data: resp };
  } catch (err) {
    console.error("Error sending email:", err);
    return { success: false, message: "error sending email", error: String(err) };
  }
}