import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { EmojiForm } from "./moodCreate";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { redirect } from "next/navigation";
import AlreadySubmittedMood from "../components/AlreadySubmittedMood";
import { Metadata } from "next";

export const metadata = {
  title: "Theramind - Mood Check-in",
  description: "Select how you're feeling today",
};

export default async function MoodPage() {
  // Check authentication
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  // Get user from session
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Check if user has already submitted a mood today
  const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId);

  // Show different UI based on whether mood has been submitted
  if (hasSubmitted) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Today's Mood</h1>
        <AlreadySubmittedMood moodData={moodData} />
      </div>
    );
  }

  // If not submitted yet, show the mood selection form
  return <EmojiForm />;
}
