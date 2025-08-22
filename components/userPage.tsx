"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Bell,
  Calendar,
  FileText,
  MessageCircle,
  Scale,
  Search,
  Users,
  Menu,
  Cog,
  Power,
  ArrowLeft,
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "@/actions/authactions";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { assignLawyerToCase, CreateCaseAction } from "@/actions/actions";

// Define the type for a case
interface CaseType {
  id: string;
  title: string;
  caseNumber: string;
  status: string;
  lawyer: string;
  updatedAt: string;
  nextAction: string;
  createdAt?: string;
  description?: string; // Add description to the CaseType
}

const DashboardComp = ({
  userid,
  upcomingHearingsCount,
  activeCasesCount,
  activeCases,
  upcomingHearings,
  Case,
  getapplicant,
  lawyers,
  notifications,
}: {
  userid: string;
  upcomingHearingsCount: number;
  activeCasesCount: number;
  activeCases: CaseType[];
  upcomingHearings: any;
  Case: any;
  getapplicant: any[];
  lawyers: any[];
  notifications: any;
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [caseNumber, setCaseNumber] = useState<string>("");

  /** When user clicks "View Applicant" from the list, open CaseDetails directly on Applicants view */
  const [openApplicantsOnLoad, setOpenApplicantsOnLoad] = useState(false);

  // State for the new case creation form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseType, setCaseType] = useState("Housing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lawyerProfile, setLawyerProfile] = useState<any | null>(null);
  const [lawyerViewPage, setLawyerViewPage] = useState("default")
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });
  let filteredData = getapplicant.filter((item) => item.caseNumber === caseNumber);

  // Helper to safely format date-like values (Date instance or ISO/string)
  const formatDate = (d: any) => {
    if (!d) return "";
    if (d instanceof Date) return d.toLocaleDateString();
    try {
      const parsed = new Date(d);
      return isNaN(parsed.getTime()) ? String(d) : parsed.toLocaleDateString();
    } catch {
      return String(d);
    }
  };

  // Automatically hide the message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: null });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMobileMenuOpen(false);
    // Reset selected case when changing tabs
    setSelectedCase(null);
    setOpenApplicantsOnLoad(false);
  };

  const handleCreateCase = async () => {
    setIsSubmitting(true);
    setMessage({ text: "", type: null });

    try {
      const response = await CreateCaseAction(
        userid,
        caseTitle,
        caseDescription,
        caseType
      );
      if (response.success) {
        setMessage({ text: response.message, type: "success" });
        setCaseTitle("");
        setCaseDescription("");
        setCaseType("Housing");
        setIsFormOpen(false);
      } else {
        setMessage({ text: response.message, type: "error" });
      }
    } catch (error) {
      console.error("Error creating case:", error);
      setMessage({
        text: "Failed to create case. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignCase = async (lawyerid: string) => {
    try {
      const response = await assignLawyerToCase(
        selectedCase?.id as string,
        lawyerid as string
      );
    } catch (error: any) {
      console.error("Error assigning case:", error);
      setMessage({
        text: "Failed to assign case. Please try again.",
        type: "error",
      });
    }
  };


  /**
   * CaseDetails now supports internal views:
   * - "details" (original)
   * - "applicants" (list with short description + cover-letter summary)
   * - "profile" (single applicant full profile + top 3 recent jobs)
   * Uses ONLY dummy data for applicants; your schema remains unchanged.
   */
  const CaseDetails = ({
    case_,
    openApplicantsOnLoad = false,
    onConsumeOpenApplicantsFlag,
  }: {
    case_: any;
    openApplicantsOnLoad?: boolean;
    onConsumeOpenApplicantsFlag?: () => void;
  }) => {
    const [view, setView] = useState<"details" | "applicants" | "profile">(
      "details"
    );
    const [selectedApplicant, setSelectedApplicant] = useState<any | null>(
      null
    );

    useEffect(() => {
      if (openApplicantsOnLoad) {
        setView("applicants");
        onConsumeOpenApplicantsFlag?.();
      }
    }, [openApplicantsOnLoad, onConsumeOpenApplicantsFlag]);

    /** Sub-component: Applicant List */
    const ApplicantList = () => (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setView("details")}
          className="mb-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Case
        </Button>

        <h3 className="text-lg font-semibold">Applicants</h3>
        {filteredData.map((applicant) => (
          <Card key={applicant.id} className="rounded-lg shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={applicant.avatar}
                      alt={applicant.fullName}
                    />
                    <AvatarFallback>{applicant.user.fullName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{applicant.user.fullName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {applicant.user.Bio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm">
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Cover Letter
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {applicant.content}
                </p>
              </div>

              <div className="mt-3">
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setSelectedApplicant(applicant.user);
                    setView("profile");
                  }}
                >
                  View Applicant Info
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );

    /** Sub-component: Applicant Profile (with top 3 recent jobs) */
    const ApplicantProfile = ({ applicant }: { applicant: any }) => (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedApplicant(null);
            setView("applicants");
          }}
          className="mb-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applicants
        </Button>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={applicant.avatar} alt={applicant.fullName} />
                <AvatarFallback>
                  {applicant.fullName
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{applicant.fullName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {applicant.location}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{applicant.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{applicant.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Applicant</span>
              </div>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                About
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {/* {applicant.profile.bio} */}BIO
              </p>
            </div>

            {/* <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Top 3 Recent Jobs
              </p>
              <ul className="space-y-2">
                {applicant.case.slice(0, 3).map((job) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between p-3 border rounded-lg dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {job.years}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

            <div>
              <Button
                className="w-full"
                onClick={() => {
                  // Handle messaging the applicant
                  handleAssignCase(applicant.id);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Assign Case
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

    /** Render by view */
    if (view === "applicants") return <ApplicantList />;
    if (view === "profile" && selectedApplicant)
      return <ApplicantProfile applicant={selectedApplicant} />;

    // Default: original case details view
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedCase(null)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to My Cases
        </Button>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              {case_.title}
            </CardTitle>
            <div className="flex items-center justify-between mt-2">
              <Badge
                variant={case_.status === "open" ? "default" : "secondary"}
                className={`${
                  case_.status === "open"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {case_.status}
              </Badge>
              <span className="text-lg text-gray-600 dark:text-gray-400">
                Case Number: {case_.caseNumber}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              <span className="font-medium">Description:</span>
              <br />
              {case_.description || "No description provided."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Lawyer:</p>
                <p className="font-medium">{case_.laywer?.fullName || "Not assigned"}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Last Updated:
                </p>
                <p>{new Date(case_.updatedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Next Action:</p>
                <p className="font-medium">
                  {new Date(case_.nextAction).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              {case_.status === "open" ? (
                <Button
                  size="sm"
                  className="flex-1 rounded-lg"
                  onClick={() => {setView("applicants")
                    setCaseNumber(case_.caseNumber as string)}
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  View Applicant
                </Button>
              ) : (
                <Button size="sm" className="flex-1 rounded-lg">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message Lawyer
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open mobile menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[250px] sm:w-[300px] p-0 bg-white dark:bg-gray-950"
              >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <Scale className="h-6 w-6 text-blue-600" />
                    <h1 className="text-lg font-semibold">LegalAid Connect</h1>
                  </div>
                </div>
                <Tabs
                  value={activeTab}
                  onValueChange={handleTabChange}
                  orientation="vertical"
                  className="w-full mt-4"
                >
                  <TabsList className="flex flex-col h-auto w-full px-4 gap-2">
                    <TabsTrigger
                      value="dashboard"
                      className="w-full justify-start py-3"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Dashboard
                    </TabsTrigger>
                    <TabsTrigger
                      value="lawyers"
                      className="w-full justify-start py-3"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Lawyers
                    </TabsTrigger>
                    <TabsTrigger
                      value="cases"
                      className="w-full justify-start py-3"
                    >
                      <Scale className="h-4 w-4 mr-2" />
                      My Cases
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="w-full justify-start py-3"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Alerts
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </SheetContent>
            </Sheet>

            <h1 className="text-lg font-semibold">LegalAid Connect</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                {notifications.filter((n: any) => !n.isRead).length}
              </Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://placehold.co/32x32/1e40af/ffffff?text=JD"
                    alt="User Avatar"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="dark:bg-gray-800">
                <DropdownMenuItem>
                  <Cog className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <Separator className="bg-gray-100 dark:bg-gray-700" />
                <DropdownMenuItem onClick={() => LogOut()}>
                  <Power className="mr-2 h-4 w-4" /> logOut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 md:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation Tabs - Hidden on small screens */}
          <TabsList className="hidden md:grid w-full grid-cols-4 lg:w-4/5 xl:w-3/5 mx-auto mb-6">
            <TabsTrigger
              value="dashboard"
              className="flex flex-col gap-1 py-3 rounded-lg"
            >
              <FileText className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger
              value="lawyers"
              className="flex flex-col gap-1 py-3 rounded-lg"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs">Lawyers</span>
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="flex flex-col gap-1 py-3 rounded-lg"
            >
              <Scale className="h-4 w-4" />
              <span className="text-xs">My Cases</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex flex-col gap-1 py-3 rounded-lg"
            >
              <Bell className="h-4 w-4" />
              <span className="text-xs">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="container mx-auto">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Welcome back, John</h2>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="rounded-lg shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activeCasesCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Active Cases
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-lg shadow-sm">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {upcomingHearingsCount}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Upcoming Hearings
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Hearings */}
              {upcomingHearingsCount > 0 ? (
                <Card className="mb-6 rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="h-5 w-5" />
                      Upcoming Hearings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingHearings.map((hearing: any) => (
                      <div
                        key={hearing.id}
                        className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {hearing.case?.title ??
                              hearing.case?.caseNumber ??
                              String(hearing.case ?? "")}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">
                            {formatDate(hearing.date)} at {hearing.time}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">
                            {hearing.location}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-yellow-700/20 dark:bg-yellow-300/20 text-yellow-700 dark:text-yellow-300"
                        >
                          {hearing.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="mb-6 rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="h-5 w-5" />
                      Upcoming Hearings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No upcoming hearings scheduled.
                  </CardContent>
                </Card>
              )}

              {/* Recent Case Updates */}
              <Card className="rounded-lg shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Recent Case Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeCases.length > 0 ? (
                    activeCases.slice(0, 2).map((case_) => (
                      <div
                        key={case_.id}
                        className="flex items-center justify-between p-3 border dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {case_.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Updated {new Date(case_.updatedAt).toLocaleString()}
                          </div>
                        </div>
                        <Badge
                          variant={
                            case_.status === "open" ? "default" : "secondary"
                          }
                          className={`${
                            case_.status === "open"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}
                        >
                          {case_.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      No available active cases.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lawyers Tab */}
            <TabsContent value="lawyers" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Find Legal Help</h2>

                  {lawyerViewPage === "default" ?
                  <div>

                  
                    <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by specialty or language..."
                  className="pl-10 rounded-lg"
                />
              </div>

              <div className="space-y-4">
                {lawyers.map((lawyer: any) => (
                  <Card key={lawyer.id} className="rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://placehold.co/40x40/1e40af/ffffff?text=${lawyer.fullName.split(
                                " "
                              )}`}
                              alt={lawyer.fullName}
                            />
                            <AvatarFallback>
                              {lawyer.fullName.split(" ")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{lawyer.fullName}</h3>
                              {lawyer.verified && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {lawyer.specialization}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            lawyer.available ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <span>⭐ {lawyer.Case.length / 2}</span>
                        <span>{lawyer.Case.length} cases</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 rounded-lg"
                          disabled={!lawyer.available}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                          </Button>
                      </div>

                                      <div className="mt-3">
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => {
                    setLawyerProfile(lawyer);
                    setLawyerViewPage("profile");
                  }}
                >
                  View Profile
                </Button>
              </div>

                        
                    </CardContent>
                  </Card>
                ))}
              </div>
              </div> : <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => {
            setLawyerViewPage("default");
          }}
          className="mb-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Applicants
        </Button>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
<AvatarImage
                              src={`https://placehold.co/40x40/1e40af/ffffff?text=${lawyerProfile.fullName
                                .split(
                                " "
                              )
                            .map((n: any) => n[0])
                          .join("")
                        .slice(0, 2)}`}
                              alt={lawyerProfile.fullName}
                            />               
                             <AvatarFallback>
                  {lawyerProfile.fullName
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">{lawyerProfile.fullName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {lawyerProfile.location}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{lawyerProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{lawyerProfile.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{lawyerProfile.specialization}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                About
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {/* {applicant.profile.bio} */}BIO
              </p>
            </div>

            {/* <div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Top 3 Recent Jobs
              </p>
              <ul className="space-y-2">
                {applicant.case.slice(0, 3).map((job) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between p-3 border rounded-lg dark:border-gray-700"
                  >
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {job.years}
                    </span>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* <div>
              <Button
                className="w-full"
                onClick={() => {
                  // Handle messaging the applicant
                  handleAssignCase(applicant.id);
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Assign Case
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
                  }
              
            </TabsContent>

            {/* Cases Tab - Conditional Rendering */}
            <TabsContent value="cases" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Cases</h2>

              {selectedCase ? (
                // Show Case Details component if a case is selected
                <CaseDetails
                  case_={selectedCase}
                  openApplicantsOnLoad={openApplicantsOnLoad}
                  onConsumeOpenApplicantsFlag={() =>
                    setOpenApplicantsOnLoad(false)
                  }
                />
              ) : (
                // Show the list of cases
                <div className="space-y-4">
                  {Case.length > 0 ? (
                    Case.map((case_: any) => (
                      <Card key={case_.id} className="rounded-lg shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{case_.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {case_.caseNumber}
                              </p>
                            </div>
                            <Badge
                              variant={
                                case_.status === "open"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`${
                                case_.status === "open"
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 dark:bg-gray-700"
                              }`}
                            >
                              {case_.status}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Lawyer:
                              </span>
                              <span>{case_.laywer?.fullName ? null : case_.laywer?.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Last Update:
                              </span>
                              <span>
                                {new Date(case_.updatedAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Next Action:
                              </span>
                              <span className="font-medium">
                                {new Date(case_.nextAction).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent rounded-lg"
                              onClick={() => {
                                setSelectedCase(case_); // show details
                                setOpenApplicantsOnLoad(false);
                              }}
                            >
                              View Details
                            </Button>
                            {/* Conditional Button */}
                            {case_.status === "open" ? (
                              <Button
                                size="sm"
                                className="flex-1 rounded-lg"
                                onClick={() => {
                                  setSelectedCase(case_);
                                  setOpenApplicantsOnLoad(true); // jump straight to Applicants view
                                }}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                View Applicant
                              </Button>
                            ) : (
                              <Button size="sm" className="flex-1 rounded-lg">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Message Lawyer
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                      No available active cases.
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Alerts & Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((notification: any) => (
                  <Card
                    key={notification.id}
                    className={`rounded-lg shadow-sm ${
                      notification.urgent
                        ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.urgent ? "bg-red-500" : "bg-blue-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-sm">
                              {notification.title}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                          {notification.urgent && (
                            <Badge
                              variant="destructive"
                              className="mt-2 text-xs rounded-lg"
                            >
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Emergency Contact Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Message box to display success or error messages */}
        {message.text && (
          <div
            className={`fixed bottom-20 right-4 p-4 rounded-lg shadow-lg text-white max-w-sm transition-opacity duration-300 ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {message.text}
          </div>
        )}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
              <span className="text-lg">🆘</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-lg">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Please provide details about your legal issue.
              </DialogDescription>
            </DialogHeader>
            <form
              className="grid gap-4 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateCase();
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="title">Case Title</Label>
                <Input
                  id="title"
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="e.g., Eviction Assistance Needed"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={caseDescription}
                  onChange={(e) => setCaseDescription(e.target.value)}
                  placeholder="Provide a detailed description of your legal issue."
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caseType">Case Type</Label>
                <select
                  id="caseType"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Housing">Housing</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Employment">Employment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg"
              >
                {isSubmitting ? "Submitting..." : "Submit Case"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardComp;
