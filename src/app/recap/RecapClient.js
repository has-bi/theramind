"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecapClient() {
  const router = useRouter();

  // State untuk mengelola semua data dan UI state
  const [state, setState] = useState({
    recap: "",
    emotionContext: "",
    isSubmitting: false,
    showThanks: false,
    countdown: 5,
    isClientLoaded: false,
    isLoading: true,
  });

  // Helper untuk memudahkan update state
  const updateState = newState => {
    setState(prevState => ({ ...prevState, ...newState }));
  };

  // Single useEffect untuk client initialization
  useEffect(() => {
    try {
      const storedRecap = localStorage.getItem("current_recap") || "";
      const storedEmotion = localStorage.getItem("emotion_context") || "";

      console.log("Loading data from storage:", {
        recapLength: storedRecap ? storedRecap.length : 0,
        emotion: storedEmotion,
      });

      updateState({
        recap: storedRecap,
        emotionContext: storedEmotion,
        isClientLoaded: true,
        isLoading: false,
      });

      // Jika tidak ada data recap, kembali ke halaman chat
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

  // Handler untuk submit form
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
        // Hapus data sementara dari localStorage
        localStorage.removeItem("current_recap");

        // PENTING: Bersihkan chat history karena proses sudah selesai
        localStorage.removeItem("mindly_chat_history");

        console.log("Cleared chat history after successful journal save");

        // Tambahkan flag ke localStorage untuk menandai bahwa recap sudah selesai
        // (ini akan digunakan jika user kembali ke halaman chat)
        localStorage.setItem("recap_completed", "true");

        updateState({ showThanks: true });

        // Countdown dengan fungsi rekursif
        let countdownTimer;
        const startCountdown = count => {
          updateState({ countdown: count });

          if (count > 0) {
            countdownTimer = setTimeout(() => startCountdown(count - 1), 1000);
          } else {
            // PENTING: Redirect ke DASHBOARD setelah countdown selesai
            router.push("/dashboard");
          }
        };

        // Mulai countdown
        startCountdown(5);

        // Cleanup timer jika component unmounts
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

  // Tampilkan thank you page jika showThanks true
  if (state.showThanks) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
        <div className="max-w-md w-full text-center p-6 bg-indigo-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-2">Thank You!</h2>
          <p className="text-gray-700 mb-4">
            Your journal has been saved. We hope reflecting on your emotions helps you grow.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to dashboard in {state.countdown} seconds...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Conversation Recap</h1>
        {state.isClientLoaded && state.emotionContext && (
          <p className="text-sm text-gray-600">Today's Emotion: {state.emotionContext}</p>
        )}
      </header>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Journal Summary</h2>

          {/* Selalu tampilkan skeleton loading pada render server dan saat loading */}
          {!state.isClientLoaded || state.isLoading ? (
            <div className="py-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <p className="text-gray-700 whitespace-pre-line">{state.recap}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            state.isSubmitting ||
            state.isLoading ||
            !state.isClientLoaded ||
            !state.recap ||
            !state.emotionContext
          }
          className={`py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg 
            ${
              state.isSubmitting ||
              state.isLoading ||
              !state.isClientLoaded ||
              !state.recap ||
              !state.emotionContext
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
        >
          {state.isSubmitting ? "Saving..." : "Save Journal"}
        </button>
      </form>
    </div>
  );
}
