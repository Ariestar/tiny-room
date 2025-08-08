import { MetadataRoute } from "next";
import { generateSitemapEntries } from "@/lib/seo/seo";
import { getSortedPostsData } from "@/lib/data/content/posts";
import { getAllProjects } from "@/lib/data/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseEntries = generateSitemapEntries();

	// 获取博客文章
	const posts = getSortedPostsData();
	const blogEntries = posts.map(post => ({
		url: `https://tinyroom.dev/blog/${post.slug}`,
		lastModified: new Date(post.date),
		changeFrequency: "monthly" as const,
		priority: 0.7,
	}));

	// 获取项目
	const projects = getAllProjects();
	const projectEntries = projects.map(project => ({
		url: `https://tinyroom.dev/projects/${project.id}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	return [...baseEntries, ...blogEntries, ...projectEntries];
}
