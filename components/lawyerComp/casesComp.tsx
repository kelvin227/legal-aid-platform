import React from "react";
import { Briefcase, FileQuestion, MessageSquare, Clock } from "lucide-react";

// Main component for the Client Case Board page
const App = () => {
  // Mock data for the posted cases
  const postedCases = [
    {
      id: 1,
      title: "Dispute with Landlord over Security Deposit",
      description:
        "Client needs legal advice on how to proceed with a landlord who is unjustly withholding a security deposit. Communication has been documented.",
      clientName: "Alice Green",
      datePosted: "2 hours ago",
      legalArea: "Real Estate",
    },
    {
      id: 2,
      title: "Small Business Contract Review",
      description:
        "A new startup needs a lawyer to review a partnership agreement and a vendor contract to ensure they are legally sound.",
      clientName: "Bob White",
      datePosted: "5 hours ago",
      legalArea: "Corporate Law",
    },
    {
      id: 3,
      title: "Family Law: Child Custody Mediation",
      description:
        "A parent is seeking legal representation for a child custody dispute. Prefer a lawyer with experience in mediation.",
      clientName: "Charlie Black",
      datePosted: "1 day ago",
      legalArea: "Family Law",
    },
    {
      id: 4,
      title: "Personal Injury Claim after a Car Accident",
      description:
        "Seeking legal counsel for injuries sustained in a hit-and-run accident. Have police report and medical records.",
      clientName: "David Evans",
      datePosted: "2 days ago",
      legalArea: "Personal Injury",
    },
    {
      id: 5,
      title: "Intellectual Property Rights for a New Product",
      description:
        "Looking for a lawyer to help file for a patent and trademark for a new tech product.",
      clientName: "Fiona Chen",
      datePosted: "3 days ago",
      legalArea: "Intellectual Property",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 lg:p-8">
      {/* Header section */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center">
          <FileQuestion size={36} className="mr-3 text-blue-600" />
          Client Case Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Browse new legal cases posted by clients and find opportunities that
          match your expertise.
        </p>
      </div>

      {/* Grid of case cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postedCases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Briefcase className="text-gray-500" size={20} />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {caseItem.legalArea}
              </span>
            </div>
            <h2 className="font-bold text-xl mb-2">{caseItem.title}</h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 mb-4">
              {caseItem.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center">
                <MessageSquare size={16} className="mr-1" />
                <span>Posted by: {caseItem.clientName}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-1" />
                <span>{caseItem.datePosted}</span>
              </div>
            </div>
            <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
              View Full Case
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
