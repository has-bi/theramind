"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RecapClient() {
  const router = useRouter();

  // State management
  const [state, setState] = useState({
    recap: "",
    emotionContext: "",
    emotionId: "",
    isSubmitting: false,
    showThanks: false,
    countdown: 5,
    isClientLoaded: false,
    isLoading: true,
  });

  // Helper for updating state
  const updateState = newState => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

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

  // Get emotion image path
  const getEmotionImagePath = emotion => {
    return `/images/emotions/${emotion?.toLowerCase() || "neutral"}.png`;
  };

  // Client-side initialization
  useEffect(() => {
    try {
      const storedRecap = localStorage.getItem("current_recap") || "";
      const storedEmotion = localStorage.getItem("emotion_context") || "";
      const storedEmotionId = localStorage.getItem("emotion_id") || "";

      console.log("Loading data from storage:", {
        recapLength: storedRecap ? storedRecap.length : 0,
        emotion: storedEmotion,
        emotionId: storedEmotionId,
      });

      updateState({
        recap: storedRecap,
        emotionContext: storedEmotion,
        emotionId: storedEmotionId,
        isClientLoaded: true,
        isLoading: false,
      });

      // Redirect to chat if no recap data
      if (!storedRecap) {
        console.log("Missing recap data, redirecting to /chat");
        setTimeout(() => {
          router.push("/chat");
        }, 1000);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      updateState({ isLoading: false, isClientLoaded: true });
    }
  }, [router]);

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault();
    const { recap, emotionContext } = state;

    if (!recap || !emotionContext) {
      alert("Missing recap or emotion data. Please return to chat and try again.");
      return;
    }

    updateState({ isSubmitting: true });

    try {
      const response = await fetch("/api/journal-save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recap,
          emotionContext,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Clean up localStorage
        localStorage.removeItem("current_recap");
        localStorage.removeItem("mindly_chat_history");
        console.log("Cleared chat history after successful journal save");

        // Set flag for completed recap
        localStorage.setItem("recap_completed", "true");

        updateState({ showThanks: true });

        // Start countdown
        let countdownTimer;
        const startCountdown = count => {
          updateState({ countdown: count });

          if (count > 0) {
            countdownTimer = setTimeout(() => startCountdown(count - 1), 1000);
          } else {
            router.push("/dashboard");
          }
        };

        startCountdown(5);

        // Cleanup timer
        return () => {
          if (countdownTimer) clearTimeout(countdownTimer);
        };
      } else {
        alert(data.error || "Failed to save journal. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting recap:", error);
      alert("Error saving journal. Please try again.");
    } finally {
      updateState({ isSubmitting: false });
    }
  };

  // Get current emotion colors or default to neutral
  const currentEmotionColors = emotionColors[state.emotionContext] || emotionColors["Neutral"];

  // Thank you page
  if (state.showThanks) {
    return (
      <div className="mobile-container bg-gray-50 min-h-screen flex flex-col items-center justify-center p-6">
        <div
          className={`w-full max-w-md ${currentEmotionColors.bg} rounded-2xl shadow-md p-6 border ${currentEmotionColors.border}`}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full ${currentEmotionColors.iconBg} flex items-center justify-center`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h2>
            <p className="text-gray-700 mb-6">
              Your journal has been saved. We hope reflecting on your emotions helps you grow.
            </p>
            <div className={`w-full bg-white bg-opacity-50 rounded-full h-2 mb-2`}>
              <div
                className={`h-2 rounded-full ${currentEmotionColors.iconBg} transition-all duration-1000 ease-linear`}
                style={{ width: `${(state.countdown / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Redirecting to dashboard in {state.countdown} seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
        <div className="flex items-center">
          <div
            className={`w-10 h-10 rounded-xl ${currentEmotionColors.iconBg} flex items-center justify-center mr-3 shadow-sm`}
          >
            {state.emotionContext && state.isClientLoaded && (
              <Image
                src={getEmotionImagePath(state.emotionContext)}
                alt={state.emotionContext}
                width={24}
                height={24}
                className="object-contain"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Journal Entry</h1>
            {state.isClientLoaded && state.emotionContext && (
              <p className="text-xs text-gray-500">
                Based on your {state.emotionContext.toLowerCase()} mood
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="page-container pb-safe">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Journal content with emotion-based styling */}
          <div
            className={`${currentEmotionColors.bg} rounded-2xl p-5 shadow-sm border ${currentEmotionColors.border} mb-6 flex-1`}
          >
            <div className="flex items-center mb-4">
              <div
                className={`w-10 h-10 rounded-full ${currentEmotionColors.iconBg} flex items-center justify-center mr-3`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-800">Your Conversation Summary</h2>
            </div>

            {/* Skeleton loading or content */}
            {!state.isClientLoaded || state.isLoading ? (
              <div className="py-3 space-y-3">
                <div className="h-4 bg-white bg-opacity-50 rounded animate-pulse mb-2 w-3/4"></div>
                <div className="h-4 bg-white bg-opacity-50 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-white bg-opacity-50 rounded animate-pulse mb-2 w-5/6"></div>
                <div className="h-4 bg-white bg-opacity-50 rounded animate-pulse w-1/2"></div>
              </div>
            ) : (
              <div className="p-4 bg-white bg-opacity-60 backdrop-blur-sm rounded-xl">
                <p className="text-gray-700 whitespace-pre-line">{state.recap}</p>
              </div>
            )}
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-start">
              <div className="p-2 rounded-full bg-indigo-50 mr-3 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-indigo-500"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  This summary was created based on your chat conversation. Saving it will help you
                  track your emotional journey over time.
                </p>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={
              state.isSubmitting ||
              state.isLoading ||
              !state.isClientLoaded ||
              !state.recap ||
              !state.emotionContext
            }
            className={`py-3 px-4 font-medium rounded-xl transition-colors shadow-sm
              ${
                state.isSubmitting ||
                state.isLoading ||
                !state.isClientLoaded ||
                !state.recap ||
                !state.emotionContext
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : `${currentEmotionColors.iconBg} text-white hover:opacity-90`
              }`}
          >
            {state.isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Journal Entry"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
