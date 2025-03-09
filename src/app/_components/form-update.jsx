"use client";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";

export const FormUpdate = ({ id, firstName, lastName, age, gender, email, password }) => {
  const [_, formAction, pending] = useActionState(updateAction, null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Profile Section */}
        <div className="bg-white p-6 text-center shadow-md w-80 rounded-lg flex flex-col items-center">
          <Avatar size={80} name={users.id} variant="beam" colors={["#D7907B", "#36151E"]} />
          <h2 className="text-lg font-semibold mt-2 text-black">
            {users.firstName} {users.lastName}
          </h2>
          <p className="text-gray-500 text-sm">@{users.email}</p>
        </div>

        {/* Update Form */}
        <form action={formAction} className="bg-white shadow-lg rounded-lg p-6 w-80 mt-6 space-y-3">
          <input type="hidden" name="id" defaultValue={id} />
          <p className="font-bold text-sm">First Name</p>
          <input
            name="firstName"
            defaultValue={firstName}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
          />
          <p className="font-bold text-sm">Last Name</p>
          <input
            name="lastName"
            defaultValue={lastName}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
          />
          <p className="font-bold text-sm">Gender</p>
          <select
            name="gender"
            defaultValue={gender}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <p className="font-bold text-sm">Age</p>
          <input
            name="age"
            defaultValue={age}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
          />
          <p className="font-bold text-sm">Email</p>
          <input
            name="email"
            defaultValue={email}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
          />
          <p className="font-bold text-sm">Password</p>
          <input
            name="password"
            type="password"
            defaultValue={password}
            className="w-full p-2 border text-sm rounded-md focus:ring focus:ring-blue-300"
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
          <NavItem title="Calendar" Icon={CalendarIcon} />
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
