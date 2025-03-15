// /app/api/journal-save/route.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    // Get the session ID from the cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.log("❌ Journal API: No active session");
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
      console.log("❌ Journal API: Invalid session");
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if session is expired
    if (session.expires <= new Date()) {
      console.log("❌ Journal API: Session expired");
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;
    console.log(`👤 Journal API: Processing for user: ${userId}`);

    // Parse request body first to check if we're in final completion mode
    const { recap, emotionContext, completingFlow } = await request.json();

    // Check if user has already submitted a mood today
    const options = { skipForRedirect: completingFlow === true };
    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId, options);

    if (!hasSubmitted && !completingFlow) {
      console.log("⚠️ Journal API: No mood submitted and not completing flow");
      return new Response(JSON.stringify({ error: "Please set your mood for today first" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a journal already exists for today's mood
    if (moodData?.journalAI && !completingFlow) {
      console.log("⚠️ Journal API: Journal already exists for today");
      return new Response(JSON.stringify({ error: "Journal entry already exists for today" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    if (!recap) {
      console.log("⚠️ Journal API: Missing recap data");
      return new Response(JSON.stringify({ error: "Missing required data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get the emotion data - either from mood data or from the request
    let emotionId;
    if (moodData?.emotion?.id) {
      emotionId = moodData.emotion.id;
    } else {
      // Look up the emotion ID based on the context if provided
      if (emotionContext) {
        const emotion = await prisma.emotion.findFirst({
          where: { name: emotionContext },
        });

        if (emotion) {
          emotionId = emotion.id;
        } else {
          console.log("⚠️ Journal API: Emotion not found for context:", emotionContext);
          return new Response(JSON.stringify({ error: "Invalid emotion context" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      } else {
        console.log("❌ Journal API: No emotion data available");
        return new Response(JSON.stringify({ error: "No emotion data available" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Create journal entry
    console.log(`✏️ Journal API: Creating journal entry with emotion ID ${emotionId}`);
    const journalRecord = await prisma.journalAI.create({
      data: {
        recap,
        userId,
        emotionId,
      },
    });

    // Update the existing mood entry to link to the journal if we have mood data
    if (moodData?.id) {
      console.log(`🔄 Journal API: Updating mood entry ${moodData.id} to link to journal`);
      await prisma.moodEntry.update({
        where: { id: moodData.id },
        data: { journalId: journalRecord.id },
      });
    }

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/mood");
    revalidatePath("/dashboard");

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
    console.error("❌ Journal API error:", error);
    return new Response(JSON.stringify({ error: "Failed to save journal" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
