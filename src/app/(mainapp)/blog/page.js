import fs from "fs";
import path from "path";
import Link from "next/link";

export default function BlogPage() {
  // Get all blog posts from content/blog directory
  const blogDirectory = path.join(process.cwd(), "src/app/(mainapp)/blog/content");
  let allPosts = [];

  try {
    const files = fs.readdirSync(blogDirectory).filter(file => file.endsWith(".mdx"));

    files.forEach(file => {
      const filePath = path.join(blogDirectory, file);
      const slug = file.replace(".mdx", "");

      // Extract metadata from MDX frontmatter
      const content = fs.readFileSync(filePath, "utf8");
      const metadata = extractMetadata(content);

      allPosts.push({
        slug,
        title: metadata.title || slug.split("-").join(" "),
        description: metadata.description || "",
        date: metadata.date || "",
        author: metadata.author || "",
        emotion: metadata.emotion || "",
      });
    });

    // Sort posts by date (newest first)
    allPosts.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
  } catch (error) {
    console.error("Error reading blog directory:", error);
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Our Blog</h1>

      {/* Posts grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allPosts.map(post => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.slug}
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <article className="h-full flex flex-col">
              <div className="flex justify-between items-start mb-3">
                {post.emotion && (
                  <span className="inline-block text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                    {post.emotion}
                  </span>
                )}
                {post.date && (
                  <span className="text-xs text-gray-400">
                    {formatDate(post.date)}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-semibold mb-3 capitalize group-hover:text-blue-600 transition-colors text-gray-800">
                {post.title}
              </h2>

              {post.description && (
                <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                  {post.description}
                </p>
              )}

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                {post.author && (
                  <div className="text-sm text-gray-500 font-medium">
                    By {post.author}
                  </div>
                )}
                
                <p className="text-blue-600 flex items-center font-medium">
                  Read article
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {allPosts.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            No blog posts found. Make sure you have .mdx files in the src/app/(mainapp)/blog/content directory.
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to extract metadata from MDX frontmatter
function extractMetadata(content) {
  const metadataRegex = /---\s*([\s\S]*?)\s*---/;
  const match = metadataRegex.exec(content);

  if (!match) return {};

  const metadataString = match[1];
  const metadata = {};

  metadataString.split("\n").forEach(line => {
    const [key, ...valueArr] = line.split(":");
    if (key && valueArr.length) {
      const value = valueArr.join(":").trim();
      if (value) {
        metadata[key.trim()] = value.replace(/^"(.*)"$/, "$1");
      }
    }
  });

  return metadata;
}

// Helper function to format date
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
}
