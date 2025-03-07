"use client";

import React from "react";

export default function Calendar({ currentDate, moodData, onChangeMonth }) {
  const MOOD_COLORS = {
    happy: "bg-green-500 text-white",
    sad: "bg-blue-300 text-blue-900",
    calm: "bg-blue-500 text-white",
    angry: "bg-red-400 text-white",
    anxious: "bg-purple-300 text-purple-900",
    neutral: "bg-gray-300 text-gray-900",
    stressed: "bg-orange-300 text-orange-900",
    excited: "bg-yellow-300 text-yellow-900",
    tired: "bg-indigo-300 text-indigo-900",
    confused: "bg-pink-300 text-pink-900",
    grateful: "bg-teal-300 text-teal-900",
    loved: "bg-rose-300 text-rose-900",
  };

  const isCurrentDate = dateString => {
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
    return dateString === todayString;
  };

  const handleDateClick = dateString => {
    console.log("Selected date:", dateString);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Date from Prev Month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: true,
      });
    }

    // Date from Next Month
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const day = i;
      const dateString = `${year}-${String(month + 2).padStart(2, "0")}-${String(day).padStart(
        2,
        "0"
      )}`;
      days.push({
        day,
        dateString,
        mood: moodData[dateString],
        isCurrentMonth: false,
      });
    }

    return days;
  };

  return (
    <div className="bg-white border-1 border-slate-200 rounded-lg p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onChangeMonth(-1)} className="hover:bg-gray-100 rounded-full p-2">
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
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </div>
        <button onClick={() => onChangeMonth(1)} className="hover:bg-gray-100 rounded-full p-2">
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
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="font-semibold text-gray-500 text-sm">
            {day}
          </div>
        ))}
        {generateCalendarDays().map((dayInfo, index) => {
          const isToday = isCurrentDate(dayInfo.dateString);
          const hasMood = dayInfo.mood;

          return (
            <div
              key={index}
              className={`
                h-10 flex items-center justify-center
                ${dayInfo ? "cursor-pointer" : ""}
              `}
              onClick={() => handleDateClick(dayInfo.dateString)}
            >
              {dayInfo && (
                <div
                  className={`
                    w-8 h-8 flex items-center justify-center rounded-full
                    ${
                      hasMood
                        ? MOOD_COLORS[dayInfo.mood]
                        : isToday
                        ? "bg-black text-white"
                        : dayInfo.isCurrentMonth
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-400 hover:bg-gray-100"
                    }
                  `}
                >
                  {dayInfo.day}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(MOOD_COLORS).map(([mood, color]) => (
          <div key={mood} className="flex items-center">
            <div className={`w-4 h-4 mr-1 rounded-full ${color}`}></div>
            <span className="text-xs capitalize">{mood.replace("-", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
