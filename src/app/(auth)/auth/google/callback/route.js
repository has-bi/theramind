import { google } from "@/utils/arctic";
import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req) {
  const query = req.nextUrl.searchParams;
  const code = query.get("code");

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

  let newUser = user;

  //ini kalo gaada, yaudah buat usertannpa password
  if (!user) {
    // split name from google separated by space
    const nameParts = data.name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: data.email,
        googleId: data.sub,
        birthDate: new Date("2000-01-01"),
        gender: "Prefer not to say",
      },
    });
  }

  //buat Session
  const newSession = await prisma.session.create({
    data: {
      userId: newUser.id,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      data: JSON.stringify({ accessToken }),
    },
  });

  //buat cookie
  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
  });

  redirect("/dashboard");
}
