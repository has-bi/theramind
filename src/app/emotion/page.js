"use client";

import { useState } from "react";

const emotionOptions = [
  { label: "Happy", value: "1" },
  { label: "Sad", value: "2" },
  { label: "Calm", value: "3" },
  { label: "Angry", value: "4" },
  { label: "Anxious", value: "5" },
  { label: "Neutral", value: "6" },
  { label: "Stressed", value: "7" },
  { label: "Excited", value: "8" },
  { label: "Tired", value: "9" },
  { label: "Confused", value: "10" },
  { label: "Loved", value: "11" },
  { label: "Grateful", value: "12" },
];

export default function EmotionInput() {
  const [selectedEmotion, setSelectedEmotion] = useState(emotionOptions[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotionId: selectedEmotion }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Emotion saved successfully!");
      } else {
        setMessage("Error saving emotion: " + data.error);
      }
    } catch (error) {
      setMessage("Error saving emotion");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">How are you feeling today?</h1>
      <form onSubmit={handleSubmit}>
        <select
          value={selectedEmotion}
          onChange={e => setSelectedEmotion(e.target.value)}
          className="border p-2 rounded"
        >
          {emotionOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Emotion"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
