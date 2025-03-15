"use client";

import { logout } from "@/app/(auth)/auth/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="bg-red-400 text-white py-1 px-2.5 rounded-md flex items-center text-xs hover:bg-red-600 transition mt-2"
    >
      <ArrowRightStartOnRectangleIcon className="w-3.5 h-3.5 mr-1" />
      Logout
    </button>
  );
}
