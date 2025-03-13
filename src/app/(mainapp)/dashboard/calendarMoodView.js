import { cookies } from "next/headers";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import CalendarClient from "./components/CalendarClient";


export default async function CalendarMoodView() {
  // Get session ID from cookies
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  console.log("Calendar page loaded with session ID:", sessionId);

  // Fetch mood data on the server
  const moodData = await getMoodData(sessionId);

  console.log("Mood data fetched and ready to pass to client component");

  // Pass the data to the client component
  return <CalendarClient initialMoodData={moodData} />;
}
