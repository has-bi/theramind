import { google } from "@/utils/arctic";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }) {
  const query = await searchParams;

  const state = query.state;
  const code = query.code;

  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get("codeVerifier")?.value;

  //code validation
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const accessToken = tokens.data.access_token;

  const res = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();

  //check user
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  //ini kalo gaada, yaudah buat usertannpa password
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  //buat cookie
  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
  });

  redirect("/dashboard");
}
