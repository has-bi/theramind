"use client";

import React from "react";
import { useState } from "react";
import { createMoodAction } from "./mood-Action";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const EmojiForm = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  const emotions = [
    {
      id: 1,
      label: "Happy",
      imagePath: "/images/emotions/happy.png",
      value: "Happy",
      colorClass: "bg-mood-happy",
    },
    {
      id: 2,
      label: "Sad",
      imagePath: "/images/emotions/sad.png",
      value: "Sad",
      colorClass: "bg-mood-sad",
    },
    {
      id: 3,
      label: "Calm",
      imagePath: "/images/emotions/calm.png",
      value: "Calm",
      colorClass: "bg-mood-calm",
    },
    {
      id: 4,
      label: "Angry",
      imagePath: "/images/emotions/angry.png",
      value: "Angry",
      colorClass: "bg-mood-angry",
    },
    {
      id: 5,
      label: "Anxious",
      imagePath: "/images/emotions/anxious.png",
      value: "Anxious",
      colorClass: "bg-mood-anxious",
    },
    {
      id: 6,
      label: "Neutral",
      imagePath: "/images/emotions/neutral.png",
      value: "Neutral",
      colorClass: "bg-mood-neutral",
    },
    {
      id: 7,
      label: "Stressed",
      imagePath: "/images/emotions/stressed.png",
      value: "Stressed",
      colorClass: "bg-mood-stressed",
    },
    {
      id: 8,
      label: "Excited",
      imagePath: "/images/emotions/excited.png",
      value: "Excited",
      colorClass: "bg-mood-excited",
    },
    {
      id: 9,
      label: "Tired",
      imagePath: "/images/emotions/tired.png",
      value: "Tired",
      colorClass: "bg-mood-tired",
    },
    {
      id: 10,
      label: "Confused",
      imagePath: "/images/emotions/confused.png",
      value: "Confused",
      colorClass: "bg-mood-confused",
    },
    {
      id: 12,
      label: "Grateful",
      imagePath: "/images/emotions/grateful.png",
      value: "Grateful",
      colorClass: "bg-mood-grateful",
    },
    {
      id: 11,
      label: "Loved",
      imagePath: "/images/emotions/loved.png",
      value: "Loved",
      colorClass: "bg-mood-loved",
    },
  ];

  const handleEmotionClick = emotion => {
    setSelectedEmotion(emotion);
    setFormError(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedEmotion) {
      setFormError("Please select an emotion first");
      return;
    }

    try {
      setPending(true);

      // Create FormData
      const formData = new FormData();
      formData.append("emotionId", selectedEmotion.id);
      formData.append("label", selectedEmotion.label);
      formData.append("imagePath", selectedEmotion.imagePath);
      formData.append("value", selectedEmotion.value);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("emotion_context", selectedEmotion.value);
        localStorage.setItem("emotion_id", selectedEmotion.id);
      }

      // Call server action
      const result = await createMoodAction(null, formData);

      if (result?.success) {
        router.push("/chat");
      } else if (result?.alreadySubmitted) {
        // Handle the case where user has already submitted a mood today
        router.push("/mood"); // The page will now show "already submitted" UI
      } else if (result?.error) {
        setFormError(result.error || "Failed to save your emotion");
      } else {
        router.push("/chat");
      }
    } catch (error) {
      setFormError(error.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mobile-container bg-white min-h-screen pb-20 relative">
      {/* Header */}
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Mood Check-in</h1>
            <p className="text-xs text-gray-500">How are you feeling today?</p>
          </div>
        </div>
      </header>

      <div className="page-container mb-32">
        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-mood-angry-light border border-mood-angry flex items-start">
            <div className="p-1 rounded-full bg-mood-angry mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {emotions.map(emotion => (
              <div
                key={emotion.id}
                className="flex flex-col items-center"
                onClick={() => handleEmotionClick(emotion)}
              >
                <div
                  className={`w-20 h-20 aspect-square rounded-2xl overflow-hidden shadow-sm transition-all duration-200 cursor-pointer
                    ${emotion.colorClass} 
                    ${
                      selectedEmotion?.id === emotion.id
                        ? "ring-3 ring-indigo-500 transform scale-105 shadow-md"
                        : "hover:shadow-md hover:scale-102"
                    }`}
                >
                  <div className="flex items-center justify-center h-full p-1 relative">
                    <Image
                      src={emotion.imagePath}
                      alt={emotion.label}
                      width={95}
                      height={95}
                      className="object-contain"
                      priority={emotion.id <= 6}
                    />

                    {/* Selection indicator */}
                    {selectedEmotion?.id === emotion.id && (
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-3 h-3 text-indigo-600"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium mt-2 transition-colors ${
                    selectedEmotion?.id === emotion.id ? "text-indigo-600" : "text-gray-600"
                  }`}
                >
                  {emotion.label}
                </span>
              </div>
            ))}
          </div>
        </form>

        {/* Show selected emotion in larger view */}
        {selectedEmotion && (
          <div className="mb-16 bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center z-10 border border-gray-100 max-w-full">
            <div
              className={`w-18 h-18 ${selectedEmotion.colorClass} rounded-full flex items-center justify-center mb-2`}
            >
              <Image
                src={selectedEmotion.imagePath}
                alt={selectedEmotion.label}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-800">
              You selected <span className="font-semibold">{selectedEmotion.label}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tap 'I'm feeling {selectedEmotion.label}' to continue
            </p>
          </div>
        )}
      </div>

      {/* Fixed button that stays within the mobile container */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-20">
        <div className="w-full max-w-md px-4 py-4 pb-safe bg-white border-t border-gray-100">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!selectedEmotion || pending}
            className={`w-full py-3 px-4 font-medium rounded-xl transition-colors ${
              !selectedEmotion
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : selectedEmotion
                ? `${selectedEmotion.colorClass} text-gray-800 hover:opacity-90`
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {pending
              ? "Submitting..."
              : selectedEmotion
              ? `I'm feeling ${selectedEmotion.label}`
              : "Select a mood"}
          </button>
        </div>
      </div>
    </div>
  );
};
