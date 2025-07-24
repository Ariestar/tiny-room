import "katex/dist/katex.min.css";
import { getPostBySlug, getAllPostSlugs } from "@/lib/data/content/posts";
import { notFound } from "next/navigation";
import "@/styles/prose.css";
import { PageTransition } from "@/components/animation/PageTransition";
import { TableOfContents } from "@/components/feature/blog/TableOfContents";
import { ArticleMetadata } from "@/components/feature/blog/ArticleMetadata";

type Props = {
	params: {
		slug: string;
	};
};

export async function generateStaticParams() {
	const slugs = getAllPostSlugs();
	return slugs.map(item => ({
		slug: item.slug,
	}));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
	const decodedSlug = decodeURIComponent((await params).slug);
	const post = await getPostBySlug(decodedSlug);

	if (!post) {
		return notFound();
	}

	return {
		title: post.title,
		description: post.content.slice(0, 150),
	};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
	const decodedSlug = decodeURIComponent((await params).slug);
	const post = await getPostBySlug(decodedSlug);

	if (!post) {
		return notFound();
	}

	return (
		<div className='container mx-auto max-w-6xl px-4 py-12'>
			<PageTransition transitionType="slide">
				<div className='flex flex-col lg:flex-row-reverse lg:justify-between'>
					<aside className='hidden lg:block sticky top-24 h-full w-64 flex-shrink-0 lg:pl-12'>
						<TableOfContents toc={post.toc} />
					</aside>
					<main className='w-full lg:max-w-[calc(100%-16rem)]'>
						<div className='prose prose-zinc mx-auto dark:prose-invert lg:prose-lg font-blog'>
							<h1 className='mb-6 text-3xl font-bold' id='page-title'>
								{post.title}
							</h1>

							<ArticleMetadata
								date={post.date}
								readingTime={post.readingTime || "未知"}
								tags={post.tags}
								className='mb-8 pb-6 border-b border-gray-200 dark:border-gray-700'
							/>

							<article
								className='text-xl'
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>
						</div>
					</main>
				</div>
			</PageTransition>
		</div>
	);
}
