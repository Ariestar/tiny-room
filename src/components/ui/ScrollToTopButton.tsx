"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type ScrollToTopButtonProps = {
	emoji: string;
	className?: string;
};

export default function ScrollToTopButton({ emoji, className }: ScrollToTopButtonProps) {
	const [isVisible, setIsVisible] = useState(false);

	const toggleVisibility = () => {
		if (window.scrollY > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, []);

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.button
					onClick={scrollToTop}
					className={`fixed w-12 h-12 flex items-center justify-center p-3 bg-card border border-border/20 rounded-full shadow-lg hover:bg-muted transition-colors z-50 ${className}`}
					aria-label='Scroll to top'
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.2 }}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
				>
					<span className='text-2xl'>{emoji}</span>
				</motion.button>
			)}
		</AnimatePresence>
	);
}
