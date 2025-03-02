'use server'

export async function registerAction(_, formData) {
  const firstName = await formData.get('firstname')
  const lastName = await formData.get('lastname')
  const email = await formData.get('email')
  const password = await formData.get('password')

  console.log({ firstName, lastName, email, password })
}
