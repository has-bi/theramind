"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogFilter({ moods, selectedMood, defaultMood }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run once when component mounts and if there's no mood already selected
    if (!isInitialized && !searchParams.get("mood") && defaultMood) {
      // Verify the default mood exists in our options
      if (moods.includes(defaultMood)) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("mood", defaultMood);
        router.push(`/blog?${params.toString()}`, { scroll: false });
      }
      setIsInitialized(true);
    } else if (!isInitialized) {
      // Mark as initialized even if we don't set a default mood
      setIsInitialized(true);
    }
  }, [defaultMood, isInitialized, moods, router, searchParams]);

  const handleMoodChange = e => {
    const mood = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
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
        value={selectedMood || ""}
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
