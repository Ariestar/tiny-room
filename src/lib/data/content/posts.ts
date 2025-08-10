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
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import { rehypeExtractToc, type TocEntry } from "./markdown/rehype-extract-toc";
// 新增的Markdown插件导入
import remarkDirective from "remark-directive";
import remarkBreaks from "remark-breaks";
// import rehypeMermaid from "rehype-mermaid";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostData = {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	contentHtml: string;
	content: string; // Add raw content
	status: string; // Add status
	toc: TocEntry[]; // Add table of contents
	readingTime: number; // Add reading time
	description?: string; // Add description field
	image?: string; // Add image field
	coverImage?: string | null; // Add cover image field
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

		// Ensure tags are always an array
		let tags = matterResult.data.tags || [];
		if (typeof tags === "string") {
			tags = tags.split(/, *| +/);
		}

		// Combine the data with the id
		return {
			slug,
			title: (matterResult.data as { title?: string }).title || slug,
			date:
				(matterResult.data as { "date created"?: string })["date created"] ||
				(matterResult.data as { date?: string }).date ||
				stats.mtime.toISOString(),
			status: (matterResult.data as { status?: string }).status || "draft",
			description: (matterResult.data as { description?: string }).description || "",
			tags: tags,
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

	// Ensure tags are always an array
	let tags_processed = data.tags || [];
	if (typeof tags_processed === "string") {
		tags_processed = tags_processed.split(/, *| +/);
	}

	const processedContent = await unified()
		.use(remarkParse)
		.use(remarkWikiLink, {
			pageResolver: (name: string) => [name],
			hrefTemplate: (permalink: string) => `/blog/${encodeURIComponent(permalink)}`,
			aliasDivider: "|",
		})
		.use(remarkGfm)
		.use(remarkBreaks) // 新增：更自然的换行处理
		.use(remarkDirective) // 新增：支持指令语法
		// .use(remarkAdmonitions) // 暂时注释：修复prototype错误
		// remark-gfm已经包含脚注功能，无需单独添加remarkFootnotes
		.use(remarkFlexibleMarkers)
		.use(remarkCallout)
		.use(remarkMath)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, {
			behavior: "prepend",
			properties: {
				className: ["subheading-anchor"],
				"aria-hidden": "true",
				tabIndex: -1,
			},
		})
		.use(rehypeExtractToc) // Use our NEW rehype plugin here
		.use(rehypeExternalLinks, {
			target: "_blank",
			rel: ["noopener", "noreferrer"],
		})
		// .use(rehypeMermaid, {
		// 	// 新增：支持Mermaid图表
		// 	strategy: "inline-svg",
		// 	dark: true,
		// })
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
						"mermaid", // 新增：支持mermaid语言高亮
					],
				}),
		})
		.use(rehypeStringify)
		.process(content);

	return {
		slug,
		title: (data.title as string) || slug,
		date: (data["date created"] as string) || (data.date as string),
		tags: tags_processed,
		contentHtml: processedContent.toString(),
		content: content, // Return raw content
		status: (data.status as string) || "draft", // Return status
		toc: (processedContent.data.toc as TocEntry[]) || [], // Return toc
		readingTime: readingTime(fileContents).minutes, // Calculate and return reading time
		description: (data.description as string) || content.slice(0, 150), // Add description
		image: (data.image as string) || (data.coverImage as string) || undefined, // Add image
		coverImage: (data.coverImage as string) || null, // Add cover image
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
