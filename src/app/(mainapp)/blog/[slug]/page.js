import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MarkDownRenderer } from "../components/markdown-renderer";

// Generate static params for all MDX files
export function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), "src/app/(mainapp)/blog/content"));

  return files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => ({
      slug: filename.replace(/\.mdx$/, ""),
    }));
}

// Generate metadata from frontmatter
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  console.log({ slug });

  const filePath = path.join(process.cwd(), "src/app/(mainapp)/blog/content", `${slug}.mdx`);

  try {
    // Read file and parse frontmatter
    const markdownWithMeta = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(markdownWithMeta);

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
  // Properly await params
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    // Read MDX file
    const filePath = path.join(process.cwd(), "src/app/(mainapp)/blog/content", `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-red-500">Blog Post Not Found</h1>
          <p>Could not find the requested blog post.</p>
        </div>
      );
    }

    // Read and parse MDX
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContents);

    console.log(frontmatter);
    console.log(content);

    return (
      <article className="mobile-container w-full max-w-[480px] bg-white min-h-screen px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{frontmatter.title}</h1>
          <div className="flex justify-between text-sm text-gray-500 mt-12 mb-2">
            {frontmatter.author && <span>By {frontmatter.author}</span>}
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
          <div className="flex flex-wrap gap-2 mb-4">
            {frontmatter.mood && (
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {frontmatter.mood}
              </span>
            )}
            {frontmatter.tags &&
              Array.isArray(frontmatter.tags) &&
              frontmatter.tags.map(tag => (
                <span
                  key={tag}
                  className=" px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
          </div>
        </header>

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
