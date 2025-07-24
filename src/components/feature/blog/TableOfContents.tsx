"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { TocEntry } from "@/lib/data/content/markdown/remark-extract-toc";
import { useScrollspy } from "@/hooks/use-scrollspy";
import { cn } from "@/lib/shared/utils";

interface TocProps {
	toc: TocEntry[];
}

export function TableOfContents({ toc }: TocProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const tocContainerRef = useRef<HTMLDivElement>(null);
	const activeItemRef = useRef<HTMLAnchorElement>(null);

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

	// 找到最小的depth作为基准，确保没有负数padding
	const minDepth = Math.min(...toc.map(item => item.depth));

	return (
		<div className='space-y-2'>
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className='group flex items-center justify-between w-full font-medium text-sm transition-all duration-300 ease-in-out hover:scale-105'
			>
				<span
					className={cn(
						'transition-opacity duration-300 ease-in-out text-gray-700 dark:text-gray-300',
						isCollapsed
							? 'opacity-0 group-hover:opacity-100'
							: 'opacity-100'
					)}
				>
					目录
				</span>
			</button>
			<div
				ref={tocContainerRef}
				className={cn(
					'max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent transition-all duration-300 ease-in-out',
					isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'
				)}
			>
				<ul className='m-0 list-none space-y-1'>
					{toc.map(item => {
						const relativeDepth = item.depth - minDepth;
						const isActive = item.url.substring(1) === activeId;
						return (
							<li key={item.url} className='mt-0'>
								<a
									ref={isActive ? activeItemRef : null}
									href={item.url}
									className={cn(
										"inline-block no-underline transition-colors hover:text-foreground font-sans text-sm leading-relaxed py-1",
										isActive
											? "text-foreground font-semibold border-l-2 border-blue-500 pl-3"
											: "text-muted-foreground hover:text-foreground pl-1"
									)}
									style={{
										paddingLeft: `${relativeDepth * 0.75 +
											(isActive ? 0.75 : 0.25)
											}rem`,
									}}
								>
									{item.title}
								</a>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
