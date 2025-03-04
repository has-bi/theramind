'use server'

import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function registerAction(_, formData) {
  const firstName = await formData.get('firstname')
  const lastName = await formData.get('lastname')
  const email = await formData.get('email')
  const password = await formData.get('password')

  if (!firstName || !lastName || !email || !password) {
    return {
      success: false,
      message: 'All fields are required!',
    }
  }

  //check collision
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return {
      success: false,
      message: 'User registered, Please login!',
    }
  }

  // Password validation
  if (password.length < 8) {
    return {
      success: false,
      message: 'Password must be at least 8 characters!',
    }
  }

  // Check for letters and numbers
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasLetter || !hasNumber) {
    return {
      success: false,
      message: 'Password must include both letters and numbers!',
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  })

  return {
    success: true,
    message: 'Registered successfully!',
  }
}
