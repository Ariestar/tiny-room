"use client";

import { getSortedPostsData } from "@/lib/posts";
import Link from "next/link";
import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/BentoGrid";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

type Post = ReturnType<typeof getSortedPostsData>[number];

const PostCard = ({ post }: { post: Post }) => (
	<Link href={`/blog/${post.slug}`} className='flex flex-col h-full group'>
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
		<div className='flex-grow flex flex-col p-1'>
			<h2 className='text-xl font-semibold mb-2 flex-grow'>{post.title}</h2>
			<div className='flex flex-wrap gap-2 mb-3'>
				{post.tags.map(tag => (
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
);

const FeaturedPostCard = ({ post }: { post: Post }) => (
	<Link href={`/blog/${post.slug}`} className='flex flex-col h-full group'>
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
			className={`flex-grow flex flex-col ${
				post.coverImage ? "absolute bottom-0 p-6" : "p-2"
			}`}
		>
			<h2
				className={`text-4xl font-bold mb-4 group-hover:text-primary transition-colors ${
					post.coverImage ? "text-white" : ""
				}`}
			>
				{post.title}
			</h2>
			<div className='flex flex-wrap gap-2 mb-3'>
				{post.tags.map(tag => (
					<Badge key={tag} variant={post.coverImage ? "default" : "secondary"}>
						{tag}
					</Badge>
				))}
			</div>
			<div
				className={`flex items-center text-sm mt-auto ${
					post.coverImage ? "text-gray-300" : "text-muted-foreground"
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
);

export default function BlogPageClient({ posts }: { posts: Post[] }) {
	const featuredPost = posts[0];
	const otherPosts = posts.slice(1);

	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", latest => {
		setIsScrolled(latest > 150);
	});

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const gridVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const cardVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.4,
				ease: "easeOut",
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
								<BentoCard
									variants={cardVariants}
									className='md:col-span-2 row-span-2 relative'
								>
									<FeaturedPostCard post={featuredPost} />
								</BentoCard>
							)}
							{otherPosts.map(post => (
								<BentoCard
									variants={cardVariants}
									key={post.slug}
									className='row-span-1'
								>
									<PostCard post={post} />
								</BentoCard>
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
