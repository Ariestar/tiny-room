import { getAllPostSlugs, getPostDataBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
	const paths = getAllPostSlugs();
	// The paths should be an array of objects like [{ slug: 'post-1' }, { slug: 'post-2' }]
	// The key 'slug' must match the dynamic segment [slug]
	return paths.map(p => ({ slug: p.params.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
	try {
		const postData = await getPostDataBySlug(params.slug);
		return {
			title: postData.title,
		};
	} catch (error) {
		return {
			title: "Post Not Found",
		};
	}
}

export default async function PostPage({ params }: { params: { slug: string } }) {
	try {
		const postData = await getPostDataBySlug(params.slug);

		return (
			<article className='container mx-auto px-4 py-8 prose lg:prose-xl dark:prose-invert'>
				<h1 className='text-4xl font-bold mb-2'>{postData.title}</h1>
				<div className='text-gray-500 mb-8'>{postData.date}</div>
				<div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
			</article>
		);
	} catch (error) {
		notFound();
	}
}
