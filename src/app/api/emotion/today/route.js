import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    const cookieStore = cookies();
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

    // Define start and end of the day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: { emotion: true },
      orderBy: { createdAt: "desc" },
    });

    if (!moodEntry) {
      return new Response(JSON.stringify({ message: "No mood entry found for today" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ emotionLabel: moodEntry.emotion.name }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching today's emotion:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch today's emotion" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
