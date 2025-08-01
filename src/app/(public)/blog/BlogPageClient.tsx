"use client";

import { getSortedPostsData } from "@/lib/data/content/posts";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { TimelineLayout } from "@/components/feature/blog/timeline";
import { PageTitle } from "@/components/ui/PageTitle";

type Post = ReturnType<typeof getSortedPostsData>[number];

export default function BlogPageClient({ posts }: { posts: Post[] }) {
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
		<div className="container-prose">
			{/* 页面标题 */}
			<PageTitle title="Blog" emoji="💬" className="text-center" />

			<motion.p
				className="text-xl text-muted-foreground mb-8 text-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				探索我的思考轨迹，沿着时间线发现每一个想法的诞生
			</motion.p>

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
		</div>
	);
}

