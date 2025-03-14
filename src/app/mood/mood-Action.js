"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { getUTC7StartOfDay, getUTC7EndOfDay } from "@/utils/dateTime";

export async function createMoodAction(_, formData) {
  try {
    const emotionId = Number(formData.get("emotionId"));
    const label = formData.get("label");
    const imagePath = formData.get("imagePath");
    const value = formData.get("value");

    if (!emotionId || !label || !value) {
      return {
        error: "Missing required emotion data",
      };
    }

    // Get the session cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return { error: "No active session" };
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      return { error: "Invalid session" };
    }

    const userId = session.user.id;

    // Check if user has already submitted mood today
    const { hasSubmitted } = await hasSubmittedMood(userId);

    if (hasSubmitted) {
      return { error: "You have already recorded your mood for today", alreadySubmitted: true };
    }

    try {
      // Check if an emotion with this ID exists
      let emotion = await prisma.emotion.findUnique({
        where: { id: emotionId },
      });

      // If emotion doesn't exist, create it
      if (!emotion) {
        emotion = await prisma.emotion.create({
          data: {
            id: emotionId,
            name: label,
            imagePath: imagePath,
            value: value,
          },
        });
      }

      // Create mood entry
      await prisma.moodEntry.create({
        data: {
          userId,
          emotionId,
        },
      });

      // Revalidate the paths to refresh data
      revalidatePath("/");
      revalidatePath("/mood");
      revalidatePath("/chat");

      return { success: true, redirect: "/chat" };
    } catch (dbError) {
      return {
        error: "Database operation failed: " + dbError.message,
      };
    }
  } catch (error) {
    return {
      error: "An unexpected error occurred: " + error.message,
    };
  }
}
