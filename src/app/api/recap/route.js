import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { OpenAI } from "openai";
import { RECAP_SYSTEM_PROMPT } from "@/utils/prompts/recapSystemPrompt";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Get the session ID from the cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.log("❌ Recap API: No active session");
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
      console.log("❌ Recap API: Invalid session");
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if session is expired
    if (session.expires <= new Date()) {
      console.log("❌ Recap API: Session expired");
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;
    console.log(`👤 Recap API: Processing for user: ${userId}`);

    // Check if we're in the mood->chat->recap flow
    const inCompletionFlow = request.headers.get("x-completion-flow") === "true";

    // Check if user has already submitted a mood today and if they already have a journal
    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId, {
      skipForRedirect: inCompletionFlow,
    });

    if (!hasSubmitted && !inCompletionFlow) {
      console.log("⚠️ Recap API: No mood submitted and not in completion flow");
      return new Response(JSON.stringify({ error: "Please set your mood for today first" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a journal already exists for today's mood
    if (moodData?.journalAI && !inCompletionFlow) {
      console.log("⚠️ Recap API: Journal already exists for today");
      return new Response(JSON.stringify({ error: "Journal entry already exists for today" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const { messages } = await request.json();

    // Validate that we have message to summarize
    if (!messages || messages.length < 2) {
      console.log("⚠️ Recap API: Not enough conversation data");
      return new Response(
        JSON.stringify({
          error: "Not enough conversation data to generate a recap",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate recap via OpenAI
    const recapPrompt = {
      role: "system",
      content: RECAP_SYSTEM_PROMPT,
    };

    const validMessages = messages.filter(msg =>
      ["system", "assistant", "user", "function", "tool", "developer"].includes(msg.role)
    );

    console.log(`💬 Recap API: Sending ${validMessages.length} messages to OpenAI`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [recapPrompt, ...validMessages],
    });

    const summary = response.choices[0].message.content;
    console.log("✅ Recap API: Generated summary");

    // Get the latest mood entry for this user if moodData is null
    const moodEntry =
      moodData ||
      (await prisma.moodEntry.findFirst({
        where: { userId },
        include: { emotion: true },
        orderBy: { createdAt: "desc" },
      }));

    if (!moodEntry) {
      console.log("❌ Recap API: No mood entry found");
      return new Response(JSON.stringify({ error: "No mood entry found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save recap in JournalAI
    console.log(`✏️ Recap API: Creating journal for mood entry ${moodEntry.id}`);
    const journalRecord = await prisma.journalAI.create({
      data: {
        recap: summary,
        userId,
        emotionId: moodEntry.emotionId,
      },
    });

    // Update the MoodEntry to reference the JournalAI record
    console.log(`🔄 Recap API: Updating mood entry to link to journal`);
    const updatedMoodEntry = await prisma.moodEntry.update({
      where: { id: moodEntry.id },
      data: { journalId: journalRecord.id },
    });

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/mood");
    revalidatePath("/dashboard");

    // Return final response with all relevant data
    // Use a replacer to convert BigInts to strings
    const jsonResponse = JSON.stringify(
      {
        summary,
        moodEntry: updatedMoodEntry,
        journalRecord,
      },
      (key, value) => (typeof value === "bigint" ? value.toString() : value)
    );

    return new Response(jsonResponse, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Recap API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recap summary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
