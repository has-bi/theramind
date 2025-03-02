'use server'

import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function loginAction(_, formData) {
  const email = await formData.get('email')
  const password = await formData.get('password')

  if (!email || !password) {
    return {
      success: false,
      message: 'All fields are required!',
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return {
      success: false,
      message: 'User not found!',
    }
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password)

  if (!isPasswordMatch) {
    return {
      success: false,
      message: 'Invalid password!',
    }
  }

  return {
    success: true,
    message: 'login successful!',
  }
}
