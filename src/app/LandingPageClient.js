"use client";

import React from "react";
import Link from "next/link";

export default function LandingPageClient() {
  return (
    <div className="mobile-container bg-white min-h-screen flex flex-col">
      {/* Main Content - Single Viewport */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-8">
        {/* Top Pattern - Fixed position instead of random */}
        <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden">
          <div className="flex justify-between px-4 pt-8">
            <div className="w-3 h-3 rounded-full bg-mood-happy"></div>
            <div className="w-4 h-4 rounded-full bg-mood-excited"></div>
            <div className="w-3 h-3 rounded-full bg-mood-calm"></div>
            <div className="w-5 h-5 rounded-full bg-mood-grateful"></div>
            <div className="w-3 h-3 rounded-full bg-mood-loved"></div>
          </div>
          <div className="flex justify-around px-8 pt-6">
            <div className="w-4 h-4 rounded-full bg-mood-sad"></div>
            <div className="w-3 h-3 rounded-full bg-mood-tired"></div>
            <div className="w-4 h-4 rounded-full bg-mood-anxious"></div>
          </div>
        </div>

        {/* App Logo */}
        <div className="mb-8 relative z-10">
          <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* App Name and Tagline */}
        <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center z-10">Theramind</h1>
        <p className="text-gray-600 text-center mb-8 max-w-xs z-10">
          Track your moods. Understand your emotions. Improve your wellbeing.
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 w-full mb-10">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center h-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-mood-happy-light flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-mood-happy"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-xs font-medium">Daily Tracking</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm text-center h-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-mood-calm-light flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-mood-calm"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-xs font-medium">Visual Calendar</p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm text-center h-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-mood-grateful-light flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-mood-grateful"
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
            <p className="text-xs font-medium">AI Journalling</p>
          </div>
        </div>

        {/* Log In Button */}
        <div className="w-full max-w-xs z-10">
          <Link
            href="/login"
            className="btn-primary w-full py-3 rounded-xl font-medium text-sm text-center transition-colors bg-indigo-700 text-white flex items-center justify-center"
          >
            Log In
          </Link>
        </div>

        {/* Subtle Footer */}
        <div className="w-full max-w-xs mt-4 text-center">
          <p className="text-xs text-gray-500">
            New user?{" "}
            <Link href="/register" className="text-indigo-600">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Pattern - Fixed position */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <div className="flex justify-around px-6 pb-6">
          <div className="w-4 h-4 rounded-full bg-mood-anxious"></div>
          <div className="w-5 h-5 rounded-full bg-mood-confused"></div>
          <div className="w-3 h-3 rounded-full bg-mood-angry"></div>
        </div>
      </div>
    </div>
  );
}
