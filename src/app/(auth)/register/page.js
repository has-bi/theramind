"use client";
import { useActionState } from "react";
import { registerAction } from "./action";
import { OauthButton } from "../_components/oauthbutton";

export default function Page() {
  const [state, formAction, pending] = useActionState(registerAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-gray-600 mt-2">
            Sign up using the form, or your google account
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                name="firstname"
                placeholder="first name"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                name="lastname"
                placeholder="last name"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="youraccount@email.com"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                placeholder="password"
                className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Min 8 characters, including letters and numbers
            </p>
          </div>
          {!state?.success && <div>{state?.message}</div>}
          <button
            disabled={pending}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Register
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <OauthButton />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
