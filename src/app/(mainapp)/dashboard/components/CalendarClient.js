"use client";

import React, { useState } from "react";
import Calendar from "./calendar";
import PageDetails from "./pagedetails";
import { formatUTC7Date } from "@/utils/dateTime";

export default function CalendarClient({ moodData }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = dateString => {
    // Get mood data for the selected date
    const mood = moodData[dateString];

    // Log in development mode if needed
    if (process.env.NODE_ENV === "development") {
      console.log("Selected date:", dateString);
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
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
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
