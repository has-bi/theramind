'use server'

import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function registerAction(_, formData) {
  try {
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
        message: 'User already registered!',
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
      message: 'User registered successfully!',
    }
  } catch (error) {
    console.error('Error reading form data:', error)
  }
}
