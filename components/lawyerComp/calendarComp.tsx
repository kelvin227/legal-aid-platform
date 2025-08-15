"use client";
import React, { useState } from "react";
import { ArrowLeft, Briefcase, Calendar as CalendarIcon } from "lucide-react";
import { createCourtHearing } from "@/actions/actions";
import { useRouter } from "next/navigation";

// Utility function to get the number of days in a month
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

// Utility function to get the first day of the month (0 for Sunday, 1 for Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

// Dummy data for upcoming hearings, with more varied dates
const dummyUpcomingHearings = [
  {
    id: 1,
    title: "Doe vs. Smith Hearing",
    date: new Date(2025, 7, 10),
    time: "10:00 AM",
    location: "Courtroom 3B",
  },
  {
    id: 2,
    title: "Jones vs. Miller Deposition",
    date: new Date(2025, 7, 15),
    time: "2:00 PM",
    location: "Conference Room A",
  },
  {
    id: 3,
    title: "Case Review with Partner",
    date: new Date(2025, 7, 15),
    time: "3:30 PM",
    location: "Partner's Office",
  },
  {
    id: 4,
    title: "Client Consultation",
    date: new Date(2025, 7, 22),
    time: "9:00 AM",
    location: "Zoom Call",
  },
  {
    id: 5,
    title: "File Deadline",
    date: new Date(2025, 8, 5),
    time: "5:00 PM",
    location: "N/A",
  },
  {
    id: 6,
    title: "Johnson vs. Williams Trial",
    date: new Date(2025, 8, 18),
    time: "9:30 AM",
    location: "Courtroom 7",
  },
  {
    id: 7,
    title: "Team Meeting",
    date: new Date(2025, 8, 20),
    time: "1:00 PM",
    location: "Virtual",
  },
];

type AddEventFormProps = {
  onCancel: () => void;
  onSave: (eventData: {
    title: string;
    time: string;
    location: string;
    date: Date;
  }) => void;
  selectedDate: Date;
};

const AddEventForm = ({
  onCancel,
  onSave,
  selectedDate,
}: AddEventFormProps) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave({
      title,
      time,
      location,
      date: selectedDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
        <CalendarIcon size={20} className="mr-2 text-blue-500" />
        Add New Event
      </h4>
      <div>
        <label className="block text-sm font-medium mb-1">Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Event
        </button>
      </div>
    </form>
  );
};

type AddCourtHearingFormProps = {
  onCancel: () => void;
  onSave: (eventData: {
    title: string;
    time: string;
    location: string;
    date: Date;
  }) => void;
  selectedDate: Date;
  cases: any;
};

const AddCourtHearingForm = ({
  onCancel,
  onSave,
  selectedDate,
  cases,
}: AddCourtHearingFormProps) => {
  const [caseNumber, setCaseNumber] = useState("");
  const [hearingType, setHearingType] = useState("");
  const [courtroom, setCourtroom] = useState("");
  const [time, setTime] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredCases = cases.filter((caseNumber: string) =>
    caseNumber.toLowerCase().includes(caseNumber.toLowerCase())
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const result = await createCourtHearing(
      caseNumber,
      selectedDate,
      time,
      courtroom,
      hearingType
    );
    if (result.success) {
      onSave({
        title: caseNumber,
        time,
        location: courtroom,
        date: selectedDate,
      });
    } else {
      console.error(result.message);
      alert(result.message); // Show error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
        <Briefcase size={20} className="mr-2 text-blue-500" />
        Add Court Hearing
      </h4>
      <div className="relative">
        <label className="block text-sm font-medium mb-1">Case number</label>
        <input
          type="text"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
        {showSuggestions && (
          <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 max-h-40 overflow-y-auto">
            {filteredCases.map((caseNumber: string) => (
              <div
                key={caseNumber}
                onMouseDown={() => {
                  setCaseNumber(caseNumber);
                  setShowSuggestions(false);
                }}
                className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {caseNumber}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Hearing Type</label>
        <input
          type="text"
          value={hearingType}
          onChange={(e) => setHearingType(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Courtroom</label>
        <input
          type="text"
          value={courtroom}
          onChange={(e) => setCourtroom(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Hearing
        </button>
      </div>
    </form>
  );
};

// The CalendarPage component
const CalendarPage = ({
  upcomingHearings,
  cases,
}: {
  upcomingHearings: any;
  cases: any;
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [formType, setFormType] = useState<string | null>(null); // State to manage which form to show

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  // Add blank days for the start of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`blank-${i}`} className="p-2"></div>);
  }

  // Add days of the month with events
  for (let i = 1; i <= daysInMonth; i++) {
    const hearingsOnDay = upcomingHearings.filter(
      (hearing: any) =>
        hearing.date.getFullYear() === year &&
        hearing.date.getMonth() === month &&
        hearing.date.getDate() === i
    );

    const isSelected =
      selectedDay &&
      selectedDay.getDate() === i &&
      selectedDay.getMonth() === month &&
      selectedDay.getFullYear() === year;

    days.push(
      <div
        key={`day-${i}`}
        onClick={() => {
          setSelectedDay(new Date(year, month, i));
          setFormType(null); // Reset form when a new day is selected
        }}
        className={`p-2 border border-gray-200 dark:border-gray-700 rounded-lg h-28 flex flex-col items-start cursor-pointer transition-colors duration-150 ${
          isSelected
            ? "bg-blue-200 dark:bg-blue-700"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <span className="font-bold text-gray-900 dark:text-gray-100">{i}</span>
        <div className="flex-1 mt-1 w-full overflow-y-auto space-y-1">
          {hearingsOnDay.map((hearing: any) => (
            <div
              key={hearing.id}
              className="bg-blue-500 text-white text-xs font-medium rounded-md px-2 py-1 truncate"
              title={`${hearing.title} at ${hearing.time}`}
            >
              {hearing.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handlePrevMonth = () => {
    setSelectedDay(null); // Clear selected day when changing months
    setFormType(null);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDay(null); // Clear selected day when changing months
    setFormType(null);
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDayHearings = selectedDay
    ? upcomingHearings.filter(
        (hearing: any) =>
          hearing.date.getFullYear() === selectedDay.getFullYear() &&
          hearing.date.getMonth() === selectedDay.getMonth() &&
          hearing.date.getDate() === selectedDay.getDate()
      )
    : [];

  const handleSave = (eventData: any) => {
    console.log("Saving new event:", eventData);
    setFormType(null); // Close the form after saving
    // In a real app, you would add this to the list of hearings and persist it.
  };

  const router = useRouter();

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-8 text-gray-900 dark:text-gray-100 font-sans">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Calendar
          </h2>
          <div></div>
        </div>
        {!selectedDay ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <h3 className="text-xl font-semibold">
                {currentDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mt-2">{days}</div>
          </>
        ) : (
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Events on {selectedDay.toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 font-medium transition-colors duration-200"
              >
                <div className="flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Calendar
                </div>
              </button>
            </div>

            {/* Conditional rendering for forms or event list */}
            {formType === "addEvent" ? (
              <AddEventForm
                onCancel={() => setFormType(null)}
                onSave={handleSave}
                selectedDate={selectedDay}
              />
            ) : formType === "addCourtHearing" ? (
              <AddCourtHearingForm
                onCancel={() => setFormType(null)}
                onSave={handleSave}
                selectedDate={selectedDay}
                cases={cases}
              />
            ) : (
              <>
                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={() => setFormType("addEvent")}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Event
                  </button>
                  <button
                    onClick={() => setFormType("addCourtHearing")}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Add Court Hearing
                  </button>
                </div>
                {selectedDayHearings.length > 0 ? (
                  <ul className="space-y-4">
                    {selectedDayHearings.map((hearing: any) => (
                      <li
                        key={hearing.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
                      >
                        <p className="text-lg font-semibold">{hearing.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Time:</span>{" "}
                          {hearing.time}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Location:</span>{" "}
                          {hearing.location}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-lg text-gray-500 dark:text-gray-400">
                    No events available on this day.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
