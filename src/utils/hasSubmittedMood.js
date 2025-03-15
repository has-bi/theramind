// utils/hasSubmittedMood.js
import { prisma } from "./prisma";
import { getUTC7StartOfDay, getUTC7EndOfDay, convertToUTC7 } from "./dateTime";

export async function hasSubmittedMood(userId) {
  if (!userId) return { hasSubmitted: false, data: null };

  try {
    // Get start and end of day in UTC+7 for today
    const now = new Date();
    const utcStartOfDay = getUTC7StartOfDay(now);
    const utcEndOfDay = getUTC7EndOfDay(now);

    // Debug info
    console.log("==== hasSubmittedMood Debug ====");
    console.log("Current time (Local):", now.toString());
    console.log("Current time (ISO):", now.toISOString());
    console.log("Current time (UTC+7):", convertToUTC7(now).toString());
    console.log("UTC+7 Start of day:", utcStartOfDay.toISOString());
    console.log("UTC+7 End of day:", utcEndOfDay.toISOString());

    // Find mood entry for today
    const todaysMoodEntry = await prisma.moodEntry.findFirst({
      where: {
        userId: userId,
        createdAt: {
          gte: utcStartOfDay,
          lte: utcEndOfDay,
        },
      },
      include: {
        emotion: true,
        journalAI: true,
      },
    });

    console.log("Found mood entry:", !!todaysMoodEntry);
    if (todaysMoodEntry) {
      console.log("Mood entry created at:", todaysMoodEntry.createdAt.toISOString());
      console.log("Emotion:", todaysMoodEntry.emotion?.name);
    }

    return {
      hasSubmitted: !!todaysMoodEntry,
      data: todaysMoodEntry || null,
    };
  } catch (error) {
    console.error("Error checking for today's mood submission:", error);
    return { hasSubmitted: false, data: null };
  }
}
