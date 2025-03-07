// export default function page() {
//   return <div className="min-h-screen content-center">we will (map) the blog here</div>;
// }

// app/blog/page.js
import fs from "fs";
import path from "path";
import Link from "next/link";

export default function BlogIndex() {
  // Get all blog posts
  const files = fs.readdirSync(path.join(process.cwd(), "src/app/(mainapp)/blog/content"));

  const posts = files
    .filter(filename => filename.endsWith(".mdx"))
    .map(filename => ({
      slug: filename.replace(".mdx", ""),
      title: filename.replace(".mdx", "").split("-").join(" "),
    }));
  //test rebuild
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-xl hover:text-blue-500">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
