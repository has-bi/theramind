// app/(mainapp)/dashboard/page.js
import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { getMoodData } from "@/app/api/calendar/getMoodData";
import DashboardClient from "./components/DashboardClient";
import CalendarView from "./calendarView";
import { Suspense } from "react";
import {
  convertToUTC7,
  getUTC7StartOfDay,
  getUTC7EndOfDay,
  formatDateStringUTC7,
} from "@/utils/dateTime";
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

// Optimized function to calculate streak - handles UUID userId with proper UTC+7 timezone
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
  // Format today's date properly in UTC+7
  const todayStr = formatDateStringUTC7(now);
  console.log("Today's date (UTC+7):", todayStr);

  // Get last 100 days of entries to calculate streak
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 100);

  try {
    // Get the entries with journals attached - complete entries only
    const entriesRaw = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
        // Only count entries with journals as complete entries
        journalAI: {
          isNot: null,
        },
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

    // Format all dates to YYYY-MM-DD in UTC+7 timezone
    const entryDates = entriesRaw.map(entry => formatDateStringUTC7(entry.createdAt));

    // Log the first few formatted dates for debugging
    logDebug("First few formatted dates:", entryDates.slice(0, 5));

    // Get unique days (in case of multiple entries per day)
    const uniqueDays = [...new Set(entryDates)].sort().reverse();
    logDebug("Unique days found", { count: uniqueDays.length, first: uniqueDays[0] });

    // Calculate yesterday's date in UTC+7
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatDateStringUTC7(yesterdayDate);
    console.log("Yesterday's date (UTC+7):", yesterdayStr);

    // Initialize streak counter
    let streak = 0;

    // Check if there's an entry for today or yesterday
    if (uniqueDays.includes(todayStr)) {
      // Start with today
      console.log("Entry found for today");
      streak = 1;

      // Check consecutive days before today
      for (let i = 1; i < 100; i++) {
        // Limit to 100 days max
        const prevDate = new Date(now);
        prevDate.setDate(prevDate.getDate() - i);
        const prevDateStr = formatDateStringUTC7(prevDate);

        if (uniqueDays.includes(prevDateStr)) {
          streak++;
          console.log(`Found entry for ${prevDateStr}, streak: ${streak}`);
        } else {
          console.log(`No entry found for ${prevDateStr}, breaking streak`);
          break;
        }
      }
    } else if (uniqueDays.includes(yesterdayStr)) {
      // Start with yesterday if no entry for today
      console.log("No entry for today, but found entry for yesterday");
      streak = 1;

      // Check consecutive days before yesterday
      for (let i = 1; i < 100; i++) {
        // Limit to 100 days max
        const prevDate = new Date(yesterdayDate);
        prevDate.setDate(prevDate.getDate() - i);
        const prevDateStr = formatDateStringUTC7(prevDate);

        if (uniqueDays.includes(prevDateStr)) {
          streak++;
          console.log(`Found entry for ${prevDateStr}, streak: ${streak}`);
        } else {
          console.log(`No entry found for ${prevDateStr}, breaking streak`);
          break;
        }
      }
    } else {
      console.log("No entry for today or yesterday, streak is 0");
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
              // Get today's mood - look for entries with journal
              prisma.moodEntry
                .findFirst({
                  where: {
                    userId: userId,
                    createdAt: {
                      gte: utcStartOfDay,
                      lte: utcEndOfDay,
                    },
                    journalAI: {
                      isNot: null,
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
            const currentMonth = utc7Now.getUTCMonth();
            const currentYear = utc7Now.getUTCFullYear();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getUTCDate();

            // Count moods for current month
            Object.entries(moodData).forEach(([date, mood]) => {
              const entryDate = new Date(date);
              const utc7Date = convertToUTC7(entryDate);
              if (
                utc7Date.getUTCMonth() === currentMonth &&
                utc7Date.getUTCFullYear() === currentYear
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
