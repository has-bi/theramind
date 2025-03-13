import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/app/(mainapp)/blog/content");

export function getAllPosts() {
  try {
    const filenames = fs.readdirSync(contentDirectory);

    return filenames
      .filter(filename => filename.endsWith(".mdx"))
      .map(filename => {
        const fullPath = path.join(contentDirectory, filename);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data } = matter(fileContents);

        return {
          slug: data.slug || filename.replace(/\.mdx$/, ""), // Use frontmatter slug or fallback to filename
          title: data.title || data.slug,
          excerpt: data.excerpt || "",
          date: data.date || new Date().toISOString(),
          author: data.author || "Theramind",
          mood: data.mood || "neutral",
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return [];
  }
}

export function getPostsByMood(mood) {
  try {
    const posts = getAllPosts();
    return posts.filter(post => post.mood === mood);
  } catch (error) {
    console.error("Error in getPostsByMood:", error);
    return [];
  }
}

export function getAllMoods() {
  try {
    const posts = getAllPosts();
    const moods = [...new Set(posts.map(post => post.mood).filter(Boolean))];
    return moods;
  } catch (error) {
    console.error("Error in getAllMoods:", error);
    return [];
  }
}

export function getPostBySlug(slug) {
  try {
    // We need to find the file that matches the slug in frontmatter
    const filenames = fs.readdirSync(contentDirectory);
    let targetFile = null;

    for (const filename of filenames) {
      const fullPath = path.join(contentDirectory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      
      if (data.slug === slug) {
        targetFile = filename;
        break;
      }
    }

    if (!targetFile) {
      return null;
    }

    const fullPath = path.join(contentDirectory, targetFile);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug,
      content,
      title: data.title || data.slug,
      excerpt: data.excerpt || "",
      date: data.date || new Date().toISOString(),
      author: data.author || "Anonymous",
      mood: data.mood || "neutral",
    };
  } catch (error) {
    console.error(`Error in getPostBySlug for slug "${slug}":`, error);
    return null;
  }
}
