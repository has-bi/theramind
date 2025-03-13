"use server";

import { prisma } from "@/utils/prisma";
import bcrypt from "bcrypt";

export async function registerAction(_, formData) {
  const firstName = formData.get("firstname");
  const lastName = formData.get("lastname");
  const email = formData.get("email");
  const password = formData.get("password");
  const age = formData.get("age"); // Add if you have this in your form
  const gender = formData.get("gender"); // Add if you have this in your form

  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      message: "All fields are required!",
    };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: "Please enter a valid email address!",
    };
  }

  //check collision
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      message: "User registered, Please login!",
    };
  }

  // Password validation
  if (password.length < 8) {
    return {
      success: false,
      message: "Password must be at least 8 characters!",
    };
  }

  // Check for letters and numbers
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      success: false,
      message: "Password must include both letters and numbers!",
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        age: age ? parseInt(age) : 0, // Default to 0 if not provided
        gender: gender || "Unspecified", // Default if not provided
      },
    });

    return {
      success: true,
      message: "Registered successfully!",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration. Please try again.",
    };
  }
}
