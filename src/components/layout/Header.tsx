"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Search } from "@/components/feature/search/Search";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface HeaderProps {
	/**
	 * The ID of the element to track for getting alternate title text
	 * @default "page-title"
	 */
	titleElementId?: string;
	/**
	 * Custom alternate title to show on scroll (overrides titleElementId)
	 */
	alternateTitle?: string;
	/**
	 * Minimum scroll distance from top before showing alternate title
	 * @default 100
	 */
	scrollThreshold?: number;
	/**
	 * Whether to enable the scroll-based title switching
	 * @default true
	 */
	enableScrollSwitch?: boolean;
}

export function Header({
	titleElementId = "page-title",
	alternateTitle,
	scrollThreshold = 100,
	enableScrollSwitch = true,
}: HeaderProps = {}) {
	const [showAlternateTitle, setShowAlternateTitle] = useState(false);
	const [dynamicTitle, setDynamicTitle] = useState("");
	const pathname = usePathname();

	useEffect(() => {
		// Reset state on path change
		setShowAlternateTitle(false);
		setDynamicTitle("");

		if (!enableScrollSwitch) {
			return;
		}

		// Add a small delay to ensure DOM is fully rendered
		const timeoutId = setTimeout(() => {
			// Use custom title if provided, otherwise try to get from element
			if (alternateTitle) {
				setDynamicTitle(alternateTitle);
			} else {
				const titleElement = document.getElementById(titleElementId);
				if (!titleElement) {
					return;
				}
				const title = titleElement.textContent || "";
				setDynamicTitle(title);
			}

			let lastScrollY = window.scrollY;
			let ticking = false;

			const handleScroll = () => {
				if (!ticking) {
					requestAnimationFrame(() => {
						const currentScrollY = window.scrollY;
						const isScrollingDown = currentScrollY > lastScrollY;
						const isScrollingUp = currentScrollY < lastScrollY;

						// Only change state if there's meaningful scroll movement (more than 5px)
						if (Math.abs(currentScrollY - lastScrollY) > 5) {
							if (isScrollingDown && currentScrollY > scrollThreshold) {
								// Show alternate title when scrolling down
								setShowAlternateTitle(true);
							} else if (isScrollingUp) {
								// Show default title when scrolling up
								setShowAlternateTitle(false);
							}
						}

						lastScrollY = currentScrollY;
						ticking = false;
					});
					ticking = true;
				}
			};

			window.addEventListener("scroll", handleScroll, { passive: true });

			// Return cleanup function
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}, 100);

		// Cleanup timeout if component unmounts or path changes before timeout completes
		return () => {
			clearTimeout(timeoutId);
		};
	}, [pathname, titleElementId, alternateTitle, scrollThreshold, enableScrollSwitch]);

	const displayTitle = showAlternateTitle && dynamicTitle ? dynamicTitle : "Tiny Room";

	return (
		<header className='sticky top-0 z-30 flex items-center bg-background justify-between border-b border-border p-4 transition-all duration-fast'>
			<div className='left-2 relative h-7 overflow-hidden flex-1 pr-4'>
				<div
					className={`transition-transform duration-300 ease-in-out ${
						showAlternateTitle && dynamicTitle ? "-translate-y-full" : "translate-y-0"
					}`}
				>
					<Link href='/' className='block font-bold text-lg text-foreground'>
						Tiny Room
					</Link>
				</div>
				<div
					className={`absolute top-full transition-transform duration-300 ease-in-out ${
						showAlternateTitle && dynamicTitle ? "-translate-y-full" : "translate-y-0"
					}`}
				>
					<span className='block truncate font-bold text-lg text-foreground'>
						{dynamicTitle}
					</span>
				</div>
			</div>
			<div className='flex items-center space-x-3 flex-shrink-0'>
				<Search />
				<ThemeSwitcher />
			</div>
		</header>
	);
}
