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
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = session.user.id;

    // Check if user has already submitted a mood
    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId);

    if (!hasSubmitted) {
      return new Response(JSON.stringify({ error: "Please set your mood for today first" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if a journal already exists for today's mood
    if (moodData.journal) {
      return new Response(JSON.stringify({ error: "Chat session already completed for today" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Now proceed with the chat
    const body = await request.json();
    const { messages } = body;
    const emotionContext = moodData.emotion.name;

    let systemContent = CHAT_SYSTEM_PROMPT;

    // Append emotion context
    systemContent += `\n\nThe user's emotion today is: ${emotionContext}.`;

    const validMessages = messages.filter(msg =>
      ["system", "assistant", "user", "function", "tool", "developer"].includes(msg.role)
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemContent }, ...validMessages],
    });

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
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch response from OpenAI" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
