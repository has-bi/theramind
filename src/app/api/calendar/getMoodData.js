// app/api/calendar/getMoodData.js
import { prisma } from "@/utils/prisma";
import { formatDateStringUTC7, debugTimezone } from "@/utils/dateTime";

export async function getMoodData(sessionId) {
  // Skip if no session ID
  if (!sessionId) {
    return {};
  }

  try {
    // Determine if we're debugging
    const isDebugging = process.env.DEBUG_MOOD_DATA === "true";

    if (isDebugging) {
      console.log("🗓️ Getting mood data for session ID:", sessionId);
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
      console.log("👤 Found user ID:", userId);
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
      console.log(`📊 Found ${moodEntries.length} mood entries for user`);
      // Log the first few entries with their timestamps
      if (moodEntries.length > 0) {
        console.log("Sample entries:");
        moodEntries.slice(0, 3).forEach((entry, i) => {
          console.log(`Entry ${i + 1}:`);
          console.log(`  Created (UTC): ${entry.createdAt.toISOString()}`);
          const dateStr = formatDateStringUTC7(entry.createdAt);
          console.log(`  Formatted as: ${dateStr}`);
        });
      }
    }

    // Format the data for the calendar - using UTC+7 for dates
    const formattedData = {};

    moodEntries.forEach(entry => {
      if (entry.emotion) {
        // Format date as YYYY-MM-DD in UTC+7 timezone
        const dateStr = formatDateStringUTC7(entry.createdAt);

        if (isDebugging && !formattedData[dateStr]) {
          console.log(`Adding mood for ${dateStr}: ${entry.emotion.name}`);
          console.log(`  Original created at: ${entry.createdAt.toISOString()}`);
        }

        // Only keep the first mood entry for each day (most recent due to ordering)
        if (!formattedData[dateStr]) {
          formattedData[dateStr] = {
            createdAt: entry.createdAt,
            emotionName: entry.emotion.name,
            recap: entry.journalAI?.recap || "No recap available",
          };
        }
      }
    });

    if (isDebugging) {
      console.log("✅ Final mood data formatting complete");
      console.log(`  Total unique days: ${Object.keys(formattedData).length}`);
      // Show current date in UTC+7 for reference
      const now = new Date();
      const todayStr = formatDateStringUTC7(now);
      console.log(`  Today in UTC+7: ${todayStr}`);
      console.log(`  Has entry for today: ${formattedData[todayStr] ? "Yes" : "No"}`);
    }

    return formattedData;
  } catch (error) {
    console.error("❌ Error getting mood data:", error);
    return {};
  }
}
