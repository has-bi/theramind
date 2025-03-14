import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MarkDownRenderer } from "../components/markdown-renderer";
import getMoodColor from "@/utils/getMoodColor";

// Utility constants and functions
const BLOG_CONTENT_PATH = path.join(process.cwd(), "src/app/(mainapp)/blog/content");

const findFileBySlug = slug => {
  const files = fs.readdirSync(BLOG_CONTENT_PATH);

  for (const filename of files) {
    const filePath = path.join(BLOG_CONTENT_PATH, filename);
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContents);

    if (data.slug === slug) {
      return {
        filename,
        filePath,
        fileContents,
      };
    }
  }
  return null;
};

// Generate static params for all MDX files
export function generateStaticParams() {
  const files = fs.readdirSync(BLOG_CONTENT_PATH);

  return files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => {
      const filePath = path.join(BLOG_CONTENT_PATH, filename);
      const fileContents = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(fileContents);
      return {
        slug: data.slug,
      };
    });
}

// Generate metadata from frontmatter
export async function generateMetadata({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  try {
    const fileData = findFileBySlug(slug);

    if (!fileData) {
      return {
        title: "Blog Post Not Found",
        description: "Blog post not found",
      };
    }

    const { data } = matter(fileData.fileContents);
    return {
      title: data.title,
      description: data.excerpt,
    };
  } catch (error) {
    return {
      title: "Blog Post",
      description: "Blog post content",
    };
  }
}

// Main component - using Server Component pattern
export default async function BlogPage({ params }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  try {
    const fileData = findFileBySlug(slug);

    if (!fileData) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-red-500">Blog Post Not Found</h1>
          <p>Could not find the requested blog post.</p>
        </div>
      );
    }

    const { data: frontmatter, content } = matter(fileData.fileContents);

    return (
      <article className="mobile-container w-full max-w-[480px] bg-white min-h-screen px-4">
        <header className="px-5 py-4 bg-white rounded-b-3xl border-b border-gray-100 mb-6 shadow-sm">
          <div className="flex items-center">
            <a
              href="/blog"
              className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mr-3 shadow-sm hover:bg-indigo-700 transition-colors"
            >
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
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Read More</h1>
              <p className="text-xs text-gray-500">Back to all articles</p>
            </div>
          </div>
        </header>
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
            {frontmatter.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {frontmatter.mood && (
              <span
                className={`px-3 py-1 text-[10px] font-medium rounded-full ${
                  getMoodColor(frontmatter.mood).bg
                } ${getMoodColor(frontmatter.mood).text}`}
              >
                {frontmatter.mood}
              </span>
            )}
            {frontmatter.tags &&
              Array.isArray(frontmatter.tags) &&
              frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 text-[10px] font-medium rounded-full bg-gray-50 text-gray-600 border border-gray-100"
                >
                  {tag}
                </span>
              ))}
          </div>

          <div className="w-full h-[1px] bg-gray-100 mb-1"></div>

          <div className="flex justify-between gap-2 text-xs text-gray-500">
            {frontmatter.author && <span className="font-medium">By {frontmatter.author}</span>}

            {frontmatter.date && (
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </div>

        {/* remember, rendernya pake content!*/}
        <div className="prose prose-lg max-w-none text-sm whitespace-pre-line w-fit">
          <MarkDownRenderer content={content} />
        </div>
      </article>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Blog Post</h1>
        <p>We encountered an error while trying to load this blog post.</p>
      </div>
    );
  }
}
