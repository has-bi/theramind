'use server'

export async function registerAction(_, formData) {
  try {
    const firstName = await formData.get('firstname')
    const lastName = await formData.get('lastname')
    const email = await formData.get('email')
    const password = await formData.get('password')

    if (!firstName || !lastName || !email || !password) {
      throw new Error('Missing form data fields')
    }

    console.log({ firstName, lastName, email, password })
  } catch (error) {
    console.error('Error reading form data:', error)
  }
}
