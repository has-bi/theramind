// Suggested update for app/(mainapp)/layout.js
import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/prisma";
import FooterMenu from "../components/FooterMenu";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

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

  return (
    <>
      {/* Main content dengan padding bottom yang lebih spesifik untuk footer */}
      <div className="pb-20">{children}</div>

      {/* Footer menu - fixed di bagian bawah dengan safe-area-inset untuk iOS */}
      <div className="fixed bottom-0 w-full max-w-[375px] z-40 pb-safe">
        <FooterMenu />
      </div>
    </>
  );
}
