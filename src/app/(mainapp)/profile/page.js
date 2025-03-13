"use client";

import { useState } from "react";
import { updateProfile } from "./action";
import ProfileForm from "./components/ProfileForm";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async formData => {
    setMessage(null);
    const result = await updateProfile(formData);

    setStatus(result.success ? "success" : "error");
    setMessage(result.message);

    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-md ${
              status === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <ProfileForm
          isEditing={isEditing}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
