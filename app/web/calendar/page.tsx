import { auth } from "@/auth";
import CalendarPage from "@/components/lawyerComp/calendarComp";
import { prisma } from "@/lib/db";
import React from "react";

export default async function Case() {
  const session = await auth();
  const fetchuser = await prisma.lawyer.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });
  if (!fetchuser) {
    return <div className="text-red-500">User not found</div>;
  }
  //data for upcoming hearings
  const upcomingHearings = await prisma.courtHearing.findMany({
    where: {
      case: {
        lawyerId: fetchuser.id,
      },
    },
    orderBy: {
      date: "asc", // Order by date ascending
    },
  });
  const casenumber = await prisma.case.findMany({
    where: {
      lawyerId: fetchuser.id,
    },
  });
  return (
    <CalendarPage upcomingHearings={upcomingHearings} cases={casenumber} />
  );
}
