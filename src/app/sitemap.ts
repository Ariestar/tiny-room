import { MetadataRoute } from "next";
import { generateSitemapEntries } from "@/lib/seo/seo";
import { getSortedPostsData } from "@/lib/data/content/posts";
import { getAllProjects } from "@/lib/data/content/projects";
import { getSortedGalleryData } from "@/lib/data/content/gallery";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseEntries = generateSitemapEntries();

	// 获取博客文章
	const posts = getSortedPostsData();
	const blogEntries = posts.map(post => ({
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
		lastModified: new Date(post.date),
		changeFrequency: "daily" as const,
		priority: 1,
	}));

	// 获取项目
	const projects = getAllProjects();
	const projectEntries = projects.map(project => ({
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.id}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: 0.6,
	}));

	// 获取gallery
	const gallery = getSortedGalleryData();
	const galleryEntries = gallery.map(gallery => ({
		url: `${process.env.NEXT_PUBLIC_SITE_URL}/gallery/${gallery.id}`,
		lastModified: new Date(),
		changeFrequency: "daily" as const,
		priority: 0.9,
	}));

	return [...baseEntries, ...blogEntries, ...projectEntries];
}
