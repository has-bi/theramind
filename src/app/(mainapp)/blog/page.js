"use server";

import { getAllPosts, getAllMoods, getPostsByMood } from "@/utils/blog";
import Link from "next/link";
import BlogFilter from "./components/BlogFilter";
import { getMostFrequentMood } from "@/utils/getMostFrequentMood";
import { cookies } from "next/headers";
import getMoodColor from "@/utils/getMoodColor";

export default async function BlogPage({ searchParams }) {
  const { mood } = await searchParams;
  const selectedMood = mood || "";

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;

  // Get all moods and make sure "all" is the first option
  const moods = ["all", ...getAllMoods()];

  // Get user's most frequent mood (top mood)
  const defaultMood = await getMostFrequentMood(sessionId);

  // For debugging coy
  console.log("Default/Top Mood:", defaultMood);

  // Process default mood - ensure it's lowercase for consistency
  const processedDefaultMood = defaultMood ? defaultMood.toLowerCase() : null;

  // Update posts selection logic to handle "all" mood
  const posts =
    selectedMood === "all" || !selectedMood ? getAllPosts() : getPostsByMood(selectedMood);

  return (
    <div className="mobile-container bg-white min-h-screen relative overflow-hidden">
      <header className="px-4 py-3 bg-white rounded-b-2xl border-b border-gray-100 mb-4 shadow-sm">
        <div className="flex items-center">
          <div className="w-9 h-9 rounded-lg bg-mood-stressed flex items-center justify-center mr-2 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 "
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">TheraBlog</h1>
            <p className="text-xs text-gray-500">Your daily companion for mental wellness</p>
          </div>
        </div>
      </header>

      <div className="page-container">
        <BlogFilter moods={moods} selectedMood={selectedMood} defaultMood={processedDefaultMood} />
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div>
              <p className="text-gray-600">No blog posts found for this mood.</p>
            </div>
          ) : (
            posts.map(post => (
              <div
                key={post.slug}
                className="rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    {post.mood && (
                      <div
                        className={`text-xs font-semibold uppercase tracking-wider mb-2 inline-block px-2 py-1 rounded-full ${
                          getMoodColor(post.mood).bg
                        } ${getMoodColor(post.mood).text}`}
                      >
                        {post.mood}
                      </div>
                    )}
                    <h2 className="text-lg font-bold mb-2 hover:text-indigo-600">{post.title}</h2>
                    <p className=" text-sm text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{post.author}</span>
                      <span>{formatDate(post.date)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
