"use client";

import React, { useState } from "react";
import Calendar from "./calendar";

export default function CalendarClient({ initialMoodData }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = dateString => {
    console.log("Selected date:", dateString);
    const mood = initialMoodData[dateString] || "No mood recorded";
    console.log(`Mood for ${dateString}: ${mood}`);
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
        moodData={initialMoodData}
        onChangeMonth={handleChangeMonth}
        onDateClick={handleDateClick}
      />
    </div>
  );
}
