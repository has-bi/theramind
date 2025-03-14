import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import DashboardClient from "./components/DashboardClient";
import CalendarView from "./calendarView";
import { Suspense } from "react";
import { convertToUTC7, getUTC7StartOfDay, getUTC7EndOfDay } from "@/utils/dateTime";

// Placeholder while the calendar is loading
function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );
}

export default async function DashboardPage() {
  // Get session ID from cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  let userId = null;
  let existingMood = null;
  let currentStreak = 0;
  let topMoods = [];
  let emotionsData = [];

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

  try {
    // Fetch emotions from database
    emotionsData = await prisma.emotion.findMany();

    if (sessionId) {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
      });

      if (session) {
        userId = session.user.id;

        // Find today's mood entry if it exists using UTC+7 timezone
        const now = new Date();
        const utcStartOfDay = getUTC7StartOfDay(now);
        const utcEndOfDay = getUTC7EndOfDay(now);

        const todaysMoodEntry = await prisma.moodEntry.findFirst({
          where: {
            userId: userId,
            createdAt: {
              gte: utcStartOfDay,
              lte: utcEndOfDay,
            },
          },
          include: {
            emotion: true,
            journalAI: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        existingMood = todaysMoodEntry?.emotion?.name || null;

        // Calculate current streak using UTC+7 timezone
        let checkDate = new Date(now);
        let hasGap = false;
        let todayCounted = false;

        // First, check today
        if (todaysMoodEntry) {
          currentStreak = 1;
          todayCounted = true;
        }

        // Then check previous days
        while (!hasGap && currentStreak < 100) {
          // Move check date to previous day
          checkDate.setDate(checkDate.getDate() - 1);

          // Get UTC+7 day boundaries for the checkDate
          const dayStart = getUTC7StartOfDay(checkDate);
          const dayEnd = getUTC7EndOfDay(checkDate);

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
        }

        // Get mood data using the same function that the calendar uses
        const moodData = await getMoodData(sessionId);

        // Calculate top moods from the calendar data
        const moodCounts = {};

        // Get current month in UTC+7 timezone
        const utc7Now = convertToUTC7(now);
        const currentMonth = utc7Now.getMonth();
        const currentYear = utc7Now.getFullYear();

        Object.entries(moodData).forEach(([date, mood]) => {
          const entryDate = new Date(date);
          // We need to keep this in UTC as the date strings from getMoodData are already adjusted
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
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }

  // Pass data to client component and wrap CalendarView in Suspense to prevent blocking
  return (
    <DashboardClient
      serverEmotions={emotionsData.length > 0 ? emotionsData : emotions}
      serverUserId={userId}
      serverExistingMood={existingMood}
      serverCurrentStreak={currentStreak}
      serverTopMoods={topMoods}
      calendarView={
        <Suspense fallback={<CalendarSkeleton />}>
          <CalendarView />
        </Suspense>
      }
    />
  );
}
