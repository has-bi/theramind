// /api/emotion/route.js
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    const body = await request.json();
    const { emotionId, label, imagePath, value } = body;

    console.log("🎭 API: Creating mood entry with:", { emotionId, label, value });

    if (!emotionId || !label || !value) {
      return new Response(JSON.stringify({ error: "Missing required emotion data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
    console.log(`👤 API: Processing mood entry for user: ${userId}`);

    // Check if user has already submitted mood today
    const { hasSubmitted } = await hasSubmittedMood(userId, { skipForRedirect: false });

    if (hasSubmitted) {
      console.log("⚠️ API: User has already submitted a mood entry today");
      return new Response(
        JSON.stringify({
          error: "You have already recorded your mood for today",
          alreadySubmitted: true,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check if an emotion with this ID exists
    let emotion = await prisma.emotion.findUnique({
      where: { id: emotionId },
    });

    // If emotion doesn't exist, create it
    if (!emotion) {
      console.log(`✨ API: Creating new emotion: ${label}`);
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
    console.log("✏️ API: Creating mood entry");
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        emotionId,
      },
    });

    console.log(`✅ API: Mood entry created with ID: ${moodEntry.id}`);

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/mood");
    revalidatePath("/chat");

    return new Response(
      JSON.stringify({
        success: true,
        moodEntry,
        freshSubmission: true,
        timestamp: Date.now(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ API Error saving emotion:", error);
    return new Response(JSON.stringify({ error: "Failed to save emotion" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
