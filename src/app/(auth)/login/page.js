"use client";
import { useActionState } from "react";
import { loginAction } from "./action";
import { OauthButton } from "../_components/oauthbutton";

export default function Page() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-sm text-gray-600 mt-2">Login with your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="youraccount@email.com"
              className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
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
                required
              />
            </div>
            <div className="flex justify-end mt-1">
              <a href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Error message display */}
          {state && !state.success && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{state.message}</div>
          )}

          <button
            disabled={pending}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {pending ? "Logging in..." : "Login"}
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
          Don't have an account?{" "}
          <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
