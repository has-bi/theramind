"use client";

import { useState, useEffect, memo } from "react";
import MoodCard from "./moodCard";
import { saveMoodEntry } from "../mood-actions";
import Image from "next/image";
import DashboardSkeleton from "./DashboardSkeleton";
import { formatUTC7Date } from "@/utils/dateTime";

// Memoize components to prevent unnecessary re-renders
const MemoizedMoodCard = memo(MoodCard);

export default function DashboardClient({
  serverEmotions,
  serverUserId,
  serverExistingMood,
  serverCurrentStreak,
  serverTopMoods,
  calendarView, // Accept the calendar view component directly
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    userId: serverUserId || null,
    existingMood: serverExistingMood || null,
    currentStreak: serverCurrentStreak || 0,
    topMoods: serverTopMoods || [],
    emotions: serverEmotions || [],
  });

  // Default emotions if server doesn't provide any
  const defaultEmotions = [
    { id: 1, label: "Happy", imagePath: "/images/emotions/happy.png", value: "Happy" },
    { id: 2, label: "Sad", imagePath: "/images/emotions/sad.png", value: "Sad" },
    { id: 3, label: "Calm", imagePath: "/images/emotions/calm.png", value: "Calm" },
    { id: 4, label: "Angry", imagePath: "/images/emotions/angry.png", value: "Angry" },
    { id: 5, label: "Anxious", imagePath: "/images/emotions/anxious.png", value: "Anxious" },
    { id: 6, label: "Neutral", imagePath: "/images/emotions/neutral.png", value: "Neutral" },
    { id: 7, label: "Stressed", imagePath: "/images/emotions/stressed.png", value: "Stressed" },
    { id: 8, label: "Excited", imagePath: "/images/emotions/excited.png", value: "Excited" },
    { id: 9, label: "Tired", imagePath: "/images/emotions/tired.png", value: "Tired" },
    { id: 10, label: "Confused", imagePath: "/images/emotions/confused.png", value: "Confused" },
    { id: 12, label: "Grateful", imagePath: "/images/emotions/grateful.png", value: "Grateful" },
    { id: 11, label: "Loved", imagePath: "/images/emotions/loved.png", value: "Loved" },
  ];

  // Handle mood selection with optimistic UI update
  const handleMoodSelect = async moodName => {
    try {
      // Optimistically update the UI
      setData(prev => ({
        ...prev,
        existingMood: moodName,
      }));

      // Then save to the server
      await saveMoodEntry(moodName);
    } catch (error) {
      console.error("Failed to save mood:", error);
      // Revert the optimistic update if there's an error
      setData(prev => ({
        ...prev,
        existingMood: serverExistingMood,
      }));

      // Could show an error toast or message here
      alert(error.message || "Failed to save your mood. Please try again.");
    }
  };

  // Show loading skeleton for a minimum time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Minimum loading time for better UX

    return () => clearTimeout(timer);
  }, []);

  // Format day for header with UTC+7 timezone
  const today = new Date();
  const formattedDate = formatUTC7Date(today);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mobile-container bg-white">
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
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Home</h1>
            <p className="text-xs text-gray-500">Welcome to Theramind!</p>
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* 1. MOOD CARD - First section */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            {data.existingMood ? "Today's Mood" : "How are you feeling?"}
          </h2>
          <MemoizedMoodCard
            emotions={data.emotions.length > 0 ? data.emotions : defaultEmotions}
            existingMood={data.existingMood}
            onMoodSelect={handleMoodSelect}
          />
        </div>

        {/* 2. CALENDAR - Second section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-gray-700">Your Mood Calendar</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
            {calendarView}
          </div>
        </div>

        {/* 3. STATS - Bottom section */}
        <div className="mb-20">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Your Stats</h2>
          <div className="flex flex-col gap-4">
            {/* Streak Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-50 rounded-xl mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{data.currentStreak}</p>
                  <p className="text-xs text-gray-500 mt-1">day streak</p>
                </div>
              </div>
              {data.currentStreak > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    {data.currentStreak === 1
                      ? "Great start! The journey of tracking begins with a single day."
                      : data.currentStreak === 2
                      ? "Day 2! You're on your way to building a healthy habit."
                      : data.currentStreak >= 3 && data.currentStreak <= 6
                      ? "You're building consistency! A few more days to make it a solid habit."
                      : data.currentStreak >= 7 && data.currentStreak <= 13
                      ? "Impressive streak! You're making mood tracking a regular part of your routine."
                      : data.currentStreak >= 14 && data.currentStreak <= 29
                      ? "Fantastic commitment! You're becoming a mood awareness expert."
                      : "Amazing! You've reached champion status with your dedication to emotional wellness."}
                  </p>
                </div>
              )}
            </div>

            {/* Top Mood Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Top Mood</p>

              {data.topMoods.length > 0 ? (
                <div className="flex items-center">
                  <div className="mr-3">
                    <Image
                      src={data.topMoods[0].imagePath}
                      alt={data.topMoods[0].name}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-base font-medium text-gray-800 capitalize">
                      {data.topMoods[0].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {data.topMoods[0].count} days this month
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">No mood data yet</p>
                  <p className="text-xs text-gray-400 mt-1">Track daily to see your patterns</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
