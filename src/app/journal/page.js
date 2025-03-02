"use client";

<<<<<<< HEAD
<<<<<<< HEAD
import { useState, useRef } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
=======
import { useState } from "react";
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
import { useState, useRef } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)

export default function Journal() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
<<<<<<< HEAD
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
=======

  const sendMessage = async (e) => {
    if (!input.trim()) return;
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
<<<<<<< HEAD
<<<<<<< HEAD
    setIsLoading(true);
=======
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
    setIsLoading(true);
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        console.log(data.error);
      }
    } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
      setMessages([
        ...newMessages,
        { role: "error", content: "Failed to send message. Please try again." },
      ]);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage;
<<<<<<< HEAD
=======
      console.log(error);
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
    <div className="mobile-container w-full max-w-md flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-3  bg-white sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-800">Daily Journal</h1>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-2 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500 mb-4">
                Welcome to your personal journal
              </p>
              <p className="text-sm text-gray-400">
                Start writing your thoughts below
              </p>
<<<<<<< HEAD
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4 mt-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
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
=======
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Journal</h1>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-900"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
        <div className="mt-4 flex text-gray-800">
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4 mt-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
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
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
            onKeyDown={handleKeyDown}
            placeholder="Write your thoughts..."
            className={`input-field pr-12 ${isLoading ? "input-disabled" : ""}`}
            disabled={isLoading}
<<<<<<< HEAD
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
=======
            placeholder="Type your message..."
            className="flex-1 p-2 border-gray-300 rounded-l"
=======
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
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
<<<<<<< HEAD
        </div>
      </div>
>>>>>>> 9b3e887 (feat: Implement interactive chatbot)
=======
        </form>
      </footer>
>>>>>>> 3a1e37e (feat: add styling for interactive chatbot to have chat input, chat bubble, and add icons)
    </div>
  );
}
