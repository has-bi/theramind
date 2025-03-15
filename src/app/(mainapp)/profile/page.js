"use client";

import { useState, useEffect } from "react";
import { updateProfile, getProfile } from "./action";
import ProfileForm from "./components/ProfileForm";
import Link from "next/link";
import Avatar from "boring-avatars";
import LogoutButton from "./components/logout-button";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await getProfile();
        if (result.success) {
          setProfileData(result.profile);
        } else {
          setMessage(result.message);
          setStatus("error");
        }
      } catch (error) {
        setMessage("Failed to load profile data");
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSubmit = async formData => {
    setMessage(null);
    const result = await updateProfile(formData);

    setStatus(result.success ? "success" : "error");
    setMessage(result.message);

    if (result.success) {
      // Refresh profile data after successful update
      const updatedProfile = await getProfile();
      if (updatedProfile.success) {
        setProfileData(updatedProfile.profile);
      }
      setIsEditing(false);
    }
  };

  return (
    <div className="mobile-container bg-white min-h-screen relative overflow-hidden">
      {/* Header */}
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm z-10 relative">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-mood-loved flex items-center justify-center mr-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Profile</h1>
            <p className="text-xs text-gray-500">Manage your personal info</p>
          </div>
        </div>
      </header>

      {/* Blurred background avatar */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-30">
        <div className="scale-[3.5] blur-2xl">
          <Avatar size={300} name={profileData?.password || "user"} variant="beam" />
        </div>
      </div>

      {/* Floating profile content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-5 pt-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-20 w-full">
            <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Avatar at the center */}
            <div className="mb-6 relative">
              <div className="p-1 bg-white rounded-full shadow-lg">
                <Avatar
                  size={100}
                  name={profileData?.password || "user"}
                  variant="beam"
                  className="rounded-full"
                />
              </div>
            </div>

            {/* User name and info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {profileData?.firstName || "User"}
              </h2>
              <p className="text-sm text-gray-600">{profileData?.email || ""}</p>
            </div>

            {/* Status message */}
            {message && (
              <div
                className={`p-4 mb-6 rounded-2xl border w-full max-w-sm ${
                  status === "success"
                    ? "bg-mood-calm-light border-mood-calm text-gray-700"
                    : "bg-mood-angry-light border-mood-angry text-gray-700"
                }`}
              >
                <div className="flex items-start">
                  <div
                    className={`p-1 rounded-full mr-3 ${
                      status === "success" ? "bg-mood-calm" : "bg-mood-angry"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-4 h-4"
                    >
                      {status === "success" ? (
                        <path d="M20 6L9 17l-5-5" />
                      ) : (
                        <path d="M18 6L6 18M6 6l12 12" />
                      )}
                    </svg>
                  </div>
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            )}

            {/* Profile form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 w-full max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-gray-700">
                  {isEditing ? "Edit Profile" : "Personal Information"}
                </h3>
                {!isEditing && !isLoading && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              <ProfileForm
                isEditing={isEditing}
                onCancel={() => {
                  setIsEditing(false);
                  setMessage(null);
                }}
                onSubmit={handleSubmit}
                initialData={profileData}
              />
              {/* Logout Button */}
              <div className="flex justify-end">
                <LogoutButton />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
