import OpenAI from "openai";
import { CHAT_SYSTEM_PROMPT } from "@/utils/prompts/chatSystemPrompt";
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Check authentication first
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      console.log("❌ Chat API: No active session");
      return new Response(JSON.stringify({ error: "No active session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      console.log("❌ Chat API: Invalid session");
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;
    console.log(`👤 Chat API: Processing for user: ${userId}`);

    // Check if user has already submitted a mood - with journey awareness
    // We use skipForRedirect: true when we're in the middle of the mood->chat flow
    // Check localStorage on client-side to see if we're in a fresh submission
    const isFreshSubmission = request.headers.get("x-fresh-submission") === "true";
    const options = { skipForRedirect: isFreshSubmission };

    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId, options);

    if (!hasSubmitted && !isFreshSubmission) {
      console.log("⚠️ Chat API: No mood submitted and not a fresh submission");
      return new Response(JSON.stringify({ error: "Please set your mood for today first" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a journal already exists for today's mood
    if (moodData?.journalAI) {
      console.log("⚠️ Chat API: Journal already exists for today");
      return new Response(JSON.stringify({ error: "Chat session already completed for today" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Now proceed with the chat
    const body = await request.json();
    const { messages } = body;

    // We need to handle the case where moodData might be null in a fresh submission scenario
    // In that case, check localStorage for emotion context
    let emotionContext = moodData?.emotion?.name;

    // If no emotion context from database, this means we're in a race condition
    // where the mood entry is being created but we're already trying to chat
    if (!emotionContext && isFreshSubmission) {
      console.log("ℹ️ Chat API: Using fresh submission, checking recent mood entries");

      // Try to get the most recent mood entry as a fallback
      const recentMood = await prisma.moodEntry.findFirst({
        where: {
          userId: userId,
        },
        include: {
          emotion: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (recentMood?.emotion?.name) {
        emotionContext = recentMood.emotion.name;
        console.log(`✅ Chat API: Found recent emotion: ${emotionContext}`);
      } else {
        // If still no emotion context, use what's in the request headers
        emotionContext = request.headers.get("x-emotion-context") || "Neutral";
        console.log(`ℹ️ Chat API: Using header emotion: ${emotionContext}`);
      }
    }

    let systemContent = CHAT_SYSTEM_PROMPT;

    // Append emotion context
    systemContent += `\n\nThe user's emotion today is: ${emotionContext}.`;
    console.log(`🎭 Chat API: Using emotion context: ${emotionContext}`);

    const validMessages = messages.filter(msg =>
      ["system", "assistant", "user", "function", "tool", "developer"].includes(msg.role)
    );

    console.log(`💬 Chat API: Sending ${validMessages.length} messages to OpenAI`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemContent }, ...validMessages],
    });

    console.log("✅ Chat API: Got response from OpenAI");
    return new Response(
      JSON.stringify({
        reply: response.choices[0].message.content,
        emotionContext,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch response from OpenAI" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
