import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

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

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), `src/app/(mainapp)/blog/content/${slug}.mdx`);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Read file content
  const content = fs.readFileSync(filePath, "utf8");
  const metadata = extractMetadata(content);

  // Instead of trying to import the MDX file, let's render the content directly
  // We'll strip out the frontmatter and display the content as HTML
  const contentWithoutFrontmatter = content.replace(/---\s*([\s\S]*?)\s*---/, "");

  return (
    <div className="container mx-auto py-8 px-4">
      <article className="prose lg:prose-xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{metadata.title || slug}</h1>
          {metadata.author && <p className="text-gray-600">By {metadata.author}</p>}
          {metadata.date && (
            <p className="text-gray-500 text-sm">
              {new Date(metadata.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {metadata.emotion && (
            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {metadata.emotion}
              </span>
            </div>
          )}
        </div>

        <div dangerouslySetInnerHTML={{ __html: contentWithoutFrontmatter }} />
      </article>
    </div>
  );
}
