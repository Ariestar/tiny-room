import { getSortedPostsData } from "@/lib/data/content/posts";
import BlogPageClient from "./BlogPageClient";

export const metadata = {
	title: "Blog",
	description: "A place for my thoughts, projects, and discoveries.",
};

export default function BlogPage() {
	const posts = getSortedPostsData();

	return <BlogPageClient posts={posts} />;
}
