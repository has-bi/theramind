"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";

export async function createMoodAction(_, formData) {
  const emotionId = Number(formData.get("emotionId"));
  const label = formData.get("label");
  const imagePath = formData.get("imagePath");
  const value = formData.get("value");

  try {
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

    // Revalidate the path to refresh data
    revalidatePath("/");

    // Return success with redirect info instead of redirecting directly
    return { success: true, redirect: "/journal" };
  } catch (error) {
    console.error("Error saving emotion:", error);
    return { error: "An unexpected error occurred: " + error.message };
  }
}
