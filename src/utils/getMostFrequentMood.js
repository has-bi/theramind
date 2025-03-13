import { getMoodData } from "@/app/api/calendar/getMoodData";

export async function getMostFrequentMood(sessionId) {
  if (!sessionId) return null;

  const moodData = await getMoodData(sessionId);
  console.log("Mood Data:", moodData); // debug coy

  const moodCounts = {};
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  Object.entries(moodData).forEach(([date, mood]) => {
    const entryDate = new Date(date);
    if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    }
  });

  console.log("Mood Counts:", moodCounts); // debug coy

  const mostFrequentMood =
    Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0]
      ?.toLowerCase() || null;

  console.log("Most Frequent Mood:", mostFrequentMood); // debug coy
  return mostFrequentMood;
}
