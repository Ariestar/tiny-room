"use client";

import { getSortedPostsData } from "@/lib/data/content/posts";
import Link from "next/link";
import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/BentoGrid";
import Badge from "@/components/ui/Badge";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
	MagneticHover,
	BreathingAnimation,
	getMagneticStrength,
	getAnimationDelay
} from "@/components/animation";

type Post = ReturnType<typeof getSortedPostsData>[number];

const PostCard = ({ post, index = 0, disabled = false }: { post: Post; index?: number; disabled?: boolean }) => {
	const magneticStrength = getMagneticStrength("blog");
	const animationDelay = getAnimationDelay(index, 0.5); // 稍长的延迟间隔

	return (
		<div className="w-full h-full">
			<MagneticHover
				strength={magneticStrength}
				scaleOnHover={1.025} // 稍强的缩放效果
				showHalo={true}
				rotationIntensity={0.03} // 轻微的3D旋转
				disabled={disabled}
				className="block w-full h-full"
			>
				<BreathingAnimation
					contentType="article"
					delay={animationDelay}
					pauseOnHover={true}
					duration={7} // 7秒的呼吸周期
					scaleRange={[1, 1.01]} // 稍强的缩放范围，更容易看到效果
					disabled={disabled}
					className="w-full h-full bg-card border border-border/20 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
				>
					<Link href={`/blog/${post.slug}`} className='flex flex-col h-full group p-4'>
						{post.coverImage && (
							<div className='relative w-full h-40 mb-4 rounded-lg overflow-hidden'>
								<Image
									src={post.coverImage}
									alt={post.title}
									layout='fill'
									objectFit='cover'
									className='group-hover:scale-105 transition-transform duration-normal'
								/>
							</div>
						)}
						<div className='flex-grow flex flex-col'>
							<h2 className='text-xl font-semibold mb-2 flex-grow'>{post.title}</h2>
							<div className='flex flex-wrap gap-2 mb-3'>
								{post.tags.map((tag: string) => (
									<Badge key={tag} variant='secondary'>
										{tag}
									</Badge>
								))}
							</div>
							<div className='flex items-center text-xs text-muted-foreground mt-auto'>
								<span>
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
								<span className='mx-2'>·</span>
								<span>{post.readingTime}</span>
							</div>
						</div>
					</Link>
				</BreathingAnimation>
			</MagneticHover>
		</div>
	);
};

const FeaturedPostCard = ({ post, disabled = false }: { post: Post; disabled?: boolean }) => {
	const magneticStrength = getMagneticStrength("blog") * 1.3; // 精选文章更强的磁吸效果

	return (
		<div className="w-full h-full">
			<MagneticHover
				strength={magneticStrength}
				scaleOnHover={1.02} // 精选文章的缩放效果
				showHalo={true}
				rotationIntensity={0.04} // 稍强的3D旋转
				haloColor="rgb(var(--primary-rgb, 0, 112, 243))" // 使用主题色光晕
				disabled={disabled}
				className="block w-full h-full"
			>
				<BreathingAnimation
					contentType="article"
					delay={0.2} // 轻微延迟，让用户先注意到精选文章
					pauseOnHover={true}
					duration={9} // 更慢的呼吸节奏，显示重要性
					scaleRange={[1, 1.012]} // 稍强的缩放范围，更容易看到效果
					brightnessRange={[1, 1.03]} // 更明显的亮度变化
					disabled={disabled}
					className="w-full h-full bg-card border border-border/20 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
				>
					<Link href={`/blog/${post.slug}`} className='flex flex-col h-full group relative'>
						{post.coverImage && (
							<div className='relative w-full h-60 mb-4 rounded-xl overflow-hidden'>
								<Image
									src={post.coverImage}
									alt={post.title}
									layout='fill'
									objectFit='cover'
									className='group-hover:scale-105 transition-transform duration-fast'
								/>
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
							</div>
						)}
						<div
							className={`flex-grow flex flex-col ${post.coverImage ? "absolute bottom-0 p-6" : "p-6"
								}`}
						>
							<h2
								className={`text-4xl font-bold mb-4 group-hover:text-primary transition-colors ${post.coverImage ? "text-white" : ""
									}`}
							>
								{post.title}
							</h2>
							<div className='flex flex-wrap gap-2 mb-3'>
								{post.tags.map((tag: string) => (
									<Badge key={tag} variant={post.coverImage ? "default" : "secondary"}>
										{tag}
									</Badge>
								))}
							</div>
							<div
								className={`flex items-center text-sm mt-auto ${post.coverImage ? "text-gray-300" : "text-muted-foreground"
									}`}
							>
								<span>
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
								<span className='mx-2'>·</span>
								<span>{post.readingTime}</span>
							</div>
						</div>
					</Link>
				</BreathingAnimation>
			</MagneticHover>
		</div>
	);
};

export default function BlogPageClient({ posts }: { posts: Post[] }) {
	const featuredPost = posts[0];
	const otherPosts = posts.slice(1);

	const { isScrolled, scrollToTop } = useScrollAnimation();

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

	// 优化的网格动画变体，与视觉特效协调
	const gridVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.15, // 稍慢的交错动画，给呼吸动画让路
				delayChildren: 0.2, // 延迟子元素动画，避免与呼吸动画冲突
			},
		},
	};

	const cardVariants = {
		hidden: { y: 30, opacity: 0, scale: 0.95 },
		visible: {
			y: 0,
			opacity: 1,
			scale: 1,
			transition: {
				duration: 0.6, // 稍长的动画时间
				ease: [0.25, 0.46, 0.45, 0.94], // 自定义缓动函数
			},
		},
	};

	return (
		<>
			<section className='py-12 px-4'>
				<div className='max-w-7xl mx-auto'>
					<div className='h-20 flex justify-center items-center'>
						<h1 className='text-7xl font-bold tracking-tight mb-10 text-center font-display'>
							Blog
							{!isScrolled && (
								<motion.span layoutId='cat-emoji' className='inline-block'>
									🐈
								</motion.span>
							)}
						</h1>
					</div>

					{posts.length > 0 ? (
						<BentoGrid
							className='auto-rows-auto'
							variants={gridVariants}
							initial='hidden'
							animate='visible'
						>
							{featuredPost && (
								<motion.div
									variants={cardVariants}
									className='md:col-span-2 row-span-2 relative'
								>
									<FeaturedPostCard post={featuredPost} disabled={prefersReducedMotion} />
								</motion.div>
							)}
							{otherPosts.map((post, index) => (
								<motion.div
									variants={cardVariants}
									key={post.slug}
									className='row-span-1'
								>
									<PostCard post={post} index={index + 1} disabled={prefersReducedMotion} />
								</motion.div>
							))}
						</BentoGrid>
					) : (
						<p className='text-center text-muted-foreground'>
							No posts found. Start writing!
						</p>
					)}
				</div>
			</section>
			<AnimatePresence mode='popLayout'>
				{isScrolled && (
					<motion.div
						layoutId='cat-emoji'
						className='fixed top-6 left-6 z-50 cursor-pointer'
						onClick={scrollToTop}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
					>
						<span className='text-4xl'>🐈‍</span>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
