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
		<>
			{/* 浮动TOC - 桌面端，移到PageTransition外面 */}
			<aside className='hidden lg:block fixed top-20 right-4 w-64 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl p-4 max-h-[calc(100vh-10rem)] overflow-y-auto transition-all duration-300 hover:shadow-2xl'>
				<TableOfContents toc={post.toc} />
			</aside>

			<div className='container mx-auto max-w-4xl px-4 py-12'>
				<PageTransition transitionType="slide">
					{/* 移动端TOC - 在内容前显示 */}
					<div className='lg:hidden mb-8'>
						<div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700'>
							<TableOfContents toc={post.toc} />
						</div>
					</div>

					{/* 居中的主内容 */}
					<main className='w-full'>
						<div className='prose prose-zinc mx-auto dark:prose-invert lg:prose-lg font-blog max-w-3xl'>
							<h1 className='mb-6 text-3xl font-bold text-center' id='page-title'>
								{post.title}
							</h1>

							<ArticleMetadata
								date={post.date}
								readingTime={post.readingTime || "未知"}
								tags={post.tags}
								className='mb-8 pb-6 border-b border-gray-200 dark:border-gray-700 text-center'
							/>

							<article
								className='text-lg leading-relaxed'
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>
						</div>
					</main>
				</PageTransition>
			</div>
		</>
	);
}
