"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";

export async function createMoodAction(_, formData) {
  try {
    const emotionId = Number(formData.get("emotionId"));
    const label = formData.get("label");
    const imagePath = formData.get("imagePath");
    const value = formData.get("value");

    console.log("🎭 Creating mood entry with:", { emotionId, label, value });

    if (!emotionId || !label || !value) {
      console.log("❌ Missing required emotion data");
      return {
        error: "Missing required emotion data",
      };
    }

    // Get the session cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.log("❌ No active session found");
      return { error: "No active session" };
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      console.log("❌ Invalid session");
      return { error: "Invalid session" };
    }

    const userId = session.user.id;
    console.log(`👤 Processing mood entry for user: ${userId}`);

    // Check if user has already submitted mood today
    // Pass true to skipForRedirect to bypass the check during submission
    const options = { skipForRedirect: false };
    try {
      const { hasSubmitted } = await hasSubmittedMood(userId, options);

      if (hasSubmitted) {
        console.log("⚠️ User has already submitted a mood entry today");
        return {
          error: "You have already recorded your mood for today",
          alreadySubmitted: true,
        };
      }
    } catch (checkError) {
      console.log("⚠️ Error checking mood submission:", checkError);
      // Continue with the submission even if check fails
    }

    try {
      // Check if an emotion with this ID exists
      let emotion = await prisma.emotion.findUnique({
        where: { id: emotionId },
      });

      // If emotion doesn't exist, create it
      if (!emotion) {
        console.log(`✨ Creating new emotion: ${label}`);
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
      console.log("✏️ Creating mood entry");
      const newMoodEntry = await prisma.moodEntry.create({
        data: {
          userId,
          emotionId,
        },
      });

      console.log(`✅ Mood entry created with ID: ${newMoodEntry.id}`);

      // Revalidate paths to refresh data
      revalidatePath("/");
      revalidatePath("/mood");
      revalidatePath("/chat");

      // Return success with a redirect flag and a timestamp to prevent caching
      return {
        success: true,
        redirect: "/chat",
        timestamp: Date.now(),
        freshSubmission: true,
        moodEntryId: newMoodEntry.id,
      };
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      return {
        error: "Database operation failed: " + dbError.message,
      };
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    return {
      error: "An unexpected error occurred: " + error.message,
    };
  }
}
