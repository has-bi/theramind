"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Avatar from "boring-avatars";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [emotionContext, setEmotionContext] = useState(initialEmotionContext);
  const [emotionId, setEmotionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState("user");
  const messagesEndRef = useRef(null);
  const [hasJournalEntry, setHasJournalEntry] = useState(false);

  // Map emotions to their color classes
  const emotionColors = {
    Happy: {
      bg: "bg-mood-happy-light",
      text: "text-gray-800",
      border: "border-mood-happy",
      iconBg: "bg-mood-happy",
    },
    Sad: {
      bg: "bg-mood-sad-light",
      text: "text-gray-800",
      border: "border-mood-sad",
      iconBg: "bg-mood-sad",
    },
    Calm: {
      bg: "bg-mood-calm-light",
      text: "text-gray-800",
      border: "border-mood-calm",
      iconBg: "bg-mood-calm",
    },
    Angry: {
      bg: "bg-mood-angry-light",
      text: "text-gray-800",
      border: "border-mood-angry",
      iconBg: "bg-mood-angry",
    },
    Anxious: {
      bg: "bg-mood-anxious-light",
      text: "text-gray-800",
      border: "border-mood-anxious",
      iconBg: "bg-mood-anxious",
    },
    Neutral: {
      bg: "bg-mood-neutral-light",
      text: "text-gray-800",
      border: "border-mood-neutral",
      iconBg: "bg-mood-neutral",
    },
    Stressed: {
      bg: "bg-mood-stressed-light",
      text: "text-gray-800",
      border: "border-mood-stressed",
      iconBg: "bg-mood-stressed",
    },
    Excited: {
      bg: "bg-mood-excited-light",
      text: "text-gray-800",
      border: "border-mood-excited",
      iconBg: "bg-mood-excited",
    },
    Tired: {
      bg: "bg-mood-tired-light",
      text: "text-gray-800",
      border: "border-mood-tired",
      iconBg: "bg-mood-tired",
    },
    Confused: {
      bg: "bg-mood-confused-light",
      text: "text-gray-800",
      border: "border-mood-confused",
      iconBg: "bg-mood-confused",
    },
    Grateful: {
      bg: "bg-mood-grateful-light",
      text: "text-gray-800",
      border: "border-mood-grateful",
      iconBg: "bg-mood-grateful",
    },
    Loved: {
      bg: "bg-mood-loved-light",
      text: "text-gray-800",
      border: "border-mood-loved",
      iconBg: "bg-mood-loved",
    },
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Client-side synchronization
  useEffect(() => {
    setIsClient(true);

    // Get user password if available for avatar generation
    if (typeof window !== "undefined") {
      const storedPassword = localStorage.getItem("user_password");
      if (storedPassword) {
        setAvatarSeed(storedPassword);
      } else {
        // If no password is found, use email or a default value
        const userEmail = localStorage.getItem("user_email") || "user@example.com";
        setAvatarSeed(userEmail);
      }

      // Check if a journal entry exists for today
      const hasJournal = localStorage.getItem("has_journal_entry") === "true";
      setHasJournalEntry(hasJournal);

      // If we already have a journal entry, redirect to dashboard
      if (hasJournal) {
        router.push("/");
        return;
      }
    }

    // Prioritize server-side emotion context over localStorage
    // This is important because the server knows the correct current day's mood
    if (initialEmotionContext) {
      setEmotionContext(initialEmotionContext);
      localStorage.setItem("emotion_context", initialEmotionContext);
    } else {
      // Fall back to localStorage only if server doesn't provide a value
      const storedEmotion = localStorage.getItem("emotion_context");
      const storedEmotionId = localStorage.getItem("emotion_id");

      if (storedEmotion) {
        setEmotionContext(storedEmotion);
        if (storedEmotionId) {
          setEmotionId(storedEmotionId);
        }
      }
    }

    // Check if recap was just completed
    const recapCompleted = localStorage.getItem("recap_completed") === "true";

    if (recapCompleted) {
      clearMessagesFromStorage();
      localStorage.removeItem("recap_completed");

      // Add a welcome back message after recap
      const welcomeBackMsg = {
        role: "assistant",
        content:
          "Welcome back! I've created a recap of our previous conversation. What would you like to talk about now?",
      };
      setMessages([welcomeBackMsg]);
      saveMessagesToStorage([welcomeBackMsg]);
    } else {
      // Try to get chat history
      const storedMessages = getMessagesFromStorage();
      if (storedMessages.length > 0) {
        setMessages(storedMessages);
      } else {
        // Add welcome message for new conversations with the correct emotion
        const emotionToUse =
          initialEmotionContext || localStorage.getItem("emotion_context") || "a certain way";

        const welcomeMsg = {
          role: "assistant",
          content: `Hi there! I see you're feeling ${emotionToUse} today. How can I help you with that?`,
        };
        setMessages([welcomeMsg]);
        saveMessagesToStorage([welcomeMsg]);
      }
    }
  }, [initialEmotionContext, router]);

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

      if (!res.ok) {
        const errorData = await res.json();

        // If user has already completed their journal for today, reload page
        if (res.status === 403 && errorData.error.includes("already completed")) {
          localStorage.setItem("has_journal_entry", "true");
          router.push("/");
          return;
        }

        throw new Error(errorData.error || "Failed to send message");
      }

      const data = await res.json();
      const updatedMessages = [...newMessages, { role: "assistant", content: data.reply }];
      updateMessages(updatedMessages);
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate recap");
      }

      const data = await res.json();

      // Save data for recap page
      localStorage.setItem("current_recap", data.summary);
      localStorage.setItem("emotion_context", emotionContext);
      localStorage.setItem("has_journal_entry", "true");

      // Navigate to the recap display page
      router.push("/recap");
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

  // Get current emotion colors or default to neutral
  const currentEmotionColors = emotionColors[emotionContext] || emotionColors["Neutral"];

  // Get emotion image path
  const getEmotionImagePath = emotion => {
    return `/images/emotions/${emotion?.toLowerCase() || "neutral"}.png`;
  };

  return (
    <div className="mobile-container bg-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-xl ${currentEmotionColors.iconBg} flex items-center justify-center mr-3 shadow-sm`}
            >
              {emotionContext && (
                <Image
                  src={getEmotionImagePath(emotionContext)}
                  alt={emotionContext}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Theramind</h1>
              {isClient && emotionContext && (
                <p className="text-xs text-gray-500">Feeling {emotionContext.toLowerCase()}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleRecap}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isClient || messages.length < 2 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            }`}
            disabled={!isClient || messages.length < 2 || isLoading}
          >
            Summary
          </button>
        </div>
      </header>

      {/* Main chat container with messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3 pb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role !== "user" && (
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 self-end mb-1">
                  <div
                    className={`w-full h-full ${currentEmotionColors.iconBg} flex items-center justify-center`}
                  >
                    <Image
                      src={getEmotionImagePath(emotionContext)}
                      alt={emotionContext || "Bot"}
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <div
                className={`max-w-xs px-4 py-3 shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                    : msg.role === "error"
                    ? "bg-mood-angry-light text-gray-800 border border-mood-angry rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                    : `${currentEmotionColors.bg} ${currentEmotionColors.text} border ${currentEmotionColors.border} rounded-tl-2xl rounded-tr-2xl rounded-br-2xl`
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full overflow-hidden ml-2 flex-shrink-0 self-end mb-1">
                  <Avatar size={32} name={avatarSeed} variant="beam" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0 self-end mb-1">
                <div
                  className={`w-full h-full ${currentEmotionColors.iconBg} flex items-center justify-center`}
                >
                  <Image
                    src={getEmotionImagePath(emotionContext)}
                    alt={emotionContext || "Bot"}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
              </div>
              <div
                className={`${currentEmotionColors.bg} ${currentEmotionColors.text} border ${currentEmotionColors.border} rounded-tl-2xl rounded-tr-2xl rounded-br-2xl px-4 py-3 shadow-sm`}
              >
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Section as part of the main container */}
      <div className="bg-white border-t border-gray-100 px-4 py-3">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 transition-all text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${
              !input.trim() || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
