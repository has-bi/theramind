"use client";

import { logout } from "@/app/(auth)/auth/auth"; // Pastikan path benar

export default function LogoutButton() {
  return (
    <button onClick={() => logout()} className="px-4 py-2 bg-red-500 text-white rounded">
      Logout
    </button>
  );
}
