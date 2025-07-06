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
import rehypeRaw from "rehype-raw";
import remarkWikiLink from "remark-wiki-link";

// A simple slugify function to replace the external dependency.
const customSlugify = (str: string) => {
	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/&/g, "-and-") // Replace & with 'and'
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars
		.replace(/\-\-+/g, "-"); // Replace multiple - with single -
};

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
			slug: customSlugify(fileName.replace(/\.md$/, "")),
		};
	});
}

export const getPostBySlug = cache(async (slug: string) => {
	const fileNames = fs.readdirSync(postsDirectory);

	// Create a set of all available slugs for quick lookups.
	const allSlugs = new Set(
		fileNames.map(fileName => customSlugify(fileName.replace(/\.md$/, "")))
	);

	const matchingFileName = fileNames.find(fileName => {
		const slugFromFileName = customSlugify(fileName.replace(/\.md$/, ""));
		return slugFromFileName === slug;
	});

	if (!matchingFileName) {
		console.warn(`Post not found for slug: ${slug}`);
		return null;
	}

	const fullPath = path.join(postsDirectory, matchingFileName);

	const fileContents = fs.readFileSync(fullPath, "utf8");
	const matterResult = matter(fileContents);
	const { data, content } = matterResult;

	const contentHtml = await unified()
		.use(remarkParse)
		.use(remarkWikiLink, {
			pageResolver: (name: string) => {
				const potentialSlug = customSlugify(name);
				if (allSlugs.has(potentialSlug)) {
					return [potentialSlug];
				}
				return [];
			},
			hrefTemplate: (permalink: string) => `/blog/${permalink}`,
			aliasDivider: "|",
		})
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeKatex)
		.use(rehypePrettyCode, {
			theme: "github-dark",
		})
		.use(rehypeStringify)
		.process(content);

	return {
		slug,
		...(data as { title: string; date: string; tags: string[] }),
		contentHtml: contentHtml.toString(),
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
