import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    // Await cookies before using them
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "No active session found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find session and include user
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

    const { emotionId } = await request.json();

    // Create a MoodEntry for the authenticated user
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId: session.user.id,
        emotionId: BigInt(emotionId),
      },
    });

    // Use a replacer to handle BigInt serialization
    const jsonResponse = JSON.stringify({ moodEntry }, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    );

    return new Response(jsonResponse, {
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
