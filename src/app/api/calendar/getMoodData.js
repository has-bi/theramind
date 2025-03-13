import { prisma } from "@/utils/prisma"; // Adjust the import path as needed

export async function getMoodData(sessionId) {
  console.log("Getting mood data for session ID:", sessionId);

  if (!sessionId) {
    console.log("No session ID provided, returning empty data");
    return {};
  }

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      console.log("No session found for the provided session ID");
      return {};
    }

    const userId = session.user.id;
    console.log("Found user ID:", userId);

    // Get all mood entries for the user
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId: userId,
      },
      include: {
        emotion: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${moodEntries.length} mood entries for user`);

    // Format the data for the calendar (one mood per day)
    const formattedData = {};
    moodEntries.forEach(entry => {
      const dateString = entry.createdAt.toISOString().split("T")[0];
      // Only keep the first entry for each day if there are multiple
      if (!formattedData[dateString]) {
        formattedData[dateString] = entry.emotion.name;
        console.log(`Mood for ${dateString}: ${entry.emotion.name}`);
      }
    });

    console.log("Final formatted mood data:", formattedData);
    return formattedData;
  } catch (error) {
    console.error("Error fetching mood data:", error);
    return {};
  }
}
