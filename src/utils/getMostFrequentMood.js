// utils/getMostFrequentMood.js
import { getMoodData } from "@/app/api/calendar/getMoodData";

export async function getMostFrequentMood(sessionId) {
  // If no session ID, return null
  if (!sessionId) return null;

  try {
    // Get mood data from calendar API
    const moodData = await getMoodData(sessionId);

    // If no mood data, return null
    if (!moodData || Object.keys(moodData).length === 0) return null;

    // Count occurrences of each mood
    const moodCounts = {};

    Object.values(moodData).forEach(moodEntry => {
      // Make sure we're accessing the emotion name as a string
      const emotionName = moodEntry.emotionName;

      if (emotionName) {
        moodCounts[emotionName] = (moodCounts[emotionName] || 0) + 1;
      }
    });

    // Find the most frequent mood
    let maxCount = 0;
    let mostFrequentMood = null;

    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentMood = mood;
      }
    });

    return mostFrequentMood;
  } catch (error) {
    console.error("Error getting most frequent mood:", error);
    return null;
  }
}
