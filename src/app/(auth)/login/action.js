"use server";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function validateSession() {
  const cookieStore = cookies();
  const sessionId = await cookieStore.get("sessionId")?.value;

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
  const cookieStore = await cookies();
  const email = await formData.get("email");
  const password = await formData.get("password");

  if (!email || !password) {
    return {
      success: false,
      message: "All fields are required!",
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
      message: "User not found!",
    };
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return {
      success: false,
      message: "Invalid password!",
    };
  }

  const newSession = await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000), //7hari
    },
  });

  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: newSession.expires,
  });

  redirect("/dashboard");
}
