"use client";

import { getSortedPostsData } from "@/lib/data/content/posts";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

import { TimelineLayout } from "@/components/feature/blog/timeline";

type Post = ReturnType<typeof getSortedPostsData>[number];

export default function BlogPageClient({ posts }: { posts: Post[] }) {
	const { isScrolled, scrollToTop } = useScrollAnimation();

	// 移除复杂的时间线数据处理，直接使用原始文章数据

	// 检测用户的动画偏好
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
			setPrefersReducedMotion(mediaQuery.matches);

			const handleChange = (e: MediaQueryListEvent) => {
				setPrefersReducedMotion(e.matches);
			};

			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, []);

	return (
		<>
			{/* 页面标题 */}
			<section className="py-12 px-8 md:px-20 lg:px-40 xl:px-60 2xl:px-80">
				<div className="max-w-4xl mx-auto text-center">
					<motion.h1
						className="text-6xl md:text-7xl font-bold tracking-tight mb-4 font-display"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						Blog Timeline
						{!isScrolled && (
							<motion.span layoutId='cat-emoji' className='inline-block ml-4'>
								🐈
							</motion.span>
						)}
					</motion.h1>
					<motion.p
						className="text-xl text-muted-foreground mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						探索我的思考轨迹，沿着时间线发现每一个想法的诞生
					</motion.p>
				</div>
			</section>

			{/* 时间线主内容 */}
			<section className="min-h-screen">
				{posts.length > 0 ? (
					<TimelineLayout
						posts={posts}
						disabled={prefersReducedMotion}
					/>
				) : (
					<div className="flex items-center justify-center min-h-[400px]">
						<p className="text-center text-muted-foreground text-lg">
							暂无文章，开始写作吧！
						</p>
					</div>
				)}
			</section>

			{/* 回到顶部按钮 */}
			<AnimatePresence mode='popLayout'>
				{isScrolled && (
					<motion.div
						layoutId='cat-emoji'
						className='fixed top-6 right-6 z-50 cursor-pointer bg-background/80 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow'
						onClick={scrollToTop}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<span className='text-2xl'>🐈</span>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
