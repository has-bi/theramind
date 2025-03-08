import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import MoodCard from "./components/moodCard";
import { saveMoodEntry } from "./mood-actions";
import CalendarMoodView from "./calendarMoodView";

export default async function Page() {
  // Get session ID from cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  let userId = null;
  let existingMood = null;

  // Fetch emotions from the mood selection
  const emotions = await prisma.emotion.findMany();

  // Check if we have a session, try to find the user and their mood for today
  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (session) {
      userId = session.user.id;

      // Find today's mood entry if it exists
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const todaysMoodEntry = await prisma.moodEntry.findFirst({
        where: {
          userId: userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          emotion: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      existingMood = todaysMoodEntry?.emotion?.name || null;
    }
  }

  // Create server action with the user ID from session
  const handleMoodSelect = async moodName => {
    "use server";

    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      // Find the emotion
      const emotion = await prisma.emotion.findFirst({
        where: { name: moodName },
      });

      if (!emotion) {
        throw new Error(`Emotion "${moodName}" not found`);
      }

      // Create mood entry
      await prisma.moodEntry.create({
        data: {
          userId,
          emotionId: emotion.id,
        },
      });

      // Revalidate the path to show updated data
      revalidatePath("/");
    } catch (error) {
      console.error("Failed to save mood entry:", error);
      throw error;
    }
  };

  return (
    <div>
      <header className="font-bold text-3xl text-center">Dashboard</header>
      <main>
        <CalendarMoodView />
      </main>
      <div>
        <MoodCard emotions={emotions} existingMood={existingMood} onMoodSelect={saveMoodEntry} />
      </div>
    </div>
  );
}
