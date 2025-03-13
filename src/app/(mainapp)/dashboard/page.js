import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import MoodCard from "./components/moodCard";
import { saveMoodEntry } from "./mood-actions";
import CalendarMoodView from "./calendarMoodView";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import Image from "next/image";

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
    <div className="mobile-container bg-white">
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Home</h1>
            <p className="text-xs text-gray-500">Welcome to Theramind!</p>
          </div>
        </div>
      </header>

      <div className="page-container">
        {/* 1. MOOD CARD - Primary section */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            {existingMood ? "Today's Mood" : "How are you feeling?"}
          </h2>
          <MoodCard
            emotions={dbEmotions.length > 0 ? dbEmotions : emotions}
            existingMood={existingMood}
            onMoodSelect={saveMoodEntry}
          />
        </div>

        {/* 2. CALENDAR - Second section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-gray-700">Your Mood Calendar</h2>
          </div>
          <div className="mood-card bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <CalendarMoodView />
          </div>
        </div>

        {/* 3. STATS - Bottom section */}
        <div className="mb-20">
          <h2 className="text-base font-semibold text-gray-700 mb-3">Your Stats</h2>
          <div className="flex flex-col gap-4">
            {/* Streak Card */}
            <div className="mood-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-50 rounded-xl mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{currentStreak}</p>
                  <p className="text-xs text-gray-500 mt-1">day streak</p>
                </div>
              </div>
              {currentStreak > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-600">
                    {currentStreak === 1
                      ? "Great start! The journey of tracking begins with a single day."
                      : currentStreak === 2
                      ? "Day 2! You're on your way to building a healthy habit."
                      : currentStreak >= 3 && currentStreak <= 6
                      ? "You're building consistency! A few more days to make it a solid habit."
                      : currentStreak >= 7 && currentStreak <= 13
                      ? "Impressive streak! You're making mood tracking a regular part of your routine."
                      : currentStreak >= 14 && currentStreak <= 29
                      ? "Fantastic commitment! You're becoming a mood awareness expert."
                      : "Amazing! You've reached champion status with your dedication to emotional wellness."}
                  </p>
                </div>
              )}
            </div>

            {/* Top Moods Card with Insights */}
            <div className="mood-card bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-3">Top Mood</p>

              {topMoods.length > 0 ? (
                <div>
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      <Image
                        src={topMoods[0].imagePath}
                        alt={topMoods[0].name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-800 capitalize">
                        {topMoods[0].name}
                      </p>
                      <p className="text-xs text-gray-500">{topMoods[0].count} days this month</p>
                    </div>
                  </div>

                  {/* Mood insights based on emotion category */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                      {/* Positive emotions */}
                      {topMoods[0].name === "Happy" ||
                      topMoods[0].name === "Calm" ||
                      topMoods[0].name === "Excited" ||
                      topMoods[0].name === "Grateful" ||
                      topMoods[0].name === "Loved"
                        ? `You've been feeling ${topMoods[0].name.toLowerCase()} most often. That's great! Keep noting what contributes to this positive state.`
                        : /* Negative emotions */
                        topMoods[0].name === "Sad" ||
                          topMoods[0].name === "Angry" ||
                          topMoods[0].name === "Anxious" ||
                          topMoods[0].name === "Stressed"
                        ? `You've been feeling ${topMoods[0].name.toLowerCase()} most often. Consider taking time for self-care activities that help lift your mood.`
                        : /* Neutral emotions */
                        topMoods[0].name === "Neutral" ||
                          topMoods[0].name === "Tired" ||
                          topMoods[0].name === "Confused"
                        ? `You've been feeling ${topMoods[0].name.toLowerCase()} most often this month. Noticing patterns helps you understand what affects your energy and clarity.`
                        : /* Fallback for any other emotions */
                          `You've been feeling ${topMoods[0].name.toLowerCase()} most often this month. Regular tracking helps reveal your emotional patterns.`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">No mood data yet</p>
                  <p className="text-xs text-gray-400 mt-1">Track daily to see your patterns</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
