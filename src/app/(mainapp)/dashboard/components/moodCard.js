// MoodCard.jsx
"use client";
import React, { useState } from "react";

const MoodCard = ({ emotions, existingMood = null, onMoodSelect }) => {
  const [mood, setMood] = useState(existingMood);
  const [isEditing, setIsEditing] = useState(!existingMood);

  // Emotion to color mapping
  const moodColors = {
    Happy: "bg-yellow-200",
    Sad: "bg-blue-200",
    Angry: "bg-red-200",
    Calm: "bg-green-200",
    Anxious: "bg-purple-200",
    // Add more colors as needed
  };

  const handleMoodSelect = async selectedMood => {
    setMood(selectedMood);
    setIsEditing(false);

    // Call the parent component's handler for database operations
    if (onMoodSelect) {
      await onMoodSelect(selectedMood);
    }
  };

  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Get the background color class based on mood
  const cardBgColor = mood ? moodColors[mood] || "bg-neutral-200" : "bg-neutral-200";

  return (
    <div
      className={`${cardBgColor} rounded-xl p-4 shadow-sm w-full max-w-md transition-colors duration-300`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-neutral-700 font-medium">Today</span>
        <div className="flex items-center">
          <span className="text-neutral-700 mr-3">{currentTime}</span>
          <button onClick={() => setIsEditing(true)} className="text-neutral-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        </div>
      </div>

      {isEditing ? (
        <div>
          <p className="text-lg mb-3 text-neutral-800">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2">
            {emotions.map(emotion => (
              <button
                key={emotion.id}
                onClick={() => handleMoodSelect(emotion.name)}
                className={`${
                  moodColors[emotion.name] || "bg-gray-200"
                } rounded-full px-3 py-2 flex items-center shadow-sm hover:shadow-md transition-shadow text-neutral-800`}
              >
                <span>{emotion.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg text-neutral-800">I'm feeling</p>
          <p className="text-2xl font-semibold text-neutral-900">{mood}</p>
        </div>
      )}
    </div>
  );
};

export default MoodCard;
