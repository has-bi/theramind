import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { EmojiForm } from "./moodCreate";
import { hasSubmittedMood } from "@/utils/hasSubmittedMood";
import { redirect } from "next/navigation";
import AlreadySubmittedMood from "../components/AlreadySubmittedMood";

export default async function MoodPage({ searchParams }) {
  // Check if we have a direct chat redirect parameter
  const directToChat = searchParams?.redirect === "chat";
  if (directToChat) {
    redirect("/chat");
  }

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
  console.log(`Loading mood page for user: ${userId}`);

  // Check if user has already submitted a mood today
  try {
    const { hasSubmitted, data: moodData } = await hasSubmittedMood(userId);
    console.log(`Has user submitted mood today: ${hasSubmitted}`);

    // If the user has NOT submitted a mood and is not otherwise redirected,
    // show the mood selection form
    if (!hasSubmitted) {
      console.log("Rendering mood selection form");
      return <EmojiForm />;
    }

    // If the user HAS submitted a mood, show the already submitted screen
    console.log("Showing already submitted mood screen");
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center mb-6">Today's Mood</h1>
        <AlreadySubmittedMood moodData={moodData} />
      </div>
    );
  } catch (error) {
    console.error("Error checking mood submission:", error);
    // If there's an error checking the submission, still show the form
    // This way, the user can try submitting again
    return <EmojiForm />;
  }
}
