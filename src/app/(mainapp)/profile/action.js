"use server";

import { prisma } from "@/utils/prisma";
import { cookies } from "next/headers";

// Helper function to get current user
async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  if (!sessionId) {
    return null;
  }

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

  return session?.user || null;
}

// Fetch profile data for the current user
export async function getProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  // Remove sensitive data
  const { password, ...profile } = user;

  return {
    success: true,
    profile,
  };
}

// Update profile data - only birthDate and gender
export async function updateProfile(formData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const birthDate = formData.get("birthDate");
    const gender = formData.get("gender");

    // Basic validation
    if (!birthDate || !gender) {
      return {
        success: false,
        message: "Birth date and gender are required",
      };
    }

    // Update user profile with only birthDate and gender
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        birthDate: new Date(birthDate),
        gender,
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: "An error occurred while updating your profile",
    };
  }
}
