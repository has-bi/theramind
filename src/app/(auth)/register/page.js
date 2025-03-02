'use client'
import { useActionState } from 'react'
import { registerAction } from './action'

export default function page() {
  const [state, formAction, pending] = useActionState(registerAction, null)

  return (
    <div>
      <form action={registerAction}>
        <input name="firstname" placeholder="firstname" />
        <input name="lastname" placeholder="lastname" />
        <input name="email" type="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
