"use client";

import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="mobile-container bg-gray-50 min-h-screen">
      {/* Header Skeleton */}
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse mr-3"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded-md animate-pulse w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-md animate-pulse w-2/5"></div>
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* Today's Mood Card Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3 mb-3"></div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse mb-4"></div>
              <div className="h-5 bg-gray-200 rounded-md animate-pulse w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse w-1/2 mb-2"></div>
            </div>
          </div>
        </div>

        {/* Calendar Skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <div className="h-4 bg-gray-200 rounded-md animate-pulse w-2/5"></div>
            <div className="h-3 bg-gray-200 rounded-md animate-pulse w-1/5"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3"></div>
              <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`weekday-${i}`}
                    className="h-3 bg-gray-200 rounded-md animate-pulse"
                  ></div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array(35)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={`day-${i}`}
                    className="aspect-square bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
            </div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/4 mb-3"></div>
          <div className="flex flex-col gap-4">
            {/* Streak Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gray-200 animate-pulse mr-3"></div>
                <div>
                  <div className="h-6 bg-gray-200 rounded-md animate-pulse w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-md animate-pulse w-20"></div>
                </div>
              </div>
            </div>

            {/* Top Mood Card Skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="h-3 bg-gray-200 rounded-md animate-pulse w-1/4 mb-3"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded-md animate-pulse w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded-md animate-pulse w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
