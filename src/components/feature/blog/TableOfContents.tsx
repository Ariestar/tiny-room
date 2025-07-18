"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/remark-extract-toc";
import { useScrollspy } from "@/lib/use-scrollspy";
import { cn } from "@/lib/utils";
import Card from "@/components/ui/Card";

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

	return (
		<div className='space-y-2'>
			<p className='font-medium'>On this page</p>
			<ul className='m-0 list-none'>
				{toc.map(item => (
					<li key={item.url} className='mt-0 pt-1'>
						<a
							href={item.url}
							className={cn(
								"inline-block no-underline transition-colors hover:text-foreground font-sans",
								item.url.substring(1) === activeId
									? "text-foreground font-semibold"
									: "text-muted-foreground"
							)}
							style={{ paddingLeft: `${(item.depth - 2) * 1}rem` }}
						>
							{item.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}
