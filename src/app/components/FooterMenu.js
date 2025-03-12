"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function FooterMenu() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: active => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-6 h-6 mx-auto ${active ? "text-indigo-600" : "text-gray-500"}`}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: active => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-6 h-6 mx-auto ${active ? "text-indigo-600" : "text-gray-500"}`}
        >
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      name: "Blog",
      path: "/blog",
      icon: active => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-6 h-6 mx-auto ${active ? "text-indigo-600" : "text-gray-500"}`}
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-t border-gray-200 pb-safe w-full">
      <div className="flex items-center justify-around">
        {menuItems.map(item => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              href={item.path}
              key={item.name}
              className={`flex flex-col items-center py-3 flex-1 relative ${
                isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.icon(isActive)}
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {item.name}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full absolute top-1"></div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
