"use client";
import React from "react";
import { useState, useEffect } from "react"; // Import useEffect for message timeout
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
  Power, // Import the Menu icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
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
import { CreateCaseAction } from "@/actions/actions";

// Define the type for a case
interface CaseType {
  id: number;
  title: string;
  caseNumber: string;
  status: string;
  lawyer: string;
  updatedAt: string;
  nextAction: string;
  createdAt?: string; // Add createdAt as it's used in the code
}

interface HearingType {
  id: number;
  case: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

const DashboardComp = ({
  userid,
  upcomingHearingsCount,
  activeCasesCount,
  activeCases,
  upcomingHearings,
  Case,
}: {
  userid: string;
  upcomingHearingsCount: number;
  activeCasesCount: number;
  activeCases: CaseType[];
  upcomingHearings: HearingType[];
  Case: CaseType[];
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for the new case creation form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [caseTitle, setCaseTitle] = useState("");
  const [caseDescription, setCaseDescription] = useState("");
  const [caseType, setCaseType] = useState("Housing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({ text: "", type: null });

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
    // Close mobile menu when a tab is selected
    setIsMobileMenuOpen(false);
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
        // Reset form fields
        setCaseTitle("");
        setCaseDescription("");
        setCaseType("Housing");
        setIsFormOpen(false); // Close the form on success
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

  // Mock data for Lawyers and Notifications (assuming this is static or fetched elsewhere)
  const availableLawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Housing Law",
      rating: 4.9,
      cases: 156,
      languages: ["English", "Spanish"],
      verified: true,
      available: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Employment Law",
      rating: 4.8,
      cases: 203,
      languages: ["English", "Mandarin"],
      verified: true,
      available: true,
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      specialty: "Family Law",
      rating: 4.9,
      cases: 178,
      languages: ["English", "Spanish", "Portuguese"],
      verified: true,
      available: false,
    },
  ];

  const notifications = [
    {
      id: 1,
      type: "hearing",
      title: "Hearing Reminder",
      message: "Your housing dispute hearing is tomorrow at 10:00 AM",
      time: "2 hours ago",
      urgent: true,
    },
    {
      id: 2,
      type: "update",
      title: "Case Update",
      message: "New documents have been filed in your employment case",
      time: "1 day ago",
      urgent: false,
    },
    {
      id: 3,
      type: "message",
      title: "Message from Sarah Johnson",
      message: "I've reviewed your case documents. Let's schedule a call.",
      time: "2 days ago",
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Hamburger menu for small screens */}
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

                {/* Mobile Navigation Tabs */}
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
                3
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
                    {upcomingHearings.map((hearing) => (
                      <div
                        key={hearing.id}
                        className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800"
                      >
                        <div>
                          <div className="font-medium text-sm">
                            {hearing.case}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-300">
                            {hearing.date} at {hearing.time}
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

              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by specialty or language..."
                  className="pl-10 rounded-lg"
                />
              </div>

              <div className="space-y-4">
                {availableLawyers.map((lawyer) => (
                  <Card key={lawyer.id} className="rounded-lg shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://placehold.co/40x40/1e40af/ffffff?text=${lawyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}`}
                              alt={lawyer.name}
                            />
                            <AvatarFallback>
                              {lawyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{lawyer.name}</h3>
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
                              {lawyer.specialty}
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
                        <span>⭐ {lawyer.rating}</span>
                        <span>{lawyer.cases} cases</span>
                        <span>Languages: {lawyer.languages.join(", ")}</span>
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-lg"
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Cases Tab */}
            <TabsContent value="cases" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">My Cases</h2>

              <div className="space-y-4">
                {Case.length > 0 ? (
                  Case.map((case_: CaseType) => (
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

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Lawyer:
                            </span>
                            <span>{case_.lawyer}</span>
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
                          >
                            View Details
                          </Button>
                          {case_.status === "assigned" ? (
                            <Button size="sm" className="flex-1 rounded-lg">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Message Lawyer
                            </Button>
                          ) : (
                            ""
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
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">
                Alerts & Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((notification) => (
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
                              {notification.time}
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
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
