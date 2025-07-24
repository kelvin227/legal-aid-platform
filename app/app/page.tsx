"use client";

import { useState } from "react";
import {
  Bell,
  Calendar,
  FileText,
  MessageCircle,
  Scale,
  Search,
  Users,
  Menu, // Import the Menu icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components

export default function LegalAidPlatform() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMobileMenuOpen(false); // Close mobile menu when a tab is selected
  };

  const upcomingHearings = [
    {
      id: 1,
      case: "Housing Dispute #2024-001",
      date: "Jan 28, 2025",
      time: "10:00 AM",
      location: "Courtroom 3A",
      type: "Hearing",
    },
    {
      id: 2,
      case: "Employment Case #2024-045",
      date: "Feb 2, 2025",
      time: "2:30 PM",
      location: "Mediation Room B",
      type: "Mediation",
    },
  ];

  const activeCases = [
    {
      id: 1,
      title: "Housing Dispute",
      caseNumber: "#2024-001",
      status: "In Progress",
      lawyer: "Sarah Johnson",
      lastUpdate: "2 days ago",
      nextAction: "Hearing scheduled",
    },
    {
      id: 2,
      title: "Employment Discrimination",
      caseNumber: "#2024-045",
      status: "Mediation",
      lawyer: "Michael Chen",
      lastUpdate: "1 week ago",
      nextAction: "Document review",
    },
  ];

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3">
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
              <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
                <div className="flex items-center justify-between p-4 border-b">
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
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Desktop Navigation Tabs - Hidden on small screens */}
          <TabsList className="hidden md:grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="dashboard" className="flex flex-col gap-1 py-3">
              <FileText className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="lawyers" className="flex flex-col gap-1 py-3">
              <Users className="h-4 w-4" />
              <span className="text-xs">Lawyers</span>
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex flex-col gap-1 py-3">
              <Scale className="h-4 w-4" />
              <span className="text-xs">My Cases</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex flex-col gap-1 py-3"
            >
              <Bell className="h-4 w-4" />
              <span className="text-xs">Alerts</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents (remain the same) */}
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Welcome back, John</h2>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">2</div>
                    <div className="text-sm text-gray-600">Active Cases</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-sm text-gray-600">
                      Upcoming Hearings
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Hearings */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Hearings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingHearings.map((hearing) => (
                    <div
                      key={hearing.id}
                      className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {hearing.case}
                        </div>
                        <div className="text-xs text-gray-600">
                          {hearing.date} at {hearing.time}
                        </div>
                        <div className="text-xs text-gray-500">
                          {hearing.location}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100">
                        {hearing.type}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Case Updates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Case Updates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeCases.slice(0, 2).map((case_) => (
                    <div
                      key={case_.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{case_.title}</div>
                        <div className="text-xs text-gray-600">
                          Updated {case_.lastUpdate}
                        </div>
                      </div>
                      <Badge
                        variant={
                          case_.status === "In Progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {case_.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lawyers Tab */}
          <TabsContent value="lawyers" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Find Legal Help</h2>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by specialty or language..."
                  className="pl-10"
                />
              </div>

              <div className="space-y-4">
                {availableLawyers.map((lawyer) => (
                  <Card key={lawyer.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=${lawyer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}`}
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
                                  className="text-xs bg-green-100 text-green-800"
                                >
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
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

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                        <span>⭐ {lawyer.rating}</span>
                        <span>{lawyer.cases} cases</span>
                        <span>Languages: {lawyer.languages.join(", ")}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          disabled={!lawyer.available}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Cases Tab */}
          <TabsContent value="cases" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Cases</h2>

              <div className="space-y-4">
                {activeCases.map((case_) => (
                  <Card key={case_.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{case_.title}</h3>
                          <p className="text-sm text-gray-600">
                            {case_.caseNumber}
                          </p>
                        </div>
                        <Badge
                          variant={
                            case_.status === "In Progress"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {case_.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lawyer:</span>
                          <span>{case_.lawyer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Update:</span>
                          <span>{case_.lastUpdate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Action:</span>
                          <span className="font-medium">
                            {case_.nextAction}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                        >
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message Lawyer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Alerts & Notifications
              </h2>

              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={
                      notification.urgent ? "border-red-200 bg-red-50" : ""
                    }
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
                            <span className="text-xs text-gray-500">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          {notification.urgent && (
                            <Badge
                              variant="destructive"
                              className="mt-2 text-xs"
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
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Emergency Contact Button */}
      <div className="fixed bottom-4 right-4">
        <Button className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 shadow-lg">
          <span className="text-lg">🆘</span>
        </Button>
      </div>
    </div>
  );
}
