"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LandingPageClient from "./LandingPageClient";

export default async function LandingPage() {
  // Check if user is logged in (server-side)
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // If logged in, redirect to dashboard
  if (sessionId) {
    redirect("/dashboard");
  }

  // If not logged in, render the landing page client component
  return <LandingPageClient />;
}
