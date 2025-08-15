"use client";
import React, { useState } from "react";
import {
  Briefcase,
  Calendar,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  Menu,
  Users,
  X,
  FileQuestion,
  ArrowLeft,
  BriefcaseMedical, // New icon for the application form
} from "lucide-react";
import { SubmitCv } from "@/actions/actions";

// The ApplyForCaseForm component
// This component displays a form for a lawyer to apply for an open case.
const ApplyForCaseForm = ({
  caseData,
  onCancel,
  onSubmit,
  email,
}: {
  caseData: any;
  onCancel: any;
  onSubmit: any;
  email: string;
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // In a real application, you would send this data to a backend.
    const apply = await SubmitCv(email, caseData.caseNumber, message);
    if (apply.success) {
      alert(apply.message);
    } else {
      alert("Failed to apply for the case: " + apply.message);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      {/* Back button to return to the case detail view */}
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Cancel Application
        </button>
      </div>

      <div className="flex items-center mb-4">
        <BriefcaseMedical size={32} className="mr-3 text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Apply for Case
        </h2>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-1">{caseData.title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Posted by: {caseData.user.firstName} {caseData.user.lastName} on{" "}
          {caseData.datePosted}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="message"
            className="block text-md font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Why are you a good fit for this case?
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a brief cover letter or message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-md"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

// The CaseDetailView component to display the selected case's information.
const CaseDetailView = ({
  caseData,
  onBackClick,
  onApplyClick,
}: {
  caseData: any;
  onBackClick: any;
  onApplyClick: any;
}) => {
  if (!caseData) {
    return null;
  }

  // Check if the case is an "open case" from the client case board
  // We can infer this based on the existence of a 'description' property.
  const isOpencase = !!caseData.description;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
      {/* Back button to return to the main dashboard */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackClick}
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
        {isOpencase && (
          <button
            onClick={() => onApplyClick(caseData)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-md"
          >
            Apply for Case
          </button>
        )}
      </div>

      {/* Case title and client info */}
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {caseData.title || caseData.case}
      </h2>
      <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
        Client: {caseData.clientName || caseData.name}
      </p>

      {/* Case description/details */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-3">Case Details</h3>
        <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
          {caseData.description ||
            caseData.details ||
            "No detailed description available."}
        </p>
      </div>

      {/* Additional case information can be added here */}
      <div className="mt-6 space-y-4">
        {isOpencase && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold w-32">Posted:</span>
            <span>
              {new Date(caseData.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        {caseData.user && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold w-32">Posted by:</span>
            <span>
              {caseData.user.firstName} {caseData.user.lastName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App component for the dashboard
const App = ({
  assignedCases,
  assignedcasecount,
  fullname,
  upcomingHearings,
  deadlineCount,
  opencases,
  email,
}: {
  assignedCases: any[];
  assignedcasecount: number;
  fullname: string;
  upcomingHearings: any[];
  deadlineCount: number;
  opencases: any[];
  email: string;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isApplyingForCase, setIsApplyingForCase] = useState(false); // New state for the application form

  // Function to handle showing the case details
  const handleViewCase = (caseItem: any) => {
    setSelectedCase(caseItem);
    setIsApplyingForCase(false); // Ensure the form is hidden when viewing a case
  };

  // Function to go back to the dashboard view
  const handleBackToDashboard = () => {
    setSelectedCase(null);
    setIsApplyingForCase(false);
  };

  // Function to show the application form
  const handleShowApplicationForm = () => {
    setIsApplyingForCase(true);
  };

  // Function to cancel the application and return to the case detail view
  const handleCancelApplication = () => {
    setIsApplyingForCase(false);
  };

  // Function to handle submitting the application (for demonstration)
  const handleSubmitApplication = (applicationData: any) => {
    // Here you would send the data to your backend
    console.log("Application submitted:", applicationData);
    // After submission, go back to the case detail page.
    handleCancelApplication();
  };

  // Dummy tasks data
  const tasks = [
    { id: 1, text: "Prepare for John Doe meeting", completed: false },
    { id: 2, text: "File motion for Smith vs. Johnson", completed: true },
    { id: 3, text: "Review new client intake forms", completed: false },
  ];

  const firmName = "Nexus Law Group";
  const userName = `${fullname}`;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar for navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out z-50 shadow-lg lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold">{firmName}</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              {
                name: "Dashboard",
                href: "/dashboard",
                icon: <LayoutDashboard size={20} className="mr-3" />,
              },
              {
                name: "Clients",
                href: "/client",
                icon: <Users size={20} className="mr-3" />,
              },
              {
                name: "Calendar",
                href: "/calendar",
                icon: <Calendar size={20} className="mr-3" />,
              },
              {
                name: "Documents",
                href: "/documents",
                icon: <FileText size={20} className="mr-3" />,
              },
              {
                name: "Tasks",
                href: "/tasks",
                icon: <ClipboardList size={20} className="mr-3" />,
              },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    item.name === "Dashboard"
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-8 transition-all duration-300 ease-in-out">
        {/* Header bar */}
        <header className="flex items-center justify-between py-4 mb-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-900 dark:text-gray-100"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome back,
              </span>
              <span className="block font-semibold">{userName}</span>
            </div>
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              JP
            </div>
          </div>
        </header>

        {/* Conditional rendering based on selectedCase and isApplyingForCase states */}
        {isApplyingForCase ? (
          <ApplyForCaseForm
            caseData={selectedCase}
            onCancel={handleCancelApplication}
            onSubmit={handleSubmitApplication}
            email={email}
          />
        ) : selectedCase ? (
          <CaseDetailView
            caseData={selectedCase}
            onBackClick={handleBackToDashboard}
            onApplyClick={handleShowApplicationForm}
          />
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* First Row of Widgets */}
            <div className="md:col-span-2 lg:col-span-1 w-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active/Assigned Cases Count
                    </h3>
                    <p className="text-3xl font-bold">{assignedcasecount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Upcoming Hearings Count */}
            <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300">
                  <Clock size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Upcoming Hearings Count
                  </h3>
                  <p className="text-3xl font-bold">{deadlineCount}</p>
                </div>
              </div>
            </div>

            {/* New Widget: Client Case Board */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FileQuestion size={20} className="mr-2" />
                Client Case Board
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opencases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm flex flex-col"
                  >
                    <h4 className="font-bold text-lg mb-1">{caseItem.title}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                      {caseItem.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        Posted by:{" "}
                        {
                          ((caseItem.user.firstName as string) +
                            " " +
                            caseItem.user.lastName) as string
                        }
                      </span>
                      <span>
                        {new Date(caseItem.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewCase(caseItem)}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Case
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget: Recent Cases */}
            <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Recent Cases</h3>
              <ul className="space-y-4">
                {assignedCases.map((client) => (
                  <li
                    key={client.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="font-semibold">{client.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {client.case}
                    </div>
                    <button
                      onClick={() => handleViewCase(client)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget: Upcoming Hearings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">Upcoming Hearings</h3>
              <ul className="space-y-4">
                {upcomingHearings.map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="mr-2">
                        {event.date.toLocaleDateString()}
                      </span>
                      <span className="mr-2">{event.time}</span>
                      <span className="text-xs italic">({event.location})</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Widget: To-Do List */}
            <div className="md:col-span-2 lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">To-Do List</h3>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      readOnly
                    />
                    <span
                      className={`text-md ${
                        task.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : ""
                      }`}
                    >
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
