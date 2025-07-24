"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/data/content/markdown/remark-extract-toc";
import { useScrollspy } from "@/hooks/use-scrollspy";
import { cn } from "@/lib/shared/utils";

interface TocProps {
	toc: TocEntry[];
}

export function TableOfContents({ toc }: TocProps) {
	const [isMounted, setIsMounted] = useState(false);

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

	if (!toc.length || !isMounted) {
		return null;
	}

	// 找到最小的depth作为基准，确保没有负数padding
	const minDepth = Math.min(...toc.map(item => item.depth));

	return (
		<div className='space-y-2'>
			<p className='font-medium text-sm text-gray-700 dark:text-gray-300'>目录</p>
			<ul className='m-0 list-none space-y-1'>
				{toc.map(item => {
					const relativeDepth = item.depth - minDepth;
					return (
						<li key={item.url} className='mt-0'>
							<a
								href={item.url}
								className={cn(
									"inline-block no-underline transition-colors hover:text-foreground font-sans text-sm leading-relaxed py-1",
									item.url.substring(1) === activeId
										? "text-foreground font-semibold border-l-2 border-blue-500 pl-3"
										: "text-muted-foreground hover:text-foreground pl-1"
								)}
								style={{
									paddingLeft: `${relativeDepth * 0.75 +
										(item.url.substring(1) === activeId ? 0.75 : 0.25)
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
	);
}
