import { getAllPosts, getAllMoods, getPostsByMood } from "@/utils/blog";
import Link from "next/link";
import BlogFilter from "./components/BlogFilter";
import { getMostFrequentMood } from "@/utils/getMostFrequentMood";
import { cookies } from "next/headers";

export default async function BlogPage({ searchParams }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value;
  const awaitedParams = await searchParams;
  const selectedMood = awaitedParams.mood || "";
  const posts = selectedMood ? getPostsByMood(selectedMood) : getAllPosts();
  const moods = getAllMoods();
  const defaultMood = await getMostFrequentMood(sessionId);
  // debug duluu
  console.log("debug from here");
  console.log("SessionID:", sessionId);
  console.log("Default Mood:", defaultMood);
  console.log("Available Moods:", moods);
  console.log("Selected Mood:", selectedMood);

  const processedDefaultMood = defaultMood ? defaultMood.toLowerCase() : null;

  return (
    <div className="min-h-screen px-4">
      <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-3 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-white"
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
  );
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getMoodColor(mood) {
  const moodLower = mood.toLowerCase();

  const colors = {
    happy: { bg: "bg-mood-happy", text: "text-white" },
    sad: { bg: "bg-mood-sad", text: "text-white" },
    calm: { bg: "bg-mood-calm", text: "text-white" },
    angry: { bg: "bg-mood-angry", text: "text-white" },
    anxious: { bg: "bg-mood-anxious", text: "text-white" },
    neutral: { bg: "bg-mood-neutral", text: "text-gray-700" },
    stressed: { bg: "bg-mood-stressed", text: "text-white" },
    excited: { bg: "bg-mood-excited", text: "text-gray-700" },
    tired: { bg: "bg-mood-tired", text: "text-blue-800" },
    confused: { bg: "bg-mood-confused", text: "text-white" },
    grateful: { bg: "bg-mood-grateful", text: "text-cyan-800" },
    loved: { bg: "bg-mood-loved", text: "text-white" },
    default: { bg: "bg-gray-100", text: "text-gray-700" },
  };

  return colors[moodLower] || colors.default;
}
