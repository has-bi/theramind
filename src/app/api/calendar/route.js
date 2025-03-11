"use server";

import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
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

    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId: userId },
      include: { emotion: true },
      orderBy: { createdAt: "asc" },
    });

    const CalendarMoodData = moodEntries.map(entry => ({
      userId: userId,
      createdAt: entry.createdAt,
      emotionName: entry.emotion.name,
    }));

    return new Response(JSON.stringify(CalendarMoodData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching mood data:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch mood data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
