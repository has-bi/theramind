// actions/mood-actions.js
"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function saveMoodEntry(moodName) {
  // Get user ID from session cookie
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    throw new Error("User not authenticated");
  }

  // Get the user ID from session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    throw new Error("Invalid session");
  }

  const userId = session.user.id;

  try {
    // Find the emotion
    const emotion = await prisma.emotion.findFirst({
      where: { name: moodName },
    });

    if (!emotion) {
      throw new Error(`Emotion "${moodName}" not found`);
    }

    // Create mood entry
    await prisma.moodEntry.create({
      data: {
        userId,
        emotionId: emotion.id,
      },
    });

    // Revalidate the path to show updated data
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to save mood entry:", error);
    throw error;
  }
}
