"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  FormEvent,
} from "react";
import {
  Briefcase,
  MessageSquare,
  Send,
  Paperclip,
  CheckCircle,
} from "lucide-react";

type Msg = { id: number; sender: string; text: string };

const App = () => {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      sender: "Lawyer",
      text: "Hello Alice, I have reviewed your case details and have a few follow-up questions. How are you today?",
    },
    {
      id: 2,
      sender: "Client",
      text: "Hi, I'm doing well, thank you. I'm ready to answer any questions you have.",
    },
    {
      id: 3,
      sender: "Lawyer",
      text: "Great. Can you please send me a copy of the original rental agreement and any written communication with your landlord?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Refs for measurement + scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null); // chat column container
  const headerRef = useRef<HTMLDivElement | null>(null); // header inside chat column
  const messagesRef = useRef<HTMLDivElement | null>(null); // scrollable messages div
  const inputBarRef = useRef<HTMLFormElement | null>(null); // the fixed input bar
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // layout states
  const [inputPos, setInputPos] = useState<{
    left: number | null;
    width: number | null;
  }>({
    left: null,
    width: null,
  });
  const [messagesHeight, setMessagesHeight] = useState<number | null>(null);

  // Auto-scroll messages container (not the whole page)
  useEffect(() => {
    // Small timeout to ensure DOM updated
    const t = setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // fallback
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 30);
    return () => clearTimeout(t);
  }, [messages]);

  // Measure chat column and compute input position & messages height
  useLayoutEffect(() => {
    const updateLayout = () => {
      const chatRect = chatContainerRef.current?.getBoundingClientRect();
      if (!chatRect) return;

      // Measure header and input heights if available
      const headerH = headerRef.current?.offsetHeight ?? 0;
      const inputH = inputBarRef.current?.offsetHeight ?? 64; // fallback

      // Left offset & width to align fixed input to chat column
      const left = Math.round(chatRect.left);
      const width = Math.round(chatRect.width);

      // Compute messages available height: viewportHeight - chatTop - header - input - some gap
      const gap = 24; // extra spacing
      const available = Math.max(
        120,
        window.innerHeight - chatRect.top - headerH - inputH - gap
      );

      setInputPos({ left, width });
      setMessagesHeight(available);
    };

    // run once synchronously after mount before paint
    updateLayout();

    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    return () => {
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
    };
  }, []);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    const newMsg: Msg = {
      id: messages.length + 1,
      sender: "Client",
      text: newMessage,
    };
    setMessages((m) => [...m, newMsg]);
    setNewMessage("");
  };

  // Mock client case (kept from your original)
  const clientCase = {
    title: "Dispute with Landlord over Security Deposit",
    status: "In Progress",
    lastUpdate: "2 hours ago",
    lawyer: "Jessica Pearson, Esq.",
    legalArea: "Real Estate",
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
      {/* Case Overview Section */}
      <div className="lg:w-1/3 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col">
        <h1 className="text-3xl font-bold mb-4 flex items-center">
          <Briefcase size={28} className="mr-3 text-blue-600" />
          My Case
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold">{clientCase.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {clientCase.legalArea}
            </p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Status
            </p>
            <div className="flex items-center mt-1">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span className="font-semibold">{clientCase.status}</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Your Lawyer
            </p>
            <p className="font-semibold mt-1">{clientCase.lawyer}</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Update
            </p>
            <p className="font-semibold mt-1">{clientCase.lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col min-h-0">
        <h2 className="text-2xl font-bold mb-4 border-b pb-4 border-gray-200 dark:border-gray-700 flex items-center">
          <MessageSquare size={24} className="mr-2 text-blue-600" />
          Case Chat
        </h2>

        {/* Message history */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 mb-4 min-h-0 max-h-[70svh]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "Client" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${
                  msg.sender === "Client"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <p className="font-bold text-xs mb-1">
                  {msg.sender === "Client" ? "You" : msg.sender}
                </p>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Message input form */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-shadow duration-200"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
