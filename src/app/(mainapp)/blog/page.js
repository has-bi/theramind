import { getAllPosts, getAllMoods, getPostsByMood } from "@/utils/blog";
import Link from "next/link";
import BlogFilter from "./components/BlogFilter";

export default async function BlogPage({ searchParams }) {
  const selectedMood = (await searchParams.mood) || "";
  const posts = selectedMood ? getPostsByMood(selectedMood) : getAllPosts();
  const moods = getAllMoods();
  console.log("posts", posts);

  return (
    <div className="mobile-container w-full max-w-[480px] bg-white min-h-screen px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">TheraMind Blog</h1>

      <BlogFilter moods={moods} selectedMood={selectedMood} />

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No blog posts found for this mood.</p>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.slug}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="p-6">
                  {post.mood && (
                    <div
                      className="text-xs font-semibold uppercase tracking-wider mb-2 inline-block px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: getMoodColor(post.mood).bg,
                        color: getMoodColor(post.mood).text,
                      }}
                    >
                      {post.mood}
                    </div>
                  )}
                  <h2 className="text-lg font-bold mb-2">{post.title}</h2>
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

// Helper functions
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
    happy: { bg: "#4ADE80", text: "#FFFFFF" }, // Green
    sad: { bg: "#93C5FD", text: "#FFFFFF" }, // Light blue
    calm: { bg: "#3B82F6", text: "#FFFFFF" }, // Blue
    angry: { bg: "#F87171", text: "#FFFFFF" }, // Red
    anxious: { bg: "#C084FC", text: "#FFFFFF" }, // Purple
    neutral: { bg: "#D1D5DB", text: "#374151" }, // Gray
    stressed: { bg: "#FDBA74", text: "#FFFFFF" }, // Orange
    excited: { bg: "#FDE047", text: "#374151" }, // Yellow
    tired: { bg: "#BFDBFE", text: "#1E40AF" }, // Lighter blue
    confused: { bg: "#FDA4AF", text: "#FFFFFF" }, // Pink
    grateful: { bg: "#67E8F9", text: "#0E7490" }, // Teal
    loved: { bg: "#FDA4AF", text: "#FFFFFF" }, // Pink
    default: { bg: "#F3F4F6", text: "#374151" }, // Light gray
  };

  return colors[moodLower] || colors.default;
}
