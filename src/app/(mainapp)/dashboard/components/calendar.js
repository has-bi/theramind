"use client";

import React from "react";

export default function Calendar({ currentDate, moodData, onChangeMonth, onDateClick }) {
  const MOOD_COLORS = {
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
    <div className="bg-white rounded-xl p-6 shadow-sm max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onChangeMonth(-1)}
          className="text-gray-600"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="text-xl font-medium text-gray-800">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button onClick={() => onChangeMonth(1)} className="text-gray-600" aria-label="Next month">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-2">
        <div className="text-gray-500 text-xs">S</div>
        <div className="text-gray-500 text-xs">M</div>
        <div className="text-gray-500 text-xs">T</div>
        <div className="text-gray-500 text-xs">W</div>
        <div className="text-gray-500 text-xs">T</div>
        <div className="text-gray-500 text-xs">F</div>
        <div className="text-gray-500 text-xs">S</div>
      </div>

      <div className="grid grid-cols-7 gap-y-2 text-center">
        {generateCalendarDays().map((dayInfo, index) => {
          const isToday = isCurrentDate(dayInfo.dateString);
          const hasMood = !!dayInfo.mood;

          return (
            <div
              key={`day-${index}`}
              className="relative h-8"
              onClick={() => (onDateClick ? onDateClick(dayInfo.dateString) : null)}
            >
              {dayInfo && (
                <>
                  {/* Mood indicator with date */}
                  <div
                    className={`
                      w-8 h-8 mx-auto flex items-center justify-center rounded-full
                      ${hasMood ? MOOD_COLORS[dayInfo.mood.toLowerCase()] : "bg-transparent"}
                      ${!dayInfo.isCurrentMonth ? "text-gray-400" : "text-gray-800"}
                      ${isToday ? "ring-1 ring-black" : ""}
                      ${hasMood || isToday ? "cursor-pointer" : ""}
                      text-sm
                    `}
                  >
                    {dayInfo.day}
                  </div>

                  {/* Today dot indicator */}
                  {isToday && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="text-sm font-medium mb-2">Mood Legend</div>
        <div className="grid grid-cols-3 gap-y-2">
          {Object.entries(MOOD_COLORS).map(([mood, color]) => (
            <div key={`mood-${mood}`} className="flex items-center">
              <div className={`w-3 h-3 mr-2 rounded-full ${color}`}></div>
              <span className="text-xs capitalize text-gray-600">{mood}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
