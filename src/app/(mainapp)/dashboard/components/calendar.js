"use client";

import React from "react";
import { useState } from "react";
import PageDetails from "./pagedetails";

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

  const isCurrentDate = dateString => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
    return dateString === todayString;
  };

  const formatDateString = (year, month, day) => {
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];

    // Previous month days
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const prevMonth = month === 0 ? 12 : month;
      const prevYear = month === 0 ? year - 1 : year;
      const dateString = formatDateString(prevMonth === 12 ? prevYear : year, prevMonth, day);

      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: false,
      });
    }

    // Current month days
    const lastDay = new Date(year, month + 1, 0);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateString = formatDateString(year, month + 1, day);

      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: true,
      });
    }

    // Next month days
    const lastDayOfWeek = lastDay.getDay();
    const daysToAdd = 6 - lastDayOfWeek;
    for (let i = 1; i <= daysToAdd; i++) {
      const nextMonth = month === 11 ? 1 : month + 2;
      const nextYear = month === 11 ? year + 1 : year;
      const dateString = formatDateString(nextMonth === 1 ? nextYear : year, nextMonth, i);

      days.push({
        day: i,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: false,
      });
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
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
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
              onClick={() => (onDateClick ? onDateClick(dayInfo.dateString) : null)}
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
