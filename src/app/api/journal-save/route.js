// /app/api/journal-save/route.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";

export async function POST(request) {
  try {
    // Get the session ID from the cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      return new Response(JSON.stringify({ error: "No active session found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find the session in the DB (and include the user)
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

    // Check if session is expired
    if (session.expires <= new Date()) {
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { recap, emotionContext } = await request.json();
    const userId = session.user.id;

    // Validate required fields
    if (!recap || !emotionContext) {
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Look up the emotion by name
    const emotionRecord = await prisma.emotion.findFirst({
      where: { name: emotionContext },
    });

    if (!emotionRecord) {
      return new Response(JSON.stringify({ error: "Emotion not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create journal entry
    const journalRecord = await prisma.journalAI.create({
      data: {
        recap,
        userId,
        emotionId: BigInt(emotionRecord.id),
      },
    });

    // Find and update today's mood entry if it exists
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todaysMoodEntry = await prisma.moodEntry.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (todaysMoodEntry) {
      await prisma.moodEntry.update({
        where: { id: todaysMoodEntry.id },
        data: { journalId: journalRecord.id },
      });
    }

    // Return success response
    const jsonResponse = JSON.stringify({
      success: true,
      journalId: journalRecord.id.toString(),
    });

    return new Response(jsonResponse, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Save journal API error:", error);
    return new Response(JSON.stringify({ error: "Failed to save journal" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
