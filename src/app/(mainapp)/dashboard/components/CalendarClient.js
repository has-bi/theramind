"use client";

import React, { useState } from "react";
import Calendar from "./calendar";
import PageDetails from "./pagedetails";

export default function CalendarClient({ initialMoodData }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = dateString => {
    console.log("Selected date:", dateString);
    const mood = initialMoodData[dateString] || "No mood recorded";
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
