"use server";

import { cookies } from "next/headers";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: { id: sessionId },
    });

    cookieStore.set("sessionId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
    });
  }

  redirect("/login");
}
