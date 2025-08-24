import "katex/dist/katex.min.css";
import { getPostBySlug, getAllPostSlugs } from "@/lib/data/content/posts";
import { notFound } from "next/navigation";
import "@/styles/prose.css";
import { PageTransition } from "@/components/animation/PageTransition";
import { TableOfContents } from "@/components/feature/blog/TableOfContents";
import { ArticleMetadata } from "@/components/feature/blog/ArticleMetadata";
import { ViewTracker } from "@/components/ui/ViewTracker";
import { BreadcrumbNav } from "@/components/layout/BreadcrumbNav";
import { SocialShare } from "@/components/feature/blog/SocialShare";
import { RelatedPosts } from "@/components/feature/blog/RelatedPosts";
import { FAQ } from "@/components/feature/blog/FAQ";
import { ArticleStructuredData } from "@/components/seo/EnhancedStructuredData";
import { PageTitle } from "@/components/ui/PageTitle";
import { TypographyControls } from "@/components/feature/blog/TypographyControls";

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

	const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/blog/${decodedSlug}`;

	return (
		<>
			{/* 自动追踪页面浏览量 */}
			<ViewTracker slug={decodedSlug} />

			{/* SEO 结构化数据 */}
			<ArticleStructuredData
				title={post.title}
				description={post.description || post.content.slice(0, 150)}
				url={currentUrl}
				datePublished={post.date}
				dateModified={post.date}
				tags={post.tags}
				image={post.image}
			/>

			{/* 开发环境 SEO 分析器 */}
			{/* {process.env.NODE_ENV === 'development' && (
				<SEOAnalyzer
					title={post.title}
					content={post.content}
				/>
			)} */}

			{/* 开发环境性能监控 */}
			{/* {process.env.NODE_ENV === 'development' && <PerformanceMonitor />} */}

			{/* 浮动TOC - 桌面端 */}
			{post.toc && post.toc.length > 0 && (
				<aside className='hidden 2xl:block fixed top-0 h-full w-72 z-50 bg-transparent rounded-lg scrollbar-none overflow-y-auto transition-all duration-300 '>
					<TableOfContents toc={post.toc} position="left" />
				</aside>
			)}

			{/* 字体控制组件 */}
			<TypographyControls />

			<div className='container mx-auto max-w-4xl px-4 py-12'>
				<PageTransition transitionType="slide">
					{/* 面包屑导航 */}
					<BreadcrumbNav
						items={[
							{ name: '首页', url: '/' },
							{ name: '博客', url: '/blog' },
							{ name: post.title, url: `/blog/${decodedSlug}`, isActive: true }
						]}
						className="mb-8"
					/>

					{/* 居中的主内容 */}
					<main className='w-full'>
						<div className='prose prose-sm prose-zinc mx-auto dark:prose-invert lg:prose-lg font-blog max-w-3xl'>
							<PageTitle title={post.title} className="text-center text-foreground font-blog" />

							<ArticleMetadata
								date={post.date}
								readingTime={post.readingTime || 0}
								tags={post.tags}
								url={currentUrl}
								title={post.title}
								description={post.description || post.content.slice(0, 150)}
								showShare={true}
								className='mb-8 text-center'
							/>

							{/* 分隔线 */}
							<div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>

							<article
								className='leading-relaxed'
								dangerouslySetInnerHTML={{ __html: post.contentHtml }}
							/>

							{/* 社交分享 - 文章底部 */}
							<div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
								{/* 桌面端分享 */}
								<div className="hidden sm:block">
									<SocialShare
										url={currentUrl}
										title={post.title}
										description={post.description || post.content.slice(0, 150)}
										hashtags={post.tags}
										variant="default"
										showLabels={true}
									/>
								</div>

								{/* 移动端分享 */}
								<div className="block sm:hidden">
									<SocialShare
										url={currentUrl}
										title={post.title}
										description={post.description || post.content.slice(0, 150)}
										hashtags={post.tags}
										variant="mobile"
										showLabels={true}
									/>
								</div>
							</div>

							{/* FAQ 组件 - 针对特定标签 */}
							{post.tags?.some(tag => ['React', 'Next.js', 'JavaScript', 'TypeScript'].includes(tag)) && (
								<div className="mt-12">
									<FAQ />
								</div>
							)}

							{/* 相关文章推荐 */}
							<div className="mt-12"></div>
							<RelatedPosts
								slug={decodedSlug}
								tags={post.tags || []}
							/>
						</div>
					</main>
				</PageTransition>
			</div>
		</>
	);
}
