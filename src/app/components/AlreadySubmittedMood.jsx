"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AlreadySubmittedMood({ moodData }) {
  const router = useRouter();

  const formatTime = dateString => {
    if (!dateString) return "";

    // Convert to UTC+7
    const date = new Date(dateString);
    const utc7Offset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const utc7Date = new Date(date.getTime() + utc7Offset);

    // Format time as HH:MM AM/PM
    return utc7Date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-indigo-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          You've already logged your mood today
        </h2>
        <p className="text-gray-600">You recorded your mood at {formatTime(moodData?.createdAt)}</p>
      </div>

      {moodData?.emotion && (
        <div className="flex items-center justify-center bg-gray-50 p-4 rounded-xl mb-6">
          <div className="mr-4">
            <Image
              src={
                moodData.emotion.imagePath ||
                `/images/emotions/${moodData.emotion.name.toLowerCase()}.png`
              }
              alt={moodData.emotion.name}
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today you're feeling</p>
            <p className="text-lg font-medium text-gray-800 capitalize">{moodData.emotion.name}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </button>

        {moodData?.journal ? (
          <button
            onClick={() => router.push("/journal-history")}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            View Journal History
          </button>
        ) : (
          <button
            onClick={() => router.push("/chat")}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Continue to Chat
          </button>
        )}
      </div>
    </div>
  );
}
