// app/(mainapp)/blog/page.js
import { getAllPosts, getAllMoods, getPostsByMood } from "@/utils/blog";
import Link from "next/link";
import BlogFilter from "./components/BlogFilter";

export default function BlogPage({ searchParams }) {
  const selectedMood = searchParams.mood || "";
  const posts = selectedMood ? getPostsByMood(selectedMood) : getAllPosts();
  const moods = getAllMoods();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mental Health Blog</h1>

      <BlogFilter moods={moods} selectedMood={selectedMood} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
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
  const colors = {
    anxious: { bg: "#FEF3C7", text: "#92400E" },
    calm: { bg: "#DBEAFE", text: "#1E40AF" },
    happy: { bg: "#D1FAE5", text: "#065F46" },
    sad: { bg: "#E0E7FF", text: "#3730A3" },
    angry: { bg: "#FEE2E2", text: "#B91C1C" },
    default: { bg: "#F3F4F6", text: "#374151" },
  };

  return colors[mood] || colors.default;
}
