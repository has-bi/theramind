// utils/hasSubmittedMood.js
import { prisma } from "./prisma";
import { getUTC7StartOfDay, getUTC7EndOfDay, convertToUTC7 } from "./dateTime";

export async function hasSubmittedMood(userId, options = {}) {
  if (!userId) return { hasSubmitted: false, data: null };

  // Get options with defaults
  const { skipForRedirect = false, checkJournal = true, debug = true } = options;

  // If skipForRedirect is true, we're in the redirect flow after submission
  // Return false to ensure user can proceed to chat
  if (skipForRedirect) {
    console.log("🔄 Skipping mood check because we're in the redirect flow");
    return { hasSubmitted: false, data: null };
  }

  try {
    // Get start and end of day in UTC+7 for today
    const now = new Date();
    const utcStartOfDay = getUTC7StartOfDay(now);
    const utcEndOfDay = getUTC7EndOfDay(now);

    // Debug info
    if (debug) {
      console.log("==== hasSubmittedMood Debug ====");
      console.log("Current time (Local):", now.toString());
      console.log("Current time (ISO):", now.toISOString());
      console.log("Current time (UTC+7):", convertToUTC7(now).toUTCString());
      console.log("UTC+7 Start of day:", utcStartOfDay.toISOString());
      console.log("UTC+7 End of day:", utcEndOfDay.toISOString());
    }

    // Check if we have a fresh submission flag in the session
    const freshSubmission =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("fresh_mood_submission") === "true";

    if (freshSubmission && debug) {
      console.log("🆕 Fresh mood submission detected");
    }

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
        journalAI: checkJournal,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (debug) {
      console.log("Found mood entry:", !!todaysMoodEntry);
      if (todaysMoodEntry) {
        console.log("Mood entry created at:", todaysMoodEntry.createdAt.toISOString());
        console.log("Emotion:", todaysMoodEntry.emotion?.name);
        console.log("Has journal:", !!todaysMoodEntry.journalAI);
      }
    }

    // If we have a fresh submission, we're in the initial flow
    // Clear the flag and return false to ensure user goes to chat
    if (freshSubmission && typeof localStorage !== "undefined") {
      localStorage.removeItem("fresh_mood_submission");

      if (debug) {
        console.log("🔄 Clearing fresh submission flag and proceeding to chat");
      }

      // Check if we're being called from the chat context
      const isInChatFlow =
        typeof window !== "undefined" && window.location.pathname.includes("/chat");

      // If we have a valid entry and we're not in chat, indicate submitted
      if (todaysMoodEntry && !isInChatFlow) {
        return {
          hasSubmitted: true,
          data: todaysMoodEntry,
          freshSubmission: true,
        };
      }

      return {
        hasSubmitted: false,
        data: todaysMoodEntry,
        freshSubmission: true,
      };
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
