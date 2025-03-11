// /api/emotion/route.js
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const { emotionId, label, imagePath, value } = await request.json();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "No active session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
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
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        emotionId,
      },
    });

    return new Response(JSON.stringify({ success: true, moodEntry }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving emotion:", error);
    return new Response(JSON.stringify({ error: "Failed to save emotion" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
