'use client'
import { useActionState } from 'react'
import { registerAction } from './action'

export default function page() {
  const [state, formAction, pending] = useActionState(registerAction, null)

  return (
    <div>
      <form action={registerAction}>
        <input name="firstname" placeholder="first name" />
        <input name="lastname" placeholder="last name" />
        <input name="email" type="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button>Register</button>
      </form>
    </div>
  )
}
