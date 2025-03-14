"use client";

import React, { useState } from "react";
import Calendar from "./calendar";
import PageDetails from "./pagedetails";
import { formatUTC7Date } from "@/utils/dateTime";

export default function CalendarClient({ moodData }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = dateString => {
    // Only log in development mode if needed
    if (process.env.NODE_ENV === "development") {
      console.log("Selected date:", dateString);
      const mood = moodData[dateString] || "No mood recorded";
      // console.log(initialMoodData);
      console.log(`Mood for ${dateString}: ${mood}`);

      const formatDate = dateString => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };

      if (mood) {
        setSelectedMood({
          type: mood.emotionName,
          createdAt: formatDate(mood.createdAt),
          emotionName: mood.emotionName, // Format createdAt
          recap: mood.recap,
        });
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
        console.log("No mood data for this date:", dateString);
      }
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

      {selectedMood && (
        <PageDetails
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          emotionData={selectedMood}
        />
      )}
    </div>
  );
}
