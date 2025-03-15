// app/login/page.js
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  // Server-side session check
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // If the user is logged in, redirect them to the dashboard
  if (sessionId) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
