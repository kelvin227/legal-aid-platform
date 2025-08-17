"use client";
import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";

const App = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Function to update content and word count
  const handleInput = () => {
    const text = editorRef.current?.innerText || "";
    const words = text.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  };

  // Function to apply formatting
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Function to generate and download PDF
  const handleDownloadPDF = () => {
    import("jspdf")
      .then(({ jsPDF }) => {
        const content = editorRef.current?.innerText || "";

        const doc = new jsPDF();
        const lines = doc.splitTextToSize(content, 180);

        doc.text(lines, 10, 10);
        doc.save("document.pdf");
      })
      .catch((error) => {
        console.error("Error loading jsPDF:", error);
        alert("Could not download PDF. Please try again.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans p-4 lg:p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col">
        {/* Page Header */}
        <div className="mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-bold flex items-center">
            <FileText size={28} className="mr-3 text-blue-600" />
            Create and Download Document
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Write your document below and download it as a PDF.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center space-x-2 space-y-2 mb-4 p-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleFormat("bold")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Bold size={20} />
          </button>
          <button
            onClick={() => handleFormat("italic")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Italic size={20} />
          </button>
          <button
            onClick={() => handleFormat("insertUnorderedList")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => handleFormat("insertOrderedList")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ListOrdered size={20} />
          </button>
          <button
            onClick={() => handleFormat("formatBlock", "H1")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Heading1 size={20} />
          </button>
          <button
            onClick={() => handleFormat("formatBlock", "H2")}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <Heading2 size={20} />
          </button>
        </div>

        {/* Document Editor */}
        <div
          ref={editorRef}
          onInput={handleInput}
          contentEditable={true}
          className="flex-1 w-full h-80 p-4 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition overflow-y-auto"
          style={{ whiteSpace: "pre-wrap" }}
        />

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
            Word Count: <span className="font-semibold">{wordCount}</span>
          </div>
          <button
            onClick={handleDownloadPDF}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md flex items-center justify-center space-x-2"
          >
            <Download size={20} />
            <span>Download as PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
