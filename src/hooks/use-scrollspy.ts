import { useState, useEffect, useRef } from "react";

export function useScrollspy(selectors: string[], options?: IntersectionObserverInit) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const elements = selectors
			.map(selector => {
				// 提取ID部分，支持#开头的选择器
				const id = selector.startsWith("#") ? selector.slice(1) : selector;
				const el = document.getElementById(id);
				if (!el) {
					console.warn(`Scrollspy: element with id '${id}' not found`);
				}
				return el;
			})
			.filter((el): el is Element => el !== null);

		if (observer.current) {
			observer.current.disconnect();
		}

		const visibleHeadings = new Map<string, IntersectionObserverEntry>();

		observer.current = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					visibleHeadings.set(entry.target.id, entry);
				} else {
					visibleHeadings.delete(entry.target.id);
				}
			});

			if (visibleHeadings.size > 0) {
				const sortedVisibleHeadings = Array.from(visibleHeadings.values()).sort(
					(a, b) => a.boundingClientRect.top - b.boundingClientRect.top
				);
				setActiveId(sortedVisibleHeadings[0].target.id);
			} else if (activeId !== null) {
				// If nothing is visible, maybe we scrolled past the last item.
				// Let's check scroll position to decide.
				const lastElement = elements[elements.length - 1];
				if (lastElement && window.scrollY > (lastElement as HTMLElement).offsetTop) {
					setActiveId(lastElement.id);
				}
			}
		}, options);

		elements.forEach(el => {
			if (el) {
				observer.current?.observe(el);
			}
		});

		return () => observer.current?.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(selectors), options]);

	return activeId;
}
