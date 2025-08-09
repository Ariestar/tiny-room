"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { TocEntry } from "@/lib/data/content/markdown/remark-extract-toc";
import { useScrollspy } from "@/hooks/use-scrollspy";
import { cn } from "@/lib/shared/utils";

interface TocProps {
	toc: TocEntry[];
	position?: 'left' | 'right';
}

const itemVariants = {
	hidden: { opacity: 0, x: 20 },
	visible: (delay: number) => ({
		opacity: 1,
		x: 0,
		transition: {
			delay, // Apply calculated delay
			duration: 0.2,
			ease: "easeOut",
		},
	}),
};

export function TableOfContents({ toc, position = 'right' }: TocProps) {
	const [isMounted, setIsMounted] = useState(false);
	const tocContainerRef = useRef<HTMLDivElement>(null);
	const activeItemRef = useRef<HTMLAnchorElement>(null);
	const [isTocHovered, setIsTocHovered] = useState(false);

	// --- New Animation Delay Calculation ---
	const animationDelayMap = new Map<string, number>();
	const itemsByDepth: { [depth: number]: TocEntry[] } = {};

	// 1. Group items by depth
	toc.forEach(item => {
		if (!itemsByDepth[item.depth]) {
			itemsByDepth[item.depth] = [];
		}
		itemsByDepth[item.depth].push(item);
	});

	const sortedDepths = Object.keys(itemsByDepth).map(Number).sort((a, b) => a - b);
	const depthToLevelIndex = new Map(sortedDepths.map((depth, index) => [depth, index]));

	// 2. Define stagger timings
	const LEVEL_STAGGER = 0.1;  // Delay between each level
	const ITEM_STAGGER = 0.02; // Short delay between items of the same level

	// 3. Calculate and map delay for each item
	toc.forEach(item => {
		const levelIndex = depthToLevelIndex.get(item.depth) ?? 0;
		const itemsInSameLevel = itemsByDepth[item.depth] || [];
		const indexInLevel = itemsInSameLevel.indexOf(item);

		const delay = (levelIndex * LEVEL_STAGGER) + (indexInLevel * ITEM_STAGGER);
		animationDelayMap.set(item.url, delay);
	});
	// --- End of Animation Logic ---

	const ids = toc.map(item => item.url.substring(1));
	const activeId = useScrollspy(
		ids.map(id => `#${id}`),
		{
			rootMargin: "0% 0% -80% 0%",
		}
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// 当激活项改变时，滚动到居中位置
	useEffect(() => {
		if (activeItemRef.current && tocContainerRef.current) {
			const container = tocContainerRef.current;
			const activeItem = activeItemRef.current;

			const containerHeight = container.clientHeight;
			const itemOffsetTop = activeItem.offsetTop;
			const itemHeight = activeItem.clientHeight;

			// 计算居中位置
			const scrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);

			container.scrollTo({
				top: scrollTop,
				behavior: 'smooth'
			});
		}
	}, [activeId]);

	if (!toc.length || !isMounted) {
		return null;
	}

	// 找到最小的depth作为基准
	const minDepth = Math.min(...toc.map(item => item.depth));

	return (
		<div className='space-y-4 h-full'>
			<motion.div
				ref={tocContainerRef}
				className='relative h-full space-y-2 overflow-y-auto scrollbar-none scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'
				onMouseEnter={() => setIsTocHovered(true)}
				onMouseLeave={() => setIsTocHovered(false)}
				initial="hidden"
				animate="visible"
			>
				{toc.map(item => {
					const relativeDepth = item.depth - minDepth;
					const isActive = item.url.substring(1) === activeId;
					const animationDelay = animationDelayMap.get(item.url) ?? 0;
					return (
						<motion.a
							key={item.url}
							ref={isActive ? activeItemRef : null}
							href={item.url}
							className="group relative flex items-center no-underline h-6 mb-1"
							custom={animationDelay}
							variants={itemVariants}
						>
							{/* line */}
							<span
								className={cn(
									"absolute top-1/2 -translate-y-1/2 transition-all duration-75 ease-in-out",
									position === 'left' ? 'left-0' : 'right-0',
									isActive ? "bg-gray-900 h-1" : "bg-gray-300 dark:bg-gray-600 h-0.5"
								)}
								style={{
									width: isTocHovered ? '5px' : `${4 - relativeDepth * 1}em`,
								}}
							/>

							{/* title */}
							<span
								className={cn(
									"w-full transition-opacity duration-300 ease-in-out text-sm py-1",
									position === 'left' ? 'text-left' : 'text-right',
									isActive ? "text-foreground font-semibold" : "text-muted-foreground",
									isTocHovered ? 'block' : 'hidden'
								)}
								style={{
									[position === 'left' ? 'paddingLeft' : 'paddingRight']: `${0.5 + relativeDepth * 0.5}rem`,
								}}
							>
								{item.title}
							</span>
						</motion.a>
					);
				})}
			</motion.div>
		</div>
	);
}
