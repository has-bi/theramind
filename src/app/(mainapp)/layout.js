import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/prisma";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const sessionId = await cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const checkSession = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!checkSession) {
    redirect("/login");
  }

  return <>{children}</>;
}
