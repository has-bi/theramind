"use server";

import { cookies } from "next/headers";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import CalendarClient from "./components/CalendarClient";
import { cache } from "react";

// Cache the mood data fetching to prevent redundant calls
export const getCachedMoodData = cache(async sessionId => {
  if (!sessionId) return {};

  try {
    // Fetch mood data server-side
    const moodData = await getMoodData(sessionId);
    return moodData;
  } catch (error) {
    console.error("Error fetching mood data:", error);
    return {};
  }
});

export default async function CalendarView() {
  // Get session ID from cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // Use the cached function to get mood data
  const moodData = sessionId ? await getCachedMoodData(sessionId) : {};

  // Pass the data to the client component
  return <CalendarClient moodData={moodData} />;
}
