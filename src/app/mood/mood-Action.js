"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";

export async function createMoodAction(_, formData) {
  try {
    console.log("Server action called with data:", {
      emotionId: formData.get("emotionId"),
      label: formData.get("label"),
      value: formData.get("value"),
    });

    const emotionId = Number(formData.get("emotionId"));
    const label = formData.get("label");
    const imagePath = formData.get("imagePath");
    const value = formData.get("value");

    if (!emotionId || !label || !value) {
      console.error("Missing required emotion data");
      return {
        error: "Missing required emotion data",
        debug: { emotionId, label, value },
      };
    }

    // Get the session cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.error("No active session found");
      return { error: "No active session" };
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      console.error("Invalid session:", sessionId);
      return { error: "Invalid session" };
    }

    const userId = session.user.id;
    console.log("User found:", userId);

    try {
      // Check if an emotion with this ID exists
      let emotion = await prisma.emotion.findUnique({
        where: { id: emotionId },
      });

      // If emotion doesn't exist, create it
      if (!emotion) {
        console.log("Creating new emotion:", { emotionId, label });
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
      console.log("Creating mood entry for user:", userId);
      await prisma.moodEntry.create({
        data: {
          userId,
          emotionId,
        },
      });

      // Revalidate the path to refresh data
      revalidatePath("/");

      console.log("Mood entry created successfully, returning success");
      return { success: true, redirect: "/chat" };
    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return {
        error: "Database operation failed: " + dbError.message,
        code: dbError.code,
      };
    }
  } catch (error) {
    console.error("Unexpected error in createMoodAction:", error);
    return {
      error: "An unexpected error occurred: " + error.message,
      stack: error.stack,
    };
  }
}
