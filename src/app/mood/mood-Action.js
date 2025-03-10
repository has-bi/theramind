"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "../utils/prisma";

export async function createMoodAction(_, formData) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return redirect("/login");
  }
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
  const userId = session.user.id;
  const emotionId = formData.get("emotionId");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingEntry = await prisma.moodEntry.findFirst({
    where: {
      userId: userId,
      createdAt: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    },
  });

  if (!existingEntry) {
    await prisma.moodEntry.create({
      data: {
        userId,
        emotionId,
        createdAt: new Date(),
      },
    });

    redirect("/journal");
  }

  redirect("/dashboard");
}
