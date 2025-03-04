"use client";

import React from "react";
import { useState, useActionState } from "react";
import { createMoodAction } from "./mood-Action";

export const EmojiForm = () => {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [state, formAction, pending] = useActionState(createMoodAction, null);

  const emotions = [
    { id: "happy", label: "Happy", emoji: "😊", value: "Happy" },
    { id: "sad", label: "Sad", emoji: "😢", value: "Sad" },
    { id: "calm", label: "Calm", emoji: "😌", value: "Calm" },
    { id: "angry", label: "Angry", emoji: "😠", value: "Angry" },
    { id: "anxious", label: "Anxious", emoji: "😰", value: "Anxious" },
    { id: "neutral", label: "Neutral", emoji: "😐", value: "Neutral" },
    { id: "stressed", label: "Stressed", emoji: "😩", value: "Stressed" },
    { id: "excited", label: "Excited", emoji: "🤩", value: "Excited" },
    { id: "tired", label: "Tired", emoji: "😴", value: "Tired" },
    { id: "confused", label: "Confused", emoji: "😕", value: "Confused" },
    { id: "grateful", label: "Gratefull", emoji: "😇", value: "Grateful" },
    { id: "love", label: "love", emoji: "🥰", value: "Love" },
  ];

  const handleEmotionClick = emotion => {
    setSelectedEmotion(emotion);
  };

  const handleFormAction = formData => {
    if (selectedEmotion) {
      formData.set("emotionId", selectedEmotion.id);
      formData.set("label", selectedEmotion.label);
      formData.set("emoji", selectedEmotion.emoji);
      formData.set("value", selectedEmotion.value);
      console.log("Submitting emotion:", selectedEmotion.value);
      return formAction(formData);
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-indigo-600 text-2xl font-bold mb-4 text-center">
        How are you feeling today?
      </h2>

      <form action={handleFormAction} className="space-y-6">
        <input type="hidden" name="userId" value={selectedEmotion?.id || ""} />
        <input type="hidden" name="emoticon" value={selectedEmotion?.value} />

        <div className="grid grid-cols-3 gap-6">
          {emotions.map(emotion => (
            <div
              key={emotion.id}
              onClick={() => handleEmotionClick(emotion)}
              className={`p-4 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer aspect-square ${
                selectedEmotion?.id === emotion.id
                  ? "bg-blue-100 border-2 border-indigo-500"
                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
              }`}
              data-value={emotion.value}
            >
              <span className="text-3xl mb-2">{emotion.emoji}</span>
              <span className="text-gray-800 text-sm text-center">{emotion.label}</span>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!selectedEmotion || pending}
          className={`w-full py-2 px-4 text-white font-semibold rounded-lg transition-colors 
            ${pending ? "bg-blue-300 cursor-not-allowed" : "bg-indigo-700 hover:bg-indigo-800"} 
            ${!selectedEmotion ? "bg-blue-300 cursor-not-allowed" : ""}`}
        >
          {pending ? "Submitting..." : "Next"}
        </button>
      </form>
    </div>
  );
};
