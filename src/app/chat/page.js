import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import ChatbotClient from "./ChatbotClient";

export default async function ChatbotPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  let emotionContext = "";

  if (sessionId) {
    try {
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

        // Log database query
        console.log("Searching for mood entry for user:", userId);

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
          console.log("Found emotion from database:", emotionContext);
        } else {
          console.log("No mood entry found for today");
        }
      } else {
        console.log("Invalid session:", sessionId);
      }
    } catch (error) {
      console.error("Error loading emotion from database:", error);
    }
  } else {
    console.log("No session cookie found");
  }

  // IMPORTANT: Pass initialEmotionContext even if empty
  // The client will prioritize localStorage value
  return <ChatbotClient initialEmotionContext={emotionContext} />;
}
