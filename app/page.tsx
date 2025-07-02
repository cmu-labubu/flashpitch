"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("Climate Change");
  const [examples, setExamples] = useState(
    "1. Rising global temperatures\n2. Melting polar ice caps\n3. Increased frequency of extreme weather events"
  );
  const [userInput, setUserInput] = useState("");
  const [polishedText, setPolishedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert("Please enter some text to polish.");
      return;
    }

    const data = { topic, examples, userInput };
    setIsLoading(true);
    setPolishedText("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setPolishedText(result.data.polishedText);
      } else {
        const errorData = await response.json();
        alert(`Failed to polish text: ${errorData.error || "Please try again."}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Write About a Topic</h1>

      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium mb-2">Topic</label>
        <textarea
          className="w-full p-2 border rounded"
          value={topic}
          readOnly
        />
      </div>

      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium mb-2">Examples</label>
        <textarea
          className="w-full p-2 border rounded"
          value={examples}
          readOnly
        />
      </div>

      <div className="w-full max-w-md mb-4">
        <label className="block text-sm font-medium mb-2">Your Paragraph</label>
        <textarea
          className="w-full p-2 border rounded"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Write your paragraph here..."
        />
      </div>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Polishing..." : "Polish Text"}
      </button>

      {polishedText && (
        <div className="w-full max-w-md mt-6">
          <label className="block text-sm font-medium mb-2">Polished Text</label>
          <div className="w-full p-4 border rounded bg-gray-800 text-white whitespace-pre-wrap shadow-lg">
            {polishedText}
          </div>
        </div>
      )}
    </div>
  );
}
