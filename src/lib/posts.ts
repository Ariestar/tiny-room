import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { cache } from "react";

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
	return fileNames.map(fileName => {
		return {
			slug: fileName.replace(/\.md$/, ""),
		};
	});
}

export async function getAllPosts() {
	const slugs = getAllPostSlugs();
	const allPostsData = await Promise.all(slugs.map(s => getPostData(s.slug)));
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export const getPostData = cache(async (slug: string) => {
	const fullPath = path.join(postsDirectory, `${slug}.md`);

	if (!fs.existsSync(fullPath)) {
		// In a real app, you might want to throw an error or return a specific object.
		// For now, we'll log a warning and return a "not found" state.
		console.warn(`Post not found for slug: ${slug}`);
		return {
			slug,
			title: "Post Not Found",
			date: new Date().toISOString(),
			tags: [],
			content: "This post could not be found.",
		};
	}

	const fileContents = fs.readFileSync(fullPath, "utf8");

	const matterResult = matter(fileContents);

	const { data, content } = matterResult;

	return {
		slug,
		...(data as { title: string; date: string; tags: string[] }),
		content,
	};
});

export const markdownToHtml = async (markdown: string) => {
	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkRehype)
		.use(rehypeKatex)
		.use(rehypePrettyCode, {
			theme: "github-dark",
		})
		.use(rehypeStringify)
		.process(markdown);
	return result.toString();
};
