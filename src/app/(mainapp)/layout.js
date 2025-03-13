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
      {/* Main content dengan padding bottom untuk footer */}
      <div className="pb-footer">{children}</div>

      {/* Footer menu - fixed di bagian bawah */}
      <div className="fixed bottom-0 w-full max-w-[375px] z-50">
        <FooterMenu />
      </div>
    </>
  );
}
