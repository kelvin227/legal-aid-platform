import { auth } from "@/auth";
import DashboardComp from "../../../components/userPage";
import { prisma } from "@/lib/db";

export default async function LegalAidPlatform() {
  const session = await auth();

  const fetchuser = await prisma.user.findUnique({
    where: {
      email: session?.user?.email as string,
    },
  });
  if (!fetchuser) {
    return <div>User not found</div>;
  }

  ///fetch the count of active case for the user
  const activeCasesCount = await prisma.case.count({
    where: {
      userId: fetchuser.id,
      status: {
        in: ["open", "assigned"],
      }, // Assuming 'active' is a valid status in your Case model
    },
  });

  const now = new Date();

  // Fetch the count of upcoming court hearings for the user
  // where the date is greater than or equal to the current date
  // and the userId matches the user's ID
  // This assumes that the 'CourtHearing' model has a relation to the 'User' model
  // and that the 'date' field is of type DateTime.
  // Adjust the query according to your actual database schema.
  // Note: Ensure that the 'CourtHearing' model has a relation to the 'User' model
  // and that the 'date' field is of type DateTime.
  // If the 'CourtHearing' model does not have a direct relation to the '
  // 'User' model, you may need to adjust the query accordingly.
  // This example assumes that the 'CourtHearing' model has a relation to the '
  // 'Case' model, which in turn has a relation to the 'User' model
  // through a 'userId' field.
  const upcomingHearingsCount = await prisma.courtHearing.count({
    where: {
      // Filter CourtHearings where the related 'case'
      case: {
        // has a 'userId' that matches the 'userIdToQuery'
        userId: fetchuser.id,
      },
      // And the 'date' of the hearing is greater than or equal to the current date
      date: {
        gte: now,
      },
    },
  });

  const fetchUpcomingHearings = await prisma.courtHearing.findMany({
    where: {
      case: {
        userId: fetchuser.id,
      },
      date: {
        gte: now,
      },
    },
    orderBy: {
      date: "asc", // Order by date in ascending order
    },
    take: 5, // Limit to the next 5 upcoming hearings
  });

  ///fetch the count of active case for the user
  const activeCases = await prisma.case.findMany({
    where: {
      userId: fetchuser.id,
      status: {
        in: ["open", "assigned"],
      }, // Assuming 'active' is a valid status in your Case model
    },
  });

  ///fetch the case details for the user
  // This assumes that the 'Case' model has a relation to the 'User' model
  // and that the 'userId' field is used to link the case to the user
  // Adjust the query according to your actual database schema.
  // If the 'Case' model does not have a direct relation to the 'User' model,
  // you may need to adjust the query accordingly.
  const Case = await prisma.case.findMany({
    where: {
      userId: fetchuser.id,
    },
    include: {
      CourtHearing: true, // Include related court hearings
      user: true, // Include related user details
    },
  });

  return (
    <DashboardComp
      userid={fetchuser.id}
      upcomingHearingsCount={upcomingHearingsCount}
      activeCasesCount={activeCasesCount}
      activeCases={activeCases as any}
      upcomingHearings={fetchUpcomingHearings as any}
      Case={Case as any}
    />
  );
}
