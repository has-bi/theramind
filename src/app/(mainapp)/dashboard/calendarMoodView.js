"use client";

import React, { useState, useEffect } from "react";
import Calendar from "./components/calendar";
import { format, formatDate } from "date-fns";

export default function CalendarMoodView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [moodData, setMoodData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMoodData = async () => {
    try {
      const response = await fetch("/api/calendar");
      if (!response.ok) {
        throw new Error("Failed to fetch mood data");
      }
      const data = await response.json();

      const formattedMoodData = data.reduce((acc, entry) => {
        const dateString = format(new Date(entry.createdAt), "yyyy-MM-dd");
        acc[dateString] = entry.emotionName.toLowerCase();
        return acc;
      }, {});

      setMoodData(formattedMoodData);
    } catch (error) {
      console.error("Error fetching mood data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodData();
  }, []);

  const handleChangeMonth = direction => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Calendar currentDate={currentDate} moodData={moodData} onChangeMonth={handleChangeMonth} />
    </div>
  );
}
