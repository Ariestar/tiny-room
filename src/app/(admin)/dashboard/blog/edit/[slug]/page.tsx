import { getPostBySlug, getAllPostSlugs } from "@/lib/data/content/posts";
import EditForm from "./EditForm";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const posts = getAllPostSlugs();
	return posts.map(post => ({
		slug: post.slug,
	}));
}

export default async function EditPostPage({ params }: { params: { slug: string } }) {
	const post = await getPostBySlug(params.slug);

	if (!post) {
		notFound();
	}

	return (
		<div className='container mx-auto py-10'>
			<h1 className='text-3xl font-bold mb-6'>Edit Post: {post.title}</h1>
			<EditForm post={post} />
		</div>
	);
}
