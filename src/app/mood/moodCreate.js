"use client";

import React from "react";
import { useState } from "react";
import { createMoodAction } from "./mood-Action";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const EmojiForm = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState(null);
  const router = useRouter();

  const emotions = [
    { id: 1, label: "Happy", imagePath: "/images/emotions/happy.png", value: "Happy" },
    { id: 2, label: "Sad", imagePath: "/images/emotions/sad.png", value: "Sad" },
    { id: 3, label: "Calm", imagePath: "/images/emotions/calm.png", value: "Calm" },
    { id: 4, label: "Angry", imagePath: "/images/emotions/angry.png", value: "Angry" },
    { id: 5, label: "Anxious", imagePath: "/images/emotions/anxious.png", value: "Anxious" },
    { id: 6, label: "Neutral", imagePath: "/images/emotions/neutral.png", value: "Neutral" },
    { id: 7, label: "Stressed", imagePath: "/images/emotions/stressed.png", value: "Stressed" },
    { id: 8, label: "Excited", imagePath: "/images/emotions/excited.png", value: "Excited" },
    { id: 9, label: "Tired", imagePath: "/images/emotions/tired.png", value: "Tired" },
    { id: 10, label: "Confused", imagePath: "/images/emotions/confused.png", value: "Confused" },
    { id: 12, label: "Grateful", imagePath: "/images/emotions/grateful.png", value: "Grateful" },
    { id: 11, label: "Loved", imagePath: "/images/emotions/loved.png", value: "Loved" },
  ];

  const handleEmotionClick = emotion => {
    setSelectedEmotion(emotion);
    setFormError(null);
  };

  // PERUBAHAN: Menggunakan formData untuk pemanggilan server action secara manual
  const handleSubmit = async e => {
    e.preventDefault();

    if (!selectedEmotion) {
      setFormError("Please select an emotion first");
      return;
    }

    try {
      setPending(true);
      console.log("Submitting form with emotion:", selectedEmotion);

      // Buat FormData
      const formData = new FormData();
      formData.append("emotionId", selectedEmotion.id);
      formData.append("label", selectedEmotion.label);
      formData.append("imagePath", selectedEmotion.imagePath);
      formData.append("value", selectedEmotion.value);

      // Simpan ke localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("emotion_context", selectedEmotion.value);
        localStorage.setItem("emotion_id", selectedEmotion.id);
        console.log("Saved emotion to localStorage:", selectedEmotion.value);
      }

      // Panggil server action secara manual
      console.log("Calling server action...");
      const result = await createMoodAction(null, formData);
      console.log("Server action result:", result);

      if (result?.success) {
        console.log("Success! Redirecting to /chat");
        // PERUBAHAN: Gunakan router dari next/navigation
        router.push("/chat");
      } else if (result?.error) {
        console.error("Server returned error:", result.error);
        setFormError(result.error || "Failed to save your emotion");
      } else {
        // PERUBAHAN: Hanya redirect ke /chat jika result tidak terdefinisi atau tidak memiliki properti yang diharapkan
        console.log("No specific result, redirecting to /chat");
        router.push("/chat");
      }
    } catch (error) {
      console.error("Client-side error in form submission:", error);
      setFormError(error.message || "An unexpected error occurred");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="py-6">
        <h1 className="text-xl font-bold text-center text-indigo-600">
          How are you feeling today?
        </h1>
      </div>

      {formError && (
        <div className="mx-4 mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">{formError}</div>
      )}

      {/* PERUBAHAN: Gunakan onSubmit alih-alih action */}
      <form onSubmit={handleSubmit} className="px-4 pb-6">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {emotions.map(emotion => (
            <div key={emotion.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleEmotionClick(emotion)}
                className={`w-20 h-20 rounded-2xl overflow-hidden relative shadow-sm
                  ${
                    selectedEmotion?.id === emotion.id
                      ? "ring-2 ring-indigo-600 transform scale-105"
                      : ""
                  }`}
              >
                <div className={`absolute inset-0 ${emotion.color}`}></div>
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <Image
                    src={emotion.imagePath}
                    alt={emotion.label}
                    width={40}
                    height={40}
                    className="object-contain"
                    priority={emotion.id <= 6}
                  />
                </div>
              </button>
              <span className="text-xs text-center text-gray-700 mt-2">{emotion.label}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!selectedEmotion || pending}
          className={`w-full py-3 px-4 text-white font-semibold rounded-md transition-colors 
            ${
              !selectedEmotion
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } 
            ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {pending ? "Submitting..." : "Next"}
        </button>
      </form>
    </div>
  );
};
