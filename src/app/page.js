"use client";
import { useState } from "react";
import { UserIcon, BellIcon, HomeIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("my");

  // Data pengguna
  const user = {
    fullName: "Wilgan Fauzan",
    username: "wwiiii123",
    email: "showemail@gmail.com",
    age: 27,
    gender: "Male",
  };

  // Data Mood
  const [moodWeek, setMoodWeek] = useState([
    { day: "Mon", date: "Feb 26", mood: "" },
    { day: "Tue", date: "Feb 27", mood: "" },
    { day: "Wed", date: "Feb 28", mood: "" },
    { day: "Thu", date: "Feb 29", mood: "" },
    { day: "Fri", date: "Mar 1", mood: "" },
    { day: "Sat", date: "Mar 2", mood: "" },
    { day: "Sun", date: "Mar 3", mood: "" },
  ]);

  const moodStats = {
    Happy: 12,
    Sad: 5,
    Angry: 3,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Profile Section */}
      <div className="bg-white p-6 text-center shadow-md">
        <UserCircleIcon className="h-20 w-20 mx-auto text-gray-500" />
        <h2 className="text-lg font-semibold mt-2 text-black">
          {user.fullName}
        </h2>
        <p className="text-gray-500 text-sm">@{user.username}</p>
      </div>

      {/* User Details */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-4">
        <DetailItem label="Full Name" value={user.fullName} />
        <DetailItem label="Email" value={user.email} />
        <DetailItem label="Username" value={user.username} />
        <DetailItem label="Age" value={user.age} />
        <DetailItem label="Gender" value={user.gender} />
      </div>

      {/* Mood Card */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Mood Streak
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {moodWeek.map((day, index) => (
            <div
              key={index}
              className="text-center p-2 border rounded-lg bg-gray-100"
            >
              <p className="text-xs text-gray-500">{day.day}</p>
              <p className="text-sm font-semibold text-gray-700">
                {day.mood || day.date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mood Statistics */}
      <div className="bg-white p-4 rounded-lg shadow-md mx-4 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Mood Statistics
        </h3>
        <div className="flex justify-between">
          {Object.entries(moodStats).map(([mood, count], index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-500">{mood}</p>
            </div>
          ))}
        </div>
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

// Komponen untuk Detail Informasi Pengguna
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-700">{value}</span>
  </div>
);
