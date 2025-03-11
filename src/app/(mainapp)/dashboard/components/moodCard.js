"use client";
import React, { useState } from "react";

const MoodCard = ({ emotions, existingMood = null, onMoodSelect }) => {
  const [mood, setMood] = useState(existingMood);

  // Emotion to color mapping - matching the calendar component colors
  const moodColors = {
    happy: "bg-green-400",
    sad: "bg-blue-300",
    calm: "bg-sky-400",
    angry: "bg-red-400",
    anxious: "bg-purple-300",
    neutral: "bg-gray-300",
    stressed: "bg-orange-300",
    excited: "bg-yellow-300",
    tired: "bg-indigo-300",
    confused: "bg-pink-300",
    grateful: "bg-teal-400",
    loved: "bg-rose-300",
  };

  const handleMoodSelect = async selectedMood => {
    setMood(selectedMood);

    // Call the parent component's handler for database operations
    if (onMoodSelect) {
      await onMoodSelect(selectedMood);
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Get the background color class based on mood
  const cardBgColor = mood ? moodColors[mood.toLowerCase()] || "bg-white" : "bg-white";

  return (
    <div
      className={`rounded-xl p-5 shadow-sm w-full max-w-md transition-all duration-300 ${
        mood ? cardBgColor : "bg-white border border-gray-100"
      }`}
    >
      {!mood ? (
        // Add new mood state - only shows when no mood is recorded
        <div className="flex flex-col items-center justify-center py-6">
          <a
            href="/mood"
            className="w-16 h-16 mb-4 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </a>
          <p className="text-gray-600 font-medium">How was your feeling today?</p>
        </div>
      ) : (
        // Mood already selected state - no edit option
        <div className="flex items-start">
          <div>
            <div className="text-sm text-gray-600 mb-2">{currentTime}</div>
            <h3 className="text-xl font-medium text-gray-800 mb-1">Today you&apos;re feeling</h3>
            <p className="text-2xl font-semibold text-gray-900 capitalize">{mood}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCard;
