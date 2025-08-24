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

export function TableOfContents({ toc, position = 'right' }: TocProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [mouseY, setMouseY] = useState<number | null>(null);
	const [nearestIndex, setNearestIndex] = useState<number | null>(null);
	const tocContainerRef = useRef<HTMLDivElement>(null);
	const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

	const ids = toc.map(item => item.url.substring(1));
	const activeId = useScrollspy(
		ids.map(id => `#${id}`),
		{ rootMargin: "0% 0% -80% 0%" }
	);

	useEffect(() => { setIsMounted(true); }, []);

	useEffect(() => {
		const container = tocContainerRef.current;
		if (!container) return;
		const activeIndex = toc.findIndex(i => i.url.substring(1) === activeId);
		const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
		if (!activeEl) return;

		const containerHeight = container.clientHeight;
		const itemOffsetTop = activeEl.offsetTop;
		const itemHeight = activeEl.clientHeight;

		// 计算滚动位置，确保活跃项目在容器中央
		const scrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);

		// 使用平滑滚动，并确保不会滚动到负值
		container.scrollTo({
			top: Math.max(0, scrollTop),
			behavior: 'smooth'
		});
	}, [activeId, toc]);

	if (!toc.length || !isMounted) return null;

	const minDepth = Math.min(...toc.map(item => item.depth));

	return (
		<div className='space-y-4 h-full'>
			<motion.div
				ref={tocContainerRef}
				className='relative h-full space-y-2 overflow-y-auto scrollbar-none flex flex-col'
				onHoverStart={() => setIsHovered(true)}
				onHoverEnd={() => { setIsHovered(false); setMouseY(null); setNearestIndex(null); }}
				onMouseMove={(e) => {
					setMouseY(e.clientY);
					let minD = Number.POSITIVE_INFINITY;
					let minIdx: number | null = null;
					itemRefs.current.forEach((el, idx) => {
						if (!el) return;
						const rect = el.getBoundingClientRect();
						const centerY = rect.top + rect.height / 2;
						const d = Math.abs(centerY - e.clientY);
						if (d < minD) { minD = d; minIdx = idx; }
					});
					setNearestIndex(minIdx);
				}}
			>
				{toc.map((item, index) => {
					const relativeDepth = item.depth - minDepth;
					const isActive = item.url.substring(1) === activeId;
					const baseWidthEm = 2 - relativeDepth * 0.5; // 初始线条长度（em）
					const indentRem = 1.5 + relativeDepth * 0.5; // 文本缩进

					// 基于鼠标位置的距离放大：按与鼠标 Y 的距离非线性（近快远慢）衰减
					let distanceScale = 1;
					if (mouseY !== null) {
						const el = itemRefs.current[index];
						if (el) {
							distanceScale = el && mouseY !== null
								? 1 + 0.12 * Math.pow(Math.max(0, 1 - Math.abs((el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2) - mouseY) / 50), 0.3)
								: 1;
						}
					}
					return (
						<motion.a
							key={item.url}
							ref={(el) => { itemRefs.current[index] = el; }}
							href={item.url}
							className="group relative flex items-center no-underline h-6 mb-1"
							initial={{ opacity: 0, x: 12 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.015, duration: 0.22, ease: "easeOut" }}
						>
							{/* level line */}
							<motion.span
								className={cn(
									"absolute top-1/2 -translate-y-1/2 transition-all duration-fast ease-in-out",
									position === 'left' ? 'left-0' : 'right-0',
									isActive ? "bg-gray-900 dark:bg-gray-200 h-1" : "bg-gray-300 dark:bg-gray-600 h-0.5",
								)}
								style={{ width: isHovered ? `${indentRem - 1}em` : `${baseWidthEm}em`, height: `${baseWidthEm}` }}
							/>

							{/* title */}
							<motion.span
								className={cn(
									"w-full text-sm py-1",
									position === 'left' ? 'text-left' : 'text-right',
									index === nearestIndex ? "text-black dark:text-white font-semibold" : (isActive ? "text-foreground font-semibold" : "text-muted-foreground")
								)}
								style={{
									[position === 'left' ? 'paddingLeft' : 'paddingRight']: `${indentRem}rem`,
									// transformOrigin: position === 'left' ? 'center center' : 'center center',
								}}
								initial={{ opacity: 0, x: position === 'left' ? -4 : 4 }}
								animate={{
									opacity: isHovered ? 1 : 0,
									x: isHovered ? 0 : (position === 'left' ? -4 : 4),
									scale: isHovered ? distanceScale : 1,
								}}
								transition={{ duration: 0.1, ease: "easeOut" }}
							>
								{item.title}
							</motion.span>
						</motion.a>
					);
				})}
			</motion.div>
		</div>
	);
}
