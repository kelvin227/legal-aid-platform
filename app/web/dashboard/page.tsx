import { auth } from "@/auth";
import App from "@/components/lawyerComp/dashboardComp";
import { prisma } from "@/lib/db";
import React from "react";

export default async function LawyerDashboard() {
  const session = await auth();
  const fetchuser = await prisma.lawyer.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });

  const assignedcasescount = await prisma.case.count({
    where: {
      lawyerId: fetchuser?.id,
      status: "assigned",
    },
  });

  const cases = await prisma.case.findMany({
    where: {
      lawyerId: fetchuser?.id,
      status: "assigned",
    },
  });

  const now = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(now.getDate() + 7);

  const upcomingHearings = await prisma.courtHearing.findMany({
    where: {
      case: {
        lawyerId: fetchuser?.id,
        status: "assigned",
      },
      date: {
        gte: now, // greater than or equal to now
        lte: sevenDaysLater, // less than or equal to 7 days from now
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 3, // Limit to 3 upcoming hearings
  });

  const deadlineCount = upcomingHearings.length;

  //get the lawyer recently assigned cases
  const assignedCases = await prisma.case.findMany({
    where: {
      lawyerId: fetchuser?.id,
      status: "assigned",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3, // Limit to 3 most recent cases
  });

  const opencases = await prisma.case.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      status: "open",
    },
    take: 3, // Limit to 3 most recent open cases
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return (
    <App
      assignedCases={assignedCases}
      assignedcasecount={assignedcasescount}
      fullname={fetchuser?.fullName as string}
      upcomingHearings={upcomingHearings as any}
      deadlineCount={deadlineCount}
      opencases={opencases}
      email={fetchuser?.email as string}
    />
  );
}
