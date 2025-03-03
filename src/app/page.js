"use client";
import { useState } from "react";
import {
  UserIcon,
  BellIcon,
  ArchiveBoxIcon,
  UsersIcon,
  InformationCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("my");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Profile Section */}
      <div className="bg-white p-6 text-center">
        <UserCircleIcon className="h-20 w-20 mx-auto text-gray-500" />
        <h2 className="text-lg font-semibold mt-2 text-black">Justin</h2>
        <p className="text-gray-500 text-sm">justinisfine123</p>
      </div>

      {/* Menu List */}
      <div className="flex flex-col bg-white rounded-lg mx-4 mt-4 flex-grow">
        <MenuItem title="Profile" Icon={UserIcon} />
        <MenuItem title="Notification" Icon={BellIcon} />
        <MenuItem title="Archive" Icon={ArchiveBoxIcon} />
        <MenuItem title="Friend List" Icon={UsersIcon} />
        <MenuItem title="Information" Icon={InformationCircleIcon} />
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white shadow-lg fixed bottom-0 w-full flex justify-around py-3">
        <NavItem
          title="Home"
          Icon={HomeIcon}
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <NavItem
          title="Notification"
          Icon={BellIcon}
          active={activeTab === "notification"}
          onClick={() => setActiveTab("notification")}
        />
        <NavItem
          title="MY"
          Icon={UserIcon}
          active={activeTab === "my"}
          onClick={() => setActiveTab("my")}
        />
      </div>
    </div>
  );
}

// Komponen untuk Item Menu
const MenuItem = ({ title, Icon }) => (
  <div className="flex items-center space-x-4 p-4 border-b">
    <Icon className="h-6 w-6 text-gray-500" />
    <span className="text-gray-700 font-medium">{title}</span>
  </div>
);

// Komponen untuk Bottom Navigation
const NavItem = ({ title, Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${
      active ? "text-indigo-500" : "text-gray-400"
    }`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs mt-1">{title}</span>
  </button>
);
