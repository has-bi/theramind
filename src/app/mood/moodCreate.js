"use client";

import React from "react";
import { useState, useActionState } from "react";
import { createMoodAction } from "./mood-Action";
import Image from "next/image";

export const EmojiForm = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [state, formAction, pending] = useActionState(createMoodAction, null);

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
  };

  const handleFormAction = async formData => {
    if (selectedEmotion) {
      formData.set("emotionId", selectedEmotion.id);
      formData.set("label", selectedEmotion.label);
      formData.set("imagePath", selectedEmotion.imagePath);
      formData.set("value", selectedEmotion.value);

      const result = await formAction(formData);

      if (result?.success) {
        // Redirect to journal page after successful submission
        window.location.href = "/journal";
      } else if (result?.error) {
        console.log(result.error);
        // Display error to user if needed
      }
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="py-6">
        <h1 className="text-xl font-bold text-center text-indigo-600">
          How are you feeling today?
        </h1>
      </div>

      <form action={handleFormAction} className="px-4 pb-6">
        <input type="hidden" name="userId" value={selectedEmotion?.id || ""} />
        <input type="hidden" name="emotionId" value={selectedEmotion?.id || ""} />

        <div className="grid grid-cols-3 gap-4 mb-8">
          {emotions.map(emotion => (
            <div key={emotion.id} className="flex flex-col items-center">
              {/* Emotion button using the square shape with rounded corners */}
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
                {/* Colored background */}
                <div className={`absolute inset-0 ${emotion.color}`}></div>

                {/* Emotion image centered inside the button */}
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

              {/* Emotion label underneath */}
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
