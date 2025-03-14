// app/api/calendar/getMoodData.js
import { prisma } from "@/utils/prisma";
import { convertToUTC7 } from "@/utils/dateTime";

export async function getMoodData(sessionId) {
  // Skip if no session ID
  if (!sessionId) {
    return {};
  }

  try {
    // Only log if explicitly debugging
    const isDebugging = process.env.DEBUG_MOOD_DATA === "true";

    if (isDebugging) {
      console.log("Getting mood data for session ID:", sessionId);
    }

    // Get the user ID from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || !session.user) {
      return {};
    }

    const userId = session.user.id;

    if (isDebugging) {
      console.log("Found user ID:", userId);
    }

    // Get all mood entries for the user
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
      },
      include: {
        emotion: true,
        journalAI: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (isDebugging) {
      console.log(`Found ${moodEntries.length} mood entries for user`);
    }

    // Format the data for the calendar
    const formattedData = {};

    moodEntries.forEach(entry => {
      if (entry.emotion) {
        // Adjust date to UTC+7 for display
        const utcDate = new Date(entry.createdAt);
        const utc7Date = convertToUTC7(utcDate);
        const dateStr = utc7Date.toISOString().split("T")[0];

        // Only keep the first mood entry for each day (most recent due to ordering)
        if (!formattedData[dateStr]) {
          formattedData[dateStr] = {
            createdAt: entry.createdAt,
            emotionName: entry.emotion.name,
            recap: entry.journalAI?.recap || "No recap available",
          };

          if (isDebugging) {
            console.log(`Mood for ${dateStr}: ${entry.emotion.name}`);
          }
        }
      }
    });

    if (isDebugging) {
      console.log("Final formatted mood data:", formattedData);
    }

    return formattedData;
  } catch (error) {
    console.error("Error getting mood data:", error);
    return {};
  }
}
