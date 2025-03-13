//the function of this script is to duplicate the mdx files in the content directory
//reads frontmatter
//gets mood
//creates directory inside matched moods
//creates directory with same name as mdx file
//copies mdx file to new directory
//renames mdx file to page.mdx

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Define the paths - now relative to the blog directory
const contentDir = path.join("content");
const targetBaseDir = path.join("(if-frontmatter-not-work)");

// Ensure the target base directory exists
try {
  if (!fs.existsSync(targetBaseDir)) {
    fs.mkdirSync(targetBaseDir, { recursive: true });
    console.log(`Created directory: ${targetBaseDir}`);
  }
} catch (err) {
  console.error(`Error creating directory ${targetBaseDir}:`, err);
  process.exit(1);
}

// Check if content directory exists
try {
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory does not exist: ${contentDir}`);
    console.log("Creating the content directory...");
    fs.mkdirSync(contentDir, { recursive: true });
    console.log(`Created directory: ${contentDir}`);
    console.log("No MDX files to process since the directory was just created.");
    process.exit(0);
  }
} catch (err) {
  console.error(`Error checking/creating content directory:`, err);
  process.exit(1);
}

// Read all files in the content directory
let files;
try {
  files = fs.readdirSync(contentDir);
  console.log(`Found ${files.length} files in ${contentDir}`);
} catch (err) {
  console.error(`Error reading content directory:`, err);
  process.exit(1);
}

// Process each MDX file
let processedCount = 0;
files.forEach(filename => {
  // Skip non-MDX files
  if (!filename.endsWith(".mdx")) {
    console.log(`Skipping non-MDX file: ${filename}`);
    return;
  }

  const sourceFilePath = path.join(contentDir, filename);

  try {
    // Read the file content
    const fileContent = fs.readFileSync(sourceFilePath, "utf8");
    console.log(`Read file: ${sourceFilePath}`);

    // Parse frontmatter
    const { data: frontmatter, content } = matter(fileContent);

    // Extract mood from frontmatter
    const mood = frontmatter.mood || "unknown";
    console.log(`Extracted mood "${mood}" from ${filename}`);

    // Create the mood directory if it doesn't exist
    const moodDir = path.join(targetBaseDir, mood);
    if (!fs.existsSync(moodDir)) {
      fs.mkdirSync(moodDir, { recursive: true });
      console.log(`Created mood directory: ${moodDir}`);
    }

    // Create a directory with the original filename (without extension)
    const filenameWithoutExt = path.basename(filename, ".mdx");
    const targetDir = path.join(moodDir, filenameWithoutExt);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log(`Created target directory: ${targetDir}`);
    }

    // Create the destination path for the new page.mdx file
    const targetFilePath = path.join(targetDir, "page.mdx");

    // Copy the file content to the new location
    fs.writeFileSync(targetFilePath, fileContent);
    console.log(`Duplicated ${filename} to ${targetFilePath}`);
    processedCount++;
  } catch (error) {
    console.error(`Error processing file ${filename}:`, error);
  }
});

console.log(`MDX duplication process complete! Processed ${processedCount} files.`);
