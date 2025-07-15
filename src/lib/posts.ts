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
import { bundledLanguages, getSingletonHighlighter } from "shiki";
import rehypeRaw from "rehype-raw";
import remarkWikiLink from "remark-wiki-link";
import remarkCallout from "@r4ai/remark-callout";
import readingTime from "reading-time";
import remarkFlexibleMarkers from "remark-flexible-markers";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostData = {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	contentHtml: string;
	content: string; // Add raw content
	status: string; // Add status
};

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
			title: (matterResult.data as { title?: string }).title || slug,
			date: (matterResult.data as { date?: string }).date || stats.birthtime.toISOString(),
			status: (matterResult.data as { status?: string }).status || "draft",
			description: (matterResult.data as { description?: string }).description || "",
			tags: (matterResult.data as { tags?: string[] }).tags || [],
			coverImage: (matterResult.data as { coverImage?: string }).coverImage || null,
			readingTime: readingTime(fileContents).text,
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
		// Decode URI component to handle non-ASCII characters
		const decodedFileName = decodeURIComponent(fileName);
		return {
			// Remove ".md" from file name to get id
			slug: decodedFileName.replace(/\.md$/, ""),
		};
	});
}

export const getPostBySlug = cache(async (slug: string): Promise<PostData | null> => {
	const fullPath = path.join(postsDirectory, `${slug}.md`);

	if (!fs.existsSync(fullPath)) {
		console.warn(`Post not found for slug: ${slug}`);
		return null;
	}

	const stats = fs.statSync(fullPath);
	const fileContents = fs.readFileSync(fullPath, "utf8");
	const matterResult = matter(fileContents);
	const { data, content } = matterResult;

	const contentHtml = await unified()
		.use(remarkParse)
		.use(remarkWikiLink, {
			pageResolver: (name: string) => [name],
			hrefTemplate: (permalink: string) => `/blog/${encodeURIComponent(permalink)}`,
			aliasDivider: "|",
		})
		.use(remarkGfm)
		.use(remarkFlexibleMarkers)
		.use(remarkCallout)
		.use(remarkMath)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeKatex)
		.use(rehypePrettyCode, {
			theme: {
				light: "github-light",
				dark: "github-dark",
			},
			keepBackground: false,
			getHighlighter: options =>
				getSingletonHighlighter({
					...options,
					langs: [
						...Object.keys(bundledLanguages),
						"toml",
						"json",
						"yaml",
						"javascript",
						"typescript",
						"jsx",
						"tsx",
						"bash",
						"css",
						"html",
						"diff",
						"dockerfile",
					],
				}),
		})
		.use(rehypeStringify)
		.process(content);

	return {
		slug,
		title: (data.title as string) || slug,
		date: (data.date as string) || stats.birthtime.toISOString(),
		tags: (data.tags as string[]) || [],
		contentHtml: contentHtml.toString(),
		content: content, // Return raw content
		status: (data.status as string) || "draft", // Return status
	};
});

export async function getAllPosts() {
	const slugs = fs.readdirSync(postsDirectory).map(file => file.replace(/\.md$/, ""));
	const allPosts = await Promise.all(slugs.map(slug => getPostBySlug(slug)));

	// Filter out null posts if any were not found
	return allPosts
		.filter(post => post !== null)
		.sort((a, b) => {
			if (a!.date < b!.date) {
				return 1;
			} else {
				return -1;
			}
		});
}
