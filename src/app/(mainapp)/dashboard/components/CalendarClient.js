"use client";

import React, { useState } from "react";
import Calendar from "./calendar";
import { formatUTC7Date } from "@/utils/dateTime";

export default function CalendarClient({ moodData }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = dateString => {
    // Only log in development mode if needed
    if (process.env.NODE_ENV === "development") {
      console.log("Selected date:", dateString);
      const mood = moodData[dateString] || "No mood recorded";
      console.log(`Mood for ${dateString}: ${mood}`);
    }

    // You could expand this to show a modal with mood details for the selected date
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
    </div>
  );
}
