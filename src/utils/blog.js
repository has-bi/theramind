import fs from "fs";
import path from "path";
import matter from "gray-matter";

const slugToFileMap = new Map();
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

// Add this function to build the map
function buildSlugFileMap() {
  if (slugToFileMap.size > 0) return; // Only build once

  const files = fs.readdirSync(contentDirectory);
  files.forEach(filename => {
    const fullPath = path.join(contentDirectory, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    if (data.slug) {
      slugToFileMap.set(data.slug, filename);
    }
  });
}

// Modify getPostBySlug to use the map
export function getPostBySlug(slug) {
  try {
    buildSlugFileMap();
    const filename = slugToFileMap.get(slug);
    if (!filename) return null;

    const fullPath = path.join(contentDirectory, filename);
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
