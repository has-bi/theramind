"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function BlogFilter({ moods, selectedMood, defaultMood }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only set default mood if no mood is selected and defaultMood exists
    if (!selectedMood && defaultMood && moods.includes(defaultMood)) {
      const params = new URLSearchParams(searchParams);
      params.set("mood", defaultMood);
      router.push(`/blog?${params.toString()}`);
    }
  }, [defaultMood, moods, router, searchParams, selectedMood]);

  const handleMoodChange = e => {
    const mood = e.target.value;

    const params = new URLSearchParams(searchParams);
    if (mood) {
      params.set("mood", mood);
    } else {
      params.delete("mood");
    }

    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <label htmlFor="mood-filter" className="block text-sm font-medium mb-2">
        How&apos;s your feeling today?
      </label>
      <select
        id="mood-filter"
        value={selectedMood}
        onChange={handleMoodChange}
        className="w-full md:w-64 p-2 rounded-md focus:ring-2 focus:ring-indigo-600 shadow-md"
      >
        <option value="">Top Moods</option>
        {moods.map(mood => (
          <option key={mood} value={mood}>
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
