// /dashboard/page.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import MoodCard from "./components/moodCard";
import { saveMoodEntry } from "./mood-actions";
import CalendarMoodView from "./calendarMoodView";
import { getMoodData } from "@/app/api/calendar/getMoodData"; // Import the same function used by calendar

export default async function Page() {
  // Get session ID from cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  let userId = null;
  let existingMood = null;
  let currentStreak = 0;
  let topMoods = [];

  // Fetch emotions from the mood selection
  const emotions = await prisma.emotion.findMany();

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
      let streakActive = !!todaysMoodEntry; // Streak is active if today has an entry

      while (streakActive) {
        // Move to previous day
        checkDate.setDate(checkDate.getDate() - 1);

        const dayStart = new Date(checkDate);
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date(checkDate);
        dayEnd.setHours(23, 59, 59, 999);

        // Check if there's a mood entry for this day
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
          streakActive = false;
        }

        // Prevent infinite loops by limiting to 100 days
        if (currentStreak > 100) break;
      }

      // Add today to streak if it exists
      if (todaysMoodEntry) {
        currentStreak++;
      }

      // Get mood data using the same function that the calendar uses
      const moodData = await getMoodData(sessionId);

      // Calculate top moods from the calendar data
      const moodCounts = {};

      Object.entries(moodData).forEach(([date, mood]) => {
        // Only count moods from the current month
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

      // Add ratio
      topMoods = topMoods.map(mood => ({
        ...mood,
        ratio: `${mood.count}/${daysInMonth}`,
      }));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-800 text-center">Theramind</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Stats section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Streak */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-500"
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
                  <p className="text-gray-500 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-800">{currentStreak} days</p>
                </div>
              </div>
            </div>

            {/* Top Moods */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-3">Top Moods This Month</p>

              {topMoods.length > 0 ? (
                <div className="space-y-2">
                  {topMoods.map((mood, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${getColorForMood(mood.name)}`}
                      ></div>
                      <span className="text-gray-800 capitalize">{mood.name}</span>
                      <span className="ml-auto text-gray-500 text-sm">{mood.ratio}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No mood data yet</p>
              )}
            </div>
          </div>

          {/* Today's Mood Card */}
          <div className="mt-6">
            <MoodCard
              emotions={emotions}
              existingMood={existingMood}
              onMoodSelect={saveMoodEntry}
            />
          </div>

          {/* Calendar Section */}
          <div className="mt-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Your Mood Calendar</h2>
            <CalendarMoodView />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get the right color class for each mood
function getColorForMood(mood) {
  const moodColors = {
    happy: "bg-green-400",
    sad: "bg-blue-300",
    calm: "bg-sky-400",
    angry: "bg-red-400",
    anxious: "bg-purple-300",
    neutral: "bg-gray-300",
    stressed: "bg-orange-300",
    excited: "bg-yellow-300",
    tired: "bg-indigo-300",
    confused: "bg-pink-300",
    grateful: "bg-teal-400",
    loved: "bg-rose-300",
  };

  return moodColors[mood.toLowerCase()] || "bg-gray-300";
}
