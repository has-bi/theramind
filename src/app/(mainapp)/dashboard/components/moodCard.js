"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const MoodCard = ({ emotions, existingMood = null, onMoodSelect }) => {
  const [mood, setMood] = useState(existingMood);

  const handleMoodSelect = async selectedMood => {
    setMood(selectedMood);

    // Call the parent component's handler for database operations
    if (onMoodSelect) {
      await onMoodSelect(selectedMood);
    }
  };

  // Find matching emotion to get image path - handle both label and value fields
  const getMatchingEmotion = (emotions, moodName) => {
    if (!moodName || !emotions?.length) return null;

    const lowerMood = moodName.toLowerCase();

    // Try matching by label
    let match = emotions.find(e => e.label?.toLowerCase() === lowerMood);

    // If no match by label, try matching by value
    if (!match) {
      match = emotions.find(e => e.value?.toLowerCase() === lowerMood);
    }

    // If still no match, try matching by name if available
    if (!match) {
      match = emotions.find(e => e.name?.toLowerCase() === lowerMood);
    }

    return match;
  };

  const matchingEmotion = getMatchingEmotion(emotions, mood);
  const imagePath =
    matchingEmotion?.imagePath || `/images/emotions/${mood?.toLowerCase() || "neutral"}.png`;

  // Get the background color class based on mood
  const moodLower = mood?.toLowerCase() || "";

  return (
    <div
      className={`mood-card p-4 w-full max-w-md ${
        mood ? `bg-mood-${moodLower}-light` : "bg-white"
      }`}
    >
      {!mood ? (
        // Add new mood state - only shows when no mood is recorded
        <div className="flex flex-col items-center justify-center py-6">
          <Link
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
          </Link>
          <p className="text-gray-600 font-medium">How are you feeling today?</p>
        </div>
      ) : (
        // Mood already selected state with text on left, image on right
        <div className="flex items-center justify-between">
          {/* Left side - Text with hierarchy */}
          <div className="text-left">
            <p className="text-xs text-gray-800 mb-1">Today you're feeling</p>
            <h3 className="text-2xl font-bold capitalize text-gray-800 mb-1">{mood}</h3>
          </div>

          {/* Right side - Emotion icon */}
          <div className="flex-shrink-0 ml-4">
            {imagePath && (
              <Image
                src={imagePath}
                alt={mood || "Mood"}
                width={70}
                height={70}
                className="object-contain"
                priority
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodCard;
