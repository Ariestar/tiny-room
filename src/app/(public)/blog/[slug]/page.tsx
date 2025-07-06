import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";
import "katex/dist/katex.min.css";

export async function generateStaticParams() {
	const paths = getAllPostSlugs();
	// The paths should be an array of objects like [{ slug: 'post-1' }, { slug: 'post-2' }]
	// The key 'slug' must match the dynamic segment [slug]
	return paths.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const decodedSlug = decodeURIComponent((await params).slug);
	const post = await getPostBySlug(decodedSlug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	return {
		title: post.title,
	};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
	const decodedSlug = decodeURIComponent((await params).slug);
	const post = await getPostBySlug(decodedSlug);

	if (!post) {
		notFound();
	}

	return (
		<article className='container mx-auto px-4 py-8 prose lg:prose-xl dark:prose-invert'>
			<h1>{post.title}</h1>
			<div className='text-muted-foreground mb-8'>
				<time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
			</div>
			<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
		</article>
	);
}
