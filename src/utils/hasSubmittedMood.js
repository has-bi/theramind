// utils/hasSubmittedMood.js
import { prisma } from "./prisma";
import { getUTC7StartOfDay, getUTC7EndOfDay } from "./dateTime";

export async function hasSubmittedMood(userId) {
  if (!userId) return false;

  try {
    // Get start and end of day in UTC+7 for today
    const now = new Date();
    const utcStartOfDay = getUTC7StartOfDay(now);
    const utcEndOfDay = getUTC7EndOfDay(now);

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

    return {
      hasSubmitted: !!todaysMoodEntry,
      data: todaysMoodEntry || null,
    };
  } catch (error) {
    console.error("Error checking for today's mood submission:", error);
    return { hasSubmitted: false, data: null };
  }
}
