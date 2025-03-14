import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import ChatbotClient from "./ChatbotClient";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { redirect } from "next/navigation";
import AlreadySubmittedMood from "../components/AlreadySubmittedMood";

export default async function ChatbotPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    // Redirect to login if user isn't authenticated
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    // Redirect to login if session is invalid
    redirect("/login");
  }

  const userId = session.user.id;

  // Check if user has submitted a mood today
  const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId);

  // If user hasn't submitted a mood yet, redirect to mood page
  if (!hasSubmitted) {
    redirect("/mood");
  }

  // If user has already submitted a journal for today's mood, show "already completed" UI
  if (hasSubmitted && moodData?.journal) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Chat Complete</h1>
        <AlreadySubmittedMood moodData={moodData} />
      </div>
    );
  }

  // Return the chat client with the user's emotion context
  return <ChatbotClient initialEmotionContext={moodData?.emotion?.name || ""} />;
}
