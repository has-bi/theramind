// app/(mainapp)/dashboard/page.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import DashboardClient from "./components/DashboardClient";
import CalendarView from "./calendarView";
import { Suspense } from "react";
import { convertToUTC7, getUTC7StartOfDay, getUTC7EndOfDay } from "@/utils/dateTime";
import { unstable_cache } from "next/cache";

// Placeholder while the calendar is loading
function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl"></div>
    </div>
  );
}

/**
 * Helper function to safely handle BigInt serialization
 */
function serializeBigInt(data) {
  if (data === null || data === undefined) {
    return data;
  }

  // Convert to string and back to handle BigInt
  const jsonString = JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? Number(value) : value
  );

  return JSON.parse(jsonString);
}

// Debug log function
function logDebug(message, data) {
  console.log(`[DEBUG] ${message}`, data);
}

// Emotion data with BigInt handling
const getEmotions = unstable_cache(
  async () => {
    try {
      const emotionsData = await prisma.emotion.findMany();

      // Handle BigInt serialization
      const serializedData = serializeBigInt(emotionsData);

      if (serializedData.length > 0) {
        return serializedData;
      }
    } catch (error) {
      console.log("Error fetching emotions:", error);
    }

    // Fallback emotions if database fails or is empty
    return [
      { id: 1, name: "Happy", imagePath: "/images/emotions/happy.png" },
      { id: 2, name: "Sad", imagePath: "/images/emotions/sad.png" },
      { id: 3, name: "Calm", imagePath: "/images/emotions/calm.png" },
      { id: 4, name: "Angry", imagePath: "/images/emotions/angry.png" },
      { id: 5, name: "Anxious", imagePath: "/images/emotions/anxious.png" },
      { id: 6, name: "Neutral", imagePath: "/images/emotions/neutral.png" },
      { id: 7, name: "Stressed", imagePath: "/images/emotions/stressed.png" },
      { id: 8, name: "Excited", imagePath: "/images/emotions/excited.png" },
      { id: 9, name: "Tired", imagePath: "/images/emotions/tired.png" },
      { id: 10, name: "Confused", imagePath: "/images/emotions/confused.png" },
      { id: 11, name: "Loved", imagePath: "/images/emotions/loved.png" },
      { id: 12, name: "Grateful", imagePath: "/images/emotions/grateful.png" },
    ];
  },
  ["emotions-data"],
  { revalidate: 3600 } // Cache for 1 hour
);

// Optimized function to calculate streak - handles UUID userId
async function calculateStreak(userId) {
  // UUID validation - must be a string
  if (typeof userId !== "string" || !userId) {
    console.log("Invalid userId for streak calculation (must be string UUID):", userId);
    return 0;
  }

  logDebug("calculateStreak with userId", {
    userId,
    type: typeof userId,
  });

  const now = new Date();
  const today = getUTC7StartOfDay(now);

  // Get last 100 days of entries to calculate streak
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 100);

  try {
    const entriesRaw = await prisma.moodEntry.findMany({
      where: {
        userId: userId, // Keep as string UUID
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logDebug("Streak entries found", { count: entriesRaw.length });

    // Early return if no entries
    if (!entriesRaw || entriesRaw.length === 0) {
      return 0;
    }

    // Manually transform dates to ensure they're Date objects
    const entries = entriesRaw.map(entry => ({
      ...entry,
      createdAt: new Date(entry.createdAt),
    }));

    // Convert all dates to UTC+7 day strings for comparison
    const entryDates = entries.map(entry => {
      const date = convertToUTC7(entry.createdAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    });

    // Get unique days (in case of multiple entries per day)
    const uniqueDays = [...new Set(entryDates)];
    uniqueDays.sort().reverse(); // Sort in descending order

    logDebug("Unique days found", { count: uniqueDays.length, first: uniqueDays[0] });

    // Calculate streak
    let streak = 0;
    const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    // Check if there's an entry for today
    const hasTodayEntry = uniqueDays[0] === todayStr;
    if (hasTodayEntry) {
      streak = 1;
    } else if (uniqueDays.length > 0) {
      // If first entry is yesterday, start streak at 1
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

      if (uniqueDays[0] === yesterdayStr) {
        streak = 1;
      } else {
        return 0; // No streak if most recent entry is not today or yesterday
      }
    }

    // Count consecutive days
    let i = 1;
    while (i < uniqueDays.length && streak > 0) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - streak);
      const expectedDateStr = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;

      if (uniqueDays[i] === expectedDateStr) {
        streak++;
        i++;
      } else {
        break;
      }
    }

    logDebug("Final streak count", { streak });
    return streak;
  } catch (error) {
    console.log("Error calculating streak:", error);
    return 0; // Return 0 streak on error
  }
}

export default async function DashboardPage() {
  // Get session ID from cookie
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  logDebug("Processing dashboard with sessionId", {
    sessionId,
    exists: Boolean(sessionId),
  });

  let userId = null;
  let existingMood = null;
  let currentStreak = 0;
  let topMoods = [];
  let emotions = [];

  try {
    // 1. Get emotions from cache with error handling
    try {
      emotions = await getEmotions();
      logDebug("Emotions loaded", { count: emotions.length });
    } catch (cacheError) {
      console.log("Error with cached emotions, using fallback:", cacheError);
      // Fallback in case cache fails
      emotions = [
        { id: 1, name: "Happy", imagePath: "/images/emotions/happy.png" },
        { id: 2, name: "Sad", imagePath: "/images/emotions/sad.png" },
        { id: 3, name: "Calm", imagePath: "/images/emotions/calm.png" },
        { id: 4, name: "Angry", imagePath: "/images/emotions/angry.png" },
        { id: 5, name: "Anxious", imagePath: "/images/emotions/anxious.png" },
        { id: 6, name: "Neutral", imagePath: "/images/emotions/neutral.png" },
        { id: 7, name: "Stressed", imagePath: "/images/emotions/stressed.png" },
        { id: 8, name: "Excited", imagePath: "/images/emotions/excited.png" },
        { id: 9, name: "Tired", imagePath: "/images/emotions/tired.png" },
        { id: 10, name: "Confused", imagePath: "/images/emotions/confused.png" },
        { id: 11, name: "Loved", imagePath: "/images/emotions/loved.png" },
        { id: 12, name: "Grateful", imagePath: "/images/emotions/grateful.png" },
      ];
    }

    // 2. If we have a session ID, process all data in parallel
    if (sessionId) {
      try {
        // Get session data first since we need userId
        const sessionRaw = await prisma.session.findUnique({
          where: { id: sessionId },
          include: { user: true },
        });

        // Handle BigInt serialization for session data
        const session = sessionRaw ? serializeBigInt(sessionRaw) : null;

        logDebug("Session data", {
          found: Boolean(session),
          userId: session?.user?.id,
          userIdType: session?.user?.id ? typeof session.user.id : "none",
        });

        if (session?.user?.id) {
          // Ensure userId is a string since our schema uses UUIDs
          userId = String(session.user.id);

          logDebug("User ID for queries", {
            userId,
            type: typeof userId,
          });

          // Set up query for today's mood
          const now = new Date();
          const utcStartOfDay = getUTC7StartOfDay(now);
          const utcEndOfDay = getUTC7EndOfDay(now);

          logDebug("Date ranges for today's mood", {
            utcStartOfDay,
            utcEndOfDay,
          });

          // Process queries in parallel
          try {
            const [todaysMoodEntryRaw, moodData, streakCount] = await Promise.all([
              // Get today's mood
              prisma.moodEntry
                .findFirst({
                  where: {
                    userId: userId, // String UUID
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
                })
                .then(result => serializeBigInt(result)),

              // Get all mood data for calendar
              getMoodData(sessionId).catch(error => {
                console.log("Error fetching mood data:", error);
                return {};
              }),

              // Calculate streak
              calculateStreak(userId),
            ]);

            // Process results
            existingMood = todaysMoodEntryRaw?.emotion?.name || null;
            currentStreak = streakCount;

            logDebug("Queries completed successfully", {
              hasTodaysMood: Boolean(todaysMoodEntryRaw),
              moodDataEntries: Object.keys(moodData).length,
              currentStreak,
            });

            // Calculate top moods
            const moodCounts = {};

            // Get current month in UTC+7 timezone
            const utc7Now = convertToUTC7(now);
            const currentMonth = utc7Now.getMonth();
            const currentYear = utc7Now.getFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            // Count moods for current month
            Object.entries(moodData).forEach(([date, mood]) => {
              const entryDate = new Date(date);
              if (
                entryDate.getMonth() === currentMonth &&
                entryDate.getFullYear() === currentYear
              ) {
                const emotionName = mood.emotionName;
                moodCounts[emotionName] = (moodCounts[emotionName] || 0) + 1;
              }
            });

            // Sort and format top moods
            topMoods = Object.entries(moodCounts)
              .map(([name, count]) => ({
                name,
                count,
                ratio: `${count}/${daysInMonth}`,
                imagePath:
                  emotions.find(e => e.name.toLowerCase() === name.toLowerCase())?.imagePath ||
                  `/images/emotions/${name.toLowerCase()}.png`,
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 3);

            logDebug("Top moods calculated", { count: topMoods.length });
          } catch (queriesError) {
            console.log("Error processing queries:", queriesError);
          }
        }
      } catch (sessionError) {
        console.log("Error processing session:", sessionError);
      }
    }

    // Pass data to client component
    logDebug("Rendering dashboard with data", {
      hasUserId: Boolean(userId),
      emotionsCount: emotions.length,
      hasExistingMood: Boolean(existingMood),
      currentStreak,
      topMoodsCount: topMoods.length,
    });

    return (
      <DashboardClient
        serverEmotions={emotions}
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
  } catch (error) {
    console.log("Error loading dashboard data:", error);

    // Render error state for better user experience
    return (
      <DashboardClient
        serverEmotions={emotions}
        serverUserId={null}
        serverExistingMood={null}
        serverCurrentStreak={0}
        serverTopMoods={[]}
        calendarView={
          <div className="bg-white rounded-2xl p-6">
            <p className="text-red-500">Error loading calendar data. Please try refreshing.</p>
          </div>
        }
      />
    );
  }
}
