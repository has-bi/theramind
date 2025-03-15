"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./calendar";
import PageDetails from "./pagedetails";
import { formatUTC7Date, formatDateStringUTC7 } from "@/utils/dateTime";

export default function CalendarClient({ moodData }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Log mood data once on mount
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[CalendarClient] Initializing with data:", {
        moodDataKeys: Object.keys(moodData || {}),
        currentDate: currentDate.toString(),
        todayFormatted: formatDateStringUTC7(new Date()),
      });
    }
  }, [moodData, currentDate]);

  const handleDateClick = dateString => {
    // Get mood data for the selected date
    const mood = moodData[dateString];

    // Log in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("[CalendarClient] Selected date:", dateString);
      console.log(`Mood for ${dateString}:`, mood || "No mood recorded");
    }

    if (mood) {
      setSelectedDate(dateString);
      setSelectedMood(mood);
      setIsModalOpen(true);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("No mood data for this date:", dateString);
      }
    }
  };

  const handleChangeMonth = direction => {
    // Create a new date object without time part to avoid timezone issues
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);

    if (process.env.NODE_ENV === "development") {
      console.log(`[CalendarClient] Changed month: ${direction > 0 ? "next" : "previous"}`);
      console.log(`  New date: ${newDate.toString()}`);
      console.log(`  UTC+7 formatted: ${formatUTC7Date(newDate)}`);
    }
  };

  return (
    <div className="p-2 w-full">
      <Calendar
        currentDate={currentDate}
        moodData={moodData || {}}
        onChangeMonth={handleChangeMonth}
        onDateClick={handleDateClick}
      />

      {isModalOpen && selectedMood && (
        <PageDetails
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          date={selectedDate}
          moodData={selectedMood}
        />
      )}
    </div>
  );
}
