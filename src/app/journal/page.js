"use client";

import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

export default async function ChatbotPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  let emotionContext = "";

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (session) {
      const userId = session.user.id;
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const moodEntry = await prisma.moodEntry.findFirst({
        where: {
          userId,
          createdAt: { gte: startOfDay, lte: endOfDay },
        },
        include: { emotion: true },
        orderBy: { createdAt: "desc" },
      });

      if (moodEntry) {
        emotionContext = moodEntry.emotion.name;
      }
    }
  }

  return <ChatbotClient initialEmotionContext={emotionContext} />;
}
