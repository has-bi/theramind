"use client";

import { logout } from "@/app/(auth)/auth/auth";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="bg-red-400 text-white py-1.5 px-3 rounded-lg flex items-center text-sm hover:bg-red-600 transition"
    >
      <ArrowRightStartOnRectangleIcon className="w-4 h-4 mr-2" />
      Logout
    </button>
  );
}
