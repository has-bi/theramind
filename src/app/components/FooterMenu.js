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
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 mx-auto ${active ? "text-indigo-300" : "text-gray-500"}`}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "Home",
      path: "/dashboard",
      icon: active => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 mx-auto ${active ? "text-indigo-300" : "text-gray-500"}`}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
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
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`w-5 h-5 mx-auto ${active ? "text-indigo-300" : "text-gray-500"}`}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
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
