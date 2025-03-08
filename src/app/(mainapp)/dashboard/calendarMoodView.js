"use client";

import React from "react";
import { useState, useEffect } from "react";
import Calendar from "./components/calendar";

export default function CalendarMoodView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState({});

  const fetchMoodData = async () => {
    const dummyData = {
      "2025-02-23": "happy",
      "2025-02-24": "sad",
      "2025-02-25": "calm",
      "2025-02-26": "angry",
      "2025-02-27": "anxious",
      "2025-02-28": "stressed",
      "2025-03-01": "neutral",
      "2025-03-02": "excited",
      "2025-03-03": "tired",
      "2025-03-04": "confused",
      "2025-03-05": "grateful",
      "2025-03-06": "loved",
    };

    setMoodData(dummyData);
  };

  useEffect(() => {
    fetchMoodData();
  }, []);

  const handleDateClick = dateString => {
    console.log("Selected date:", dateString);
  };

  const handleChangeMonth = direction => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div>
      <Calendar currentDate={currentDate} moodData={moodData} onChangeMonth={handleChangeMonth} />
    </div>
  );
}
