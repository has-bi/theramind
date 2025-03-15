"use client";

import React from "react";
import { useState, useEffect } from "react";
import PageDetails from "./pagedetails";
import {
  convertToUTC7,
  formatDateStringUTC7,
  getCurrentUTC7Date,
  getCurrentUTC7Month,
  getCurrentUTC7Year,
} from "@/utils/dateTime";

export default function Calendar({ currentDate, moodData, onChangeMonth, onDateClick }) {
  const MOOD_COLORS = {
    happy: "bg-mood-happy",
    sad: "bg-mood-sad",
    calm: "bg-mood-calm",
    angry: "bg-mood-angry",
    anxious: "bg-mood-anxious",
    neutral: "bg-mood-neutral",
    stressed: "bg-mood-stressed",
    excited: "bg-mood-excited",
    tired: "bg-mood-tired",
    confused: "bg-mood-confused",
    grateful: "bg-mood-grateful",
    loved: "bg-mood-loved",
  };

  // Log timezone debug info once on mount
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const now = new Date();
      console.log("[Calendar] Current date info:");
      console.log(`  JS Date: ${now.toString()}`);
      console.log(`  ISO: ${now.toISOString()}`);
      console.log(`  Local time: ${now.toLocaleString()}`);

      const utc7Now = convertToUTC7(now);
      console.log(`  UTC+7: ${utc7Now.toUTCString()}`);
      console.log(`  UTC+7 date: ${utc7Now.getUTCDate()}`);
      console.log(`  UTF+7 formatted: ${formatDateStringUTC7(now)}`);

      // Check if today is in moodData
      const todayStr = formatDateStringUTC7(now);
      console.log(`  Today's key: ${todayStr}`);
      console.log(`  Today in moodData: ${moodData[todayStr] ? "Yes" : "No"}`);
    }
  }, [moodData]);

  // Convert current date from input to UTC+7 for display
  const utc7CurrentDate = convertToUTC7(currentDate);

  const isCurrentDate = dateString => {
    // Create today's date string in UTC+7
    const todayString = formatDateStringUTC7(new Date());
    return dateString === todayString;
  };

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const generateCalendarDays = () => {
    // Use the UTC+7 adjusted date for calendar generation
    const year = utc7CurrentDate.getUTCFullYear();
    const month = utc7CurrentDate.getUTCMonth();
    const days = [];

    // Previous month days
    const firstDay = new Date(Date.UTC(year, month, 1));
    const dayOfWeek = convertToUTC7(firstDay).getUTCDay();

    // Adjust for Sunday as first day (0-indexed)
    const firstDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

    if (firstDayOfWeek > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthDays = new Date(Date.UTC(prevYear, prevMonth + 1, 0)).getUTCDate();

      for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthDays - firstDayOfWeek + i + 1;
        const prevMonthPadded = String(prevMonth + 1).padStart(2, "0");
        const dayPadded = String(day).padStart(2, "0");
        const dateString = `${prevMonth === 11 ? prevYear : year}-${prevMonthPadded}-${dayPadded}`;

        days.push({
          day,
          dateString,
          mood: moodData[dateString],
          isCurrentMonth: false,
        });
      }
    }

    // Current month days
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const monthPadded = String(month + 1).padStart(2, "0");
      const dayPadded = String(day).padStart(2, "0");
      const dateString = `${year}-${monthPadded}-${dayPadded}`;

      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: true,
      });
    }

    // Next month days - fill to complete the grid (6 rows x 7 days = 42 cells total)
    const totalCellsNeeded = 42;
    const cellsToAdd = totalCellsNeeded - days.length;

    if (cellsToAdd > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;

      for (let day = 1; day <= cellsToAdd; day++) {
        const nextMonthPadded = String(nextMonth + 1).padStart(2, "0");
        const dayPadded = String(day).padStart(2, "0");
        const dateString = `${nextMonth === 0 ? nextYear : year}-${nextMonthPadded}-${dayPadded}`;

        days.push({
          day,
          dateString,
          mood: moodData[dateString],
          isCurrentMonth: false,
        });
      }
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl p-1 w-full">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => onChangeMonth(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="text-base font-semibold text-gray-800">
          {utc7CurrentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
            timeZone: "Etc/GMT-7", // Use Etc/GMT-7 timezone for UTC+7
          })}
        </div>
        <button
          onClick={() => onChangeMonth(1)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-gray-500 text-xs font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {generateCalendarDays().map((dayInfo, index) => {
          const isToday = isCurrentDate(dayInfo.dateString);
          const hasMood = !!dayInfo.mood;
          const moodClass = hasMood ? MOOD_COLORS[dayInfo.mood.emotionName.toLowerCase()] : "";

          return (
            <div
              key={`day-${index}`}
              className={`relative h-8
                ${hasMood ? "cursor-pointer" : "cursor-default"}`}
              {...(hasMood && {
                onClick: () => (onDateClick ? onDateClick(dayInfo.dateString) : null),
              })}
            >
              {dayInfo && (
                <>
                  {/* Mood indicator with date */}
                  <div
                    className={`
                      w-7 h-7 mx-auto flex items-center justify-center rounded-full
                      ${moodClass}
                      ${
                        !dayInfo.isCurrentMonth
                          ? "text-gray-400"
                          : hasMood
                          ? "text-gray-800"
                          : "text-gray-700"
                      }
                      ${isToday ? "ring-2 ring-indigo-500" : ""}
                      ${hasMood || isToday ? "cursor-pointer" : "cursor-default"}
                      transition-all text-sm
                    `}
                  >
                    {dayInfo.day}
                  </div>

                  {/* Today dot indicator */}
                  {isToday && !hasMood && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-3 border-t border-gray-100">
        <div className="grid grid-cols-4 gap-y-3 gap-x-1">
          {Object.entries(MOOD_COLORS).map(([mood, color]) => (
            <div key={`mood-${mood}`} className="flex items-center">
              <div className={`w-3 h-3 mr-1 rounded-full ${color}`}></div>
              <span className="text-xs capitalize text-gray-600 truncate">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
