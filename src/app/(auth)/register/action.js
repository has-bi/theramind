'use server'

import { prisma } from '@/utils/prisma'
import bcrypt from 'bcrypt'

export async function registerAction(_, formData) {
  try {
    const firstName = await formData.get('firstname')
    const lastName = await formData.get('lastname')
    const email = await formData.get('email')
    const password = await formData.get('password')

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    })

    console.log({ firstName, lastName, email, password, hashedPassword })
  } catch (error) {
    console.error('Error reading form data:', error)
  }
}
