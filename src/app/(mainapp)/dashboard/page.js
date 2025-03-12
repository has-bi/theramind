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

      // Pertama, cek hari ini
      if (todaysMoodEntry) {
        currentStreak = 1;
        todayCounted = true;
      }

      // Kemudian cek hari-hari sebelumnya
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
          imagePath: matchingEmotion?.imagePath || "/images/emotions/neutral.png",
        };
      });
    }
  }

  // Format day for header
  const today = new Date();
  const options = { weekday: "long", day: "numeric", month: "long" };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <div className="page-container bg-white px-4 pt-6">
      {/* Modern minimalist header */}
      <header className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">Home</h1>
        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
      </header>

      {/* 1. MOOD CARD - First section */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <MoodCard
            emotions={dbEmotions.length > 0 ? dbEmotions : emotions}
            existingMood={existingMood}
            onMoodSelect={saveMoodEntry}
          />
        </div>
      </div>

      {/* 2. CALENDAR - Second section */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Your Mood Calendar</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-hidden">
          <CalendarMoodView />
        </div>
      </div>

      {/* 3. STATS (Current Streak & Top 3 Moods) - Bottom section */}
      <div className="mb-20">
        <h2 className="text-base font-semibold text-gray-700 mb-3">Your Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Current Streak - Left Column */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-50 rounded-xl mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-500"
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
                <p className="text-3xl font-bold text-indigo-700">{currentStreak}</p>
                <p className="text-xs font-medium text-gray-500 mt-1">day streak</p>
              </div>
            </div>
          </div>

          {/* Top 3 Moods - Right Column */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-3">Top 3 Moods</p>

            {topMoods.length > 0 ? (
              <div className="space-y-3">
                {topMoods.map((mood, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 bg-mood-${mood.name.toLowerCase()}`}
                    >
                      <Image
                        src={mood.imagePath}
                        alt={mood.name}
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700 capitalize flex-1 truncate">
                      {mood.name}
                    </span>
                    <span className="text-xs text-gray-500">{mood.count}d</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center py-4">
                <p className="text-sm text-gray-400">No data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get background colors for mood cards
function getMoodCardColor(mood) {
  const moodColors = {
    happy: "bg-green-100",
    sad: "bg-blue-100",
    calm: "bg-sky-100",
    angry: "bg-red-100",
    anxious: "bg-purple-100",
    neutral: "bg-gray-100",
    stressed: "bg-orange-100",
    excited: "bg-yellow-100",
    tired: "bg-indigo-100",
    confused: "bg-pink-100",
    grateful: "bg-teal-100",
    loved: "bg-rose-100",
  };

  return moodColors[mood?.toLowerCase()] || "bg-gray-100";
}
