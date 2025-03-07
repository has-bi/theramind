import OpenAI from "openai";
import { CHAT_SYSTEM_PROMPT } from "@/utils/prompts/chatSystemPrompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages, emotionContext } = body;

    let systemContent = CHAT_SYSTEM_PROMPT;

    // Append emotion context if available
    if (emotionContext) {
      systemContent += `\n\nThe user's emotion today is: ${emotionContext}.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemContent }, ...messages],
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message.content }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch response from OpenAI" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
