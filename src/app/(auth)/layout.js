// import { validateSession } from "./login/action";

import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (session) {
      redirect("/dashboard");
    }
  }
}

export default async function Layout({ children }) {
  // validasi dulu sebelum bisa akses login / register, makesure gaada session
  await validateSession();

  return <>{children}</>;
}
