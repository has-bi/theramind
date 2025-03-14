"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { formatUTC7Date } from "@/utils/dateTime";

export default function PageDetails({ isOpen, onClose, date, moodData }) {
  const [mounted, setMounted] = useState(false);

  // Mount check for client-side rendering
  useEffect(() => {
    setMounted(true);

    // Add event listener to close modal on escape key
    const handleEscape = e => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

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

  // Get emotion name, ensuring it's a string
  const emotionName = moodData?.emotionName || "Neutral";

  // Get emotion image path
  const getEmotionImagePath = emotion => {
    // Ensure emotion is a string
    const emotionStr = typeof emotion === "string" ? emotion : "neutral";
    return `/images/emotions/${emotionStr.toLowerCase()}.png`;
  };

  // Format the date for display
  const formattedDate = date ? formatUTC7Date(new Date(date)) : "";

  // Get emotion colors
  const currentEmotionColors = emotionColors[emotionName] || emotionColors["Neutral"];

  // Return null during SSR or if modal is closed
  if (!mounted || !isOpen) return null;

  // Use createPortal to render modal outside of component hierarchy
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm transition-all duration-200"
      onClick={e => {
        // Close modal when clicking the backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-lg transition-transform duration-200 transform scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal content */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">Mood Details</h2>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>

        {/* Mood info */}
        <div
          className={`${currentEmotionColors.bg} p-4 rounded-xl mb-4 ${currentEmotionColors.border}`}
        >
          <div className="flex items-center">
            <div
              className={`h-12 w-12 ${currentEmotionColors.iconBg} rounded-full flex items-center justify-center mr-3`}
            >
              <Image
                src={getEmotionImagePath(emotionName)}
                alt={emotionName || "Mood"}
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500">You were feeling</p>
              <p className="text-lg font-semibold text-gray-800 capitalize">{emotionName}</p>
            </div>
          </div>
        </div>

        {/* Journal recap if available */}
        {moodData?.recap && moodData.recap !== "No recap available" && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-700 mb-2">Journal Entry</h3>
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm max-h-60 overflow-y-auto">
              <p className="whitespace-pre-line">{moodData.recap}</p>
            </div>
          </div>
        )}

        {/* Created at time */}
        <div className="text-xs text-gray-500 mt-4">
          Recorded at {new Date(moodData.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>,
    document.body
  );
}
