"use client";

import { useState, useEffect } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

// Conversation storage utility functions
const STORAGE_KEY = "mindly_chat_history";

function saveMessagesToStorage(messages) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }
}

function getMessagesFromStorage() {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error getting messages from storage:", error);
      return [];
    }
  }
  return [];
}

function clearMessagesFromStorage() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export default function ChatbotClient({ initialEmotionContext }) {
  // Menggunakan state untuk client hydration tracking
  const [isClient, setIsClient] = useState(false);
  const [emotionContext, setEmotionContext] = useState(initialEmotionContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Gunakan useEffect untuk sinkronisasi client-side
  useEffect(() => {
    // Tandai bahwa kita sekarang di client side
    setIsClient(true);

    // PERUBAHAN: Prioritaskan localStorage karena itu adalah pilihan user terbaru
    const storedEmotion = localStorage.getItem("emotion_context");

    // Log untuk debugging
    console.log("Emotion context priority:", {
      localStorage: storedEmotion,
      initialFromServer: initialEmotionContext,
    });

    if (storedEmotion) {
      // Gunakan nilai dari localStorage (pilihan user terbaru)
      setEmotionContext(storedEmotion);
      console.log("Using emotion from localStorage:", storedEmotion);
    } else if (initialEmotionContext) {
      // Jika tidak ada di localStorage, gunakan nilai dari server
      setEmotionContext(initialEmotionContext);
      // Simpan juga ke localStorage
      localStorage.setItem("emotion_context", initialEmotionContext);
      console.log("Using emotion from server:", initialEmotionContext);
    }

    // Cek apakah recap baru saja selesai
    const recapCompleted = localStorage.getItem("recap_completed") === "true";

    if (recapCompleted) {
      // Jika recap baru saja selesai, bersihkan chat
      clearMessagesFromStorage();
      // Hapus flag recap_completed
      localStorage.removeItem("recap_completed");
      console.log("Chat cleaned after recap completion");
    } else {
      // Jika tidak, coba dapatkan chat history
      const storedMessages = getMessagesFromStorage();
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      }
    }
  }, [initialEmotionContext]);

  // Function to update messages and save to storage
  const updateMessages = newMessages => {
    setMessages(newMessages);
    saveMessagesToStorage(newMessages);
  };

  const sendMessage = async e => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    updateMessages(newMessages);
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
        const updatedMessages = [...newMessages, { role: "assistant", content: data.reply }];
        updateMessages(updatedMessages);
      } else {
        console.log("Chat error:", data.error);
      }
    } catch (error) {
      console.log("Chat API error:", error);
      updateMessages([
        ...newMessages,
        { role: "error", content: "Failed to send message. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecap = async () => {
    if (messages.length < 2) {
      alert("Not enough conversation to generate a meaningful recap yet.");
      return;
    }

    try {
      setIsLoading(true);
      // Call your existing API endpoint that generates the recap
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
        // Simpan data untuk halaman recap
        localStorage.setItem("current_recap", data.summary);
        localStorage.setItem("emotion_context", emotionContext);

        console.log("Saved to localStorage before redirect:", {
          recapLength: data.summary.length,
          emotion: emotionContext,
        });

        // Navigate to the recap display page
        window.location.href = `/recap`;
      } else {
        console.log("Recap error:", data.error);
        alert("Unable to generate recap. Please try again later.");
      }
    } catch (error) {
      console.log("Error calling recap API:", error);
      alert("Error generating recap. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // Render welcome message jika masih di server atau belum ada pesan
  const showWelcomeMessage = !isClient || messages.length === 0;

  return (
    <div className="mobile-container w-full max-w-md flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-3 bg-white sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Mindly Chatbot</h1>
          {/* Hanya tampilkan emotionContext saat di client */}
          {isClient && emotionContext && (
            <p className="text-sm text-gray-600">Today&apos;s Emotion: {emotionContext}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleRecap}
            className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            disabled={!isClient || messages.length < 2 || isLoading}
          >
            Recap
          </button>
        </div>
      </header>

      {/* Messages Container */}
      <main className="flex-1 overflow-y-auto px-4 py-2 flex flex-col">
        {showWelcomeMessage ? (
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
