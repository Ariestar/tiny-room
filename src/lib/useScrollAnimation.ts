"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

export function useScrollAnimation(threshold = 150) {
	const [isScrolled, setIsScrolled] = useState(false);
	const { scrollY } = useScroll();

	useMotionValueEvent(scrollY, "change", latest => {
		setIsScrolled(latest > threshold);
	});

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return { isScrolled, scrollToTop };
}
