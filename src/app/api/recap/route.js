import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // 1. Get the session ID from the cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    console.log("Session ID from cookie:", sessionId);

    if (!sessionId) {
      console.log("No sessionId cookie found");
      return new Response(JSON.stringify({ error: "No active session found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Find the session in the DB (and include the user)
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    console.log("Found session:", session);

    if (!session) {
      console.log("No session row in DB for that sessionId");
      return new Response(JSON.stringify({ error: "Invalid session" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Check if session is expired
    if (session.expires <= new Date()) {
      console.log("Session is expired. Expires at:", session.expires);
      return new Response(JSON.stringify({ error: "Session expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Parse request body
    const { messages, emotionContext } = await request.json();
    const userId = session.user.id;

    // 5. Look up the emotion by name
    //    (If you're storing emotionId on the client, adjust accordingly)
    const emotionRecord = await prisma.emotion.findUnique({
      where: { name: emotionContext },
    });
    if (!emotionRecord) {
      console.log("No emotion record found for:", emotionContext);
      return new Response(JSON.stringify({ error: "Emotion not found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6. Create a new MoodEntry
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        emotionId: BigInt(emotionRecord.id),
      },
    });

    // 7. Generate recap via OpenAI
    const recapPrompt = {
      role: "system",
      content:
        "Summarize the conversation below focusing on the user's emotions and the reasons behind them.",
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // or whichever model you prefer
      messages: [recapPrompt, ...messages],
    });

    const summary = response.choices[0].message.content;

    // 8. Save recap in JournalAI
    const journalRecord = await prisma.journalAI.create({
      data: {
        recap: summary,
        userId,
        emotionId: BigInt(emotionRecord.id),
      },
    });

    // 9. Update the MoodEntry to reference the JournalAI record
    const updatedMoodEntry = await prisma.moodEntry.update({
      where: { id: moodEntry.id },
      data: { journalId: journalRecord.id },
    });

    // 10. Return final response with all relevant data
    //     Use a replacer to convert BigInts to strings
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
    console.error("Recap API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate recap summary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
