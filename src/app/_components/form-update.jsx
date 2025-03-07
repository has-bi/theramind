"use client";
import { useActionState } from "react";

export const FormUpdate = ({ id, firstName, lastName, email, password }) => {
  const [_, formAction, pending] = useActionState(updateAction, null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Profile Section */}
        <div className="bg-white p-6 text-center shadow-md">
          <UserCircleIcon className="h-20 w-20 mx-auto text-gray-500" />
          <h2 className="text-lg font-semibold mt-2 text-black">
            {users.firstName} {users.lastName}
          </h2>
          <p className="text-gray-500 text-sm">@{users.email}</p>
        </div>

        {/* Update Form */}
        <form action={formAction} className="bg-white shadow-lg rounded-lg p-6 w-80 mt-6 space-y-3">
          <input type="hidden" name="id" defaultValue={id} />
          <input
            name="firstName"
            defaultValue={firstName}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            name="lastName"
            defaultValue={lastName}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            name="email"
            defaultValue={email}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            name="password"
            type="password"
            defaultValue={password}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
          />
          <button
            disabled={pending}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            Update
          </button>
        </form>

        {/* Bottom Navigation */}
        <div className="bg-white shadow-lg fixed bottom-0 w-full flex justify-around py-3">
          <NavItem title="Home" Icon={HomeIcon} />
          <NavItem title="Notification" Icon={BellIcon} />
          <NavItem title="My Profile" Icon={UserIcon} />
        </div>
      </div>
    </div>
  );
};

// Komponen untuk Bottom Navigation
const NavItem = ({ title, Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center ${active ? "text-indigo-500" : "text-gray-400"}`}
  >
    <Icon className="h-6 w-6" />
    <span className="text-xs mt-1">{title}</span>
  </button>
);
