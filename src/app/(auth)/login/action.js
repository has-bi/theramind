"use server";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
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

export async function loginAction(_, formData) {
  try {
    const cookieStore = await cookies();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required!",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password!", // Better security to be vague about which is wrong
      };
    }

    // Check if user has a password (might not if they registered with Google)
    if (!user.password) {
      return {
        success: false,
        message: "Please log in with Google or reset your password.",
      };
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return {
        success: false,
        message: "Invalid email or password!", // Same vague message for security
      };
    }

    // Create a new session
    const expirationDate = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 7 days
    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
        expires: expirationDate,
      },
    });

    // Set the session cookie
    cookieStore.set("sessionId", newSession.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expirationDate,
      path: "/",
    });

    redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
