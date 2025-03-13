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
  let currentStreak = 0;
  let topMoods = [];

  // Emotion definitions for consistent reference
  const emotions = [
    { id: 1, label: "Happy", imagePath: "/images/emotions/happy.png", value: "Happy" },
    { id: 2, label: "Sad", imagePath: "/images/emotions/sad.png", value: "Sad" },
    { id: 3, label: "Calm", imagePath: "/images/emotions/calm.png", value: "Calm" },
    { id: 4, label: "Angry", imagePath: "/images/emotions/angry.png", value: "Angry" },
    { id: 5, label: "Anxious", imagePath: "/images/emotions/anxious.png", value: "Anxious" },
    { id: 6, label: "Neutral", imagePath: "/images/emotions/neutral.png", value: "Neutral" },
    { id: 7, label: "Stressed", imagePath: "/images/emotions/stressed.png", value: "Stressed" },
    { id: 8, label: "Excited", imagePath: "/images/emotions/excited.png", value: "Excited" },
    { id: 9, label: "Tired", imagePath: "/images/emotions/tired.png", value: "Tired" },
    { id: 10, label: "Confused", imagePath: "/images/emotions/confused.png", value: "Confused" },
    { id: 12, label: "Grateful", imagePath: "/images/emotions/grateful.png", value: "Grateful" },
    { id: 11, label: "Loved", imagePath: "/images/emotions/loved.png", value: "Loved" },
  ];

  // Fetch emotions from database
  const dbEmotions = await prisma.emotion.findMany();

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

      // Calculate current streak
      const now = new Date();
      let checkDate = new Date(now);
      let hasGap = false;
      let todayCounted = false;

      // First, check today
      if (todaysMoodEntry) {
        currentStreak = 1;
        todayCounted = true;
      }

      // Then check previous days
      checkDate.setDate(checkDate.getDate() - 1);

      while (!hasGap) {
        const dayStart = new Date(checkDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        const entryExists = await prisma.moodEntry.findFirst({
          where: {
            userId: userId,
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        });

        if (entryExists) {
          currentStreak++;
        } else {
          hasGap = true;
        }

        checkDate.setDate(checkDate.getDate() - 1);
        if (currentStreak > 100) break;
      }

      // Get mood data using the same function that the calendar uses
      const moodData = await getMoodData(sessionId);

      // Calculate top moods from the calendar data
      const moodCounts = {};

      Object.entries(moodData).forEach(([date, mood]) => {
        const entryDate = new Date(date);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
          moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        }
      });

      // Convert to array and sort by count
      topMoods = Object.entries(moodCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Get top 3

      // Get days in current month
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      // Add ratio and image path
      topMoods = topMoods.map(mood => {
        // Find matching emotion to get image path
        const matchingEmotion = emotions.find(
          e => e.label.toLowerCase() === mood.name.toLowerCase()
        );
        return {
          ...mood,
          ratio: `${mood.count}/${daysInMonth}`,
          imagePath:
            matchingEmotion?.imagePath || `/images/emotions/${mood.name.toLowerCase()}.png`,
        };
      });
    }
  }

  // Format day for header
  const today = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  // Get current month name for calendar heading
  const monthName = today.toLocaleDateString("en-US", { month: "long" });

  return (
    <div>
      Temporary (protected) Dashboard Page
      <header className="font-bold text-3xl text-center">Dashboard</header>
      <main>
        <CalendarMoodView />
      </main>
    </div>
  );
}
