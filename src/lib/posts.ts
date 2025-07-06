import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
	// Get file names under /posts
	const fileNames = fs.readdirSync(postsDirectory);
	const allPostsData = fileNames.map(fileName => {
		// Decode URI component to handle non-ASCII characters
		const decodedFileName = decodeURIComponent(fileName);
		// Remove ".md" from file name to get id
		const slug = decodedFileName.replace(/\.md$/, "");

		// Read markdown file as string
		const fullPath = path.join(postsDirectory, decodedFileName);
		const stats = fs.statSync(fullPath); // Get file stats
		const fileContents = fs.readFileSync(fullPath, "utf8");

		// Use gray-matter to parse the post metadata section
		const matterResult = matter(fileContents);

		// Combine the data with the id
		return {
			slug,
			title: slug, // Use filename as title
			date: stats.birthtime.toISOString(), // Use file creation date
			status: (matterResult.data as { status?: string }).status || "draft",
		};
	});
	// Sort posts by date
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export function getAllPostSlugs() {
	const fileNames = fs.readdirSync(postsDirectory);

	// Returns an array that looks like:
	// [
	//   {
	//     params: {
	//       slug: 'ssg-ssr'
	//     }
	//   },
	//   {
	//     params: {
	//       slug: 'pre-rendering'
	//     }
	//   }
	// ]
	return fileNames.map(fileName => {
		return {
			params: {
				slug: decodeURIComponent(fileName).replace(/\.md$/, ""),
			},
		};
	});
}

export async function getPostDataBySlug(slug: string) {
	const decodedSlug = decodeURIComponent(slug);
	const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
	const stats = fs.statSync(fullPath); // Get file stats
	const fileContents = fs.readFileSync(fullPath, "utf8");

	// Use gray-matter to parse the post metadata section
	const matterResult = matter(fileContents);

	// Use remark to convert markdown into HTML string
	const processedContent = await remark().use(html).process(matterResult.content);
	const contentHtml = processedContent.toString();

	// Combine the data with the id and contentHtml
	return {
		slug: decodedSlug,
		title: decodedSlug, // Use filename as title
		date: stats.birthtime.toISOString(), // Use file creation date
		contentHtml,
		content: matterResult.content,
		status: (matterResult.data as { status?: string }).status || "draft",
	};
}
