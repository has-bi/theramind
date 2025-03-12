"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BlogFilter({ moods, selectedMood }) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
        className="w-full md:w-64 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      >
        <option value="">neutral</option>
        {moods.map(mood => (
          <option key={mood} value={mood}>
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
