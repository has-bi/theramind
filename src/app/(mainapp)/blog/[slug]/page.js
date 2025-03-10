import { MDXRemote, compileMDX } from "next-mdx-remote/rsc";
import { promises as fs } from "fs";
import path from "path";

export default async function BlogPage() {
  const content = await fs.readFile(
    path.join(process.cwd(), "src/app/(mainapp)/blog/content", "abc.mdx"),
    "utf-8"
  );
  const data = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: true,
    },
  });
  console.log(data);
  console.log(content);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 prose prose-lg">
      {/* <MDXRemote source={content} /> */}
      page
    </div>
  );
}
