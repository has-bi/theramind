// app/chatbot/ChatbotClient.js (Client Component)
"use client";

import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default function ChatbotClient({ initialEmotionContext }) {
  // Initialize emotion context state with the value passed from the server.
  const [emotionContext] = useState(initialEmotionContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recapSummary, setRecapSummary] = useState("");

  const sendMessage = async e => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          emotionContext,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      } else {
        console.log("Chat error:", data.error);
      }
    } catch (error) {
      console.log("Chat API error:", error);
      setMessages([
        ...newMessages,
        { role: "error", content: "Failed to send message. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecap = async () => {
    try {
      const res = await fetch("/api/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          messages,
          emotionContext,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecapSummary(data.summary);
      } else {
        console.log("Recap error:", data.error);
      }
    } catch (error) {
      console.log("Error calling recap API:", error);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className="mobile-container w-full max-w-md flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-3 bg-white sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-800">Mindly Chatbot</h1>
        {emotionContext && (
          <p className="text-sm text-gray-600">Today's Emotion: {emotionContext}</p>
        )}
        <button
          onClick={handleRecap}
          className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
          disabled={messages.length === 0 || isLoading}
        >
          Recap
        </button>
      </header>

      {/* Recap Summary Display */}
      {recapSummary && (
        <div className="bg-gray-100 p-4 text-gray-800 text-sm">
          <h2 className="font-semibold mb-2">Recap Summary</h2>
          <p>{recapSummary}</p>
        </div>
      )}

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-2 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500 mb-4">Welcome to your personal chat</p>
              <p className="text-sm text-gray-400">Start your conversation below</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4 mt-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-indigo-700 text-white rounded-tr-none"
                      : msg.role === "error"
                      ? "bg-red-100 text-red-800 rounded-tl-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl rounded-tl-none px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Input Section */}
      <footer className="border-t border-gray-100 p-4 bg-white">
        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your thoughts..."
            className={`input-field pr-12 ${isLoading ? "input-disabled" : ""}`}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-indigo-700 hover:text-indigo-900 ${
              !input.trim() || isLoading ? "opacity-50" : ""
            }`}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <ArrowUpCircleIcon className="size-6 text-indigo-500" />
          </button>
        </form>
      </footer>
    </div>
  );
}
