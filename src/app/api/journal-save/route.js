// /app/api/journal-save/route.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";

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

    const userId = session.user.id;

    // Check if user has already submitted a mood today
    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId);

    if (!hasSubmitted) {
      return new Response(JSON.stringify({ error: "Please set your mood for today first" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a journal already exists for today's mood
    if (moodData.journal) {
      return new Response(JSON.stringify({ error: "Journal entry already exists for today" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { recap } = await request.json();
    const emotionContext = moodData.emotion.name;

    // Validate required fields
    if (!recap) {
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create journal entry
    const journalRecord = await prisma.journalAI.create({
      data: {
        recap,
        userId,
        emotionId: moodData.emotion.id,
      },
    });

    // Update the existing mood entry to link to the journal
    await prisma.moodEntry.update({
      where: { id: moodData.id },
      data: { journalId: journalRecord.id },
    });

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
