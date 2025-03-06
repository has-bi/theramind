// src/app/(mainapp)/blog/[slug]/page.js
export default async function Page({ params }) {
  const { slug } = await params;

  try {
    // ambil post dari folder konten (`src/app/(mainapp)/blog/[slug]/content/${slug}.mdx`)
    const Post = (await import(`../content/${slug}.mdx`)).default;
    return (
      <article className="prose max-w-screen p-4">
        <Post />
      </article>
    );
  } catch (error) {
    console.error(`Import error:`, error.message);
    return <div>Post not found</div>;
  }
}
