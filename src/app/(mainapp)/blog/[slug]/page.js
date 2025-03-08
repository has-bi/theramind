// app/(mainapp)/blog/[slug]/page.jsx
import { getPostBySlug } from "@/utils/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <p>Sorry, the blog post you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/blog" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to blog
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to all posts
      </Link>

      <article className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 mb-8 text-gray-600">
          {post.date && <span>{formatDate(post.date)}</span>}
          {post.author && (
            <>
              <span>•</span>
              <span>By {post.author}</span>
            </>
          )}
          {post.mood && (
            <>
              <span>•</span>
              <span
                className="px-2 py-1 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: getMoodColor(post.mood).bg,
                  color: getMoodColor(post.mood).text,
                }}
              >
                {post.mood}
              </span>
            </>
          )}
        </div>

        <MDXRemote source={post.content} />
      </article>
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
