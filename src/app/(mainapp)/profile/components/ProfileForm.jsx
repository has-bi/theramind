// components/ProfileForm.jsx
"use client";

import { useEffect, useState } from "react";
import { getProfile } from "../action";

export default function ProfileForm({ isEditing, onCancel, onSubmit }) {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const response = await getProfile();
      if (response.success) {
        const profile = response.profile;

        // Format birthDate to YYYY-MM-DD for input field
        if (profile.birthDate) {
          const date = new Date(profile.birthDate);
          profile.formattedBirthDate = date.toISOString().split("T")[0];
        }

        setProfileData(profile);
      }
      setLoading(false);
    }

    loadProfile();
  }, [isEditing]);

  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  // Calculate age from birthDate
  const calculateAge = birthDate => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center text-red-600 p-3 text-sm">
        Unable to load profile data. Please try again later.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Single column for mobile */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            defaultValue={profileData.firstName}
            disabled={true}
            className="w-full p-2 text-sm border rounded-md bg-gray-50 border-gray-200"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            defaultValue={profileData.lastName}
            disabled={true}
            className="w-full p-2 text-sm border rounded-md bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={profileData.email}
          disabled={true}
          className="w-full p-2 text-sm border rounded-md bg-gray-50 border-gray-200"
        />
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Birth Date</label>
          <div className="flex flex-col">
            <input
              type="date"
              name="birthDate"
              defaultValue={profileData.formattedBirthDate}
              max={new Date().toISOString().split("T")[0]} // Prevent future dates
              disabled={!isEditing}
              className={`w-full p-2 text-sm border rounded-md ${
                isEditing
                  ? "bg-white border-gray-300 focus:ring-1 focus:ring-indigo-500"
                  : "bg-gray-50 border-gray-200"
              }`}
              required
            />
            <span className="text-xs text-gray-500 mt-1">
              Age: {calculateAge(profileData.birthDate)} years
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            defaultValue={profileData.gender}
            disabled={!isEditing}
            className={`w-full p-2 text-sm border rounded-md ${
              isEditing
                ? "bg-white border-gray-300 focus:ring-1 focus:ring-indigo-500"
                : "bg-gray-50 border-gray-200"
            }`}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end gap-2">
          {isEditing && (
            <>
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
