// /app/recap/RecapClient.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Since we can't avoid useEffect to fix this particular hydration issue, we'll use it minimally
export default function RecapClient() {
  const router = useRouter();

  // Start with empty data on both server and client
  const [recap, setRecap] = useState("");
  const [emotionContext, setEmotionContext] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  // Use a minimal useEffect just to handle the localStorage access
  useEffect(() => {
    // Only access localStorage on the client
    const storedRecap = localStorage.getItem("current_recap") || "";
    const storedEmotion = localStorage.getItem("emotion_context") || "";

    setRecap(storedRecap);
    setEmotionContext(storedEmotion);
    setIsLoading(false);

    if (!storedRecap || !storedEmotion) {
      router.push("/chat");
    }
  }, [router]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!recap || !emotionContext) {
      alert("Missing recap or emotion data. Please return to chat and try again.");
      return;
    }

    setIsSubmitting(true);

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
        setShowThanks(true);

        localStorage.removeItem("current_recap");
        localStorage.removeItem("emotion_context");

        let count = 5;
        const countdownInterval = setInterval(() => {
          count--;
          setCountdown(count);

          if (count <= 0) {
            clearInterval(countdownInterval);
            router.push("/dashboard");
          }
        }, 1000);

        return () => clearInterval(countdownInterval);
      } else {
        alert(data.error || "Failed to save journal. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting recap:", error);
      alert("Error saving journal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showThanks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="max-w-md w-full text-center p-6 bg-indigo-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Thank You!</h2>
          <p className="text-gray-700 mb-4">
            Your journal has been saved. We hope reflecting on your emotions helps you grow.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to dashboard in {countdown} seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Conversation Recap</h1>
        {emotionContext && (
          <p className="text-sm text-gray-600">Today's Emotion: {emotionContext}</p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Journal Summary</h2>
          {isLoading ? (
            <div className="py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{recap}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading || !recap || !emotionContext}
          className={`py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg 
            ${
              isSubmitting || isLoading || !recap || !emotionContext
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
        >
          {isSubmitting ? "Saving..." : "Save Journal"}
        </button>
      </form>
    </div>
  );
}
