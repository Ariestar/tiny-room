"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollPercent = (scrollTop / docHeight) * 100;
			setProgress(Math.min(Math.max(scrollPercent, 0), 100));
		};

		const throttledUpdate = () => {
			requestAnimationFrame(updateProgress);
		};

		window.addEventListener("scroll", throttledUpdate, { passive: true });
		// 初始计算
		updateProgress();

		return () => window.removeEventListener("scroll", throttledUpdate);
	}, []);

	return (
		<div className='fixed top-0 left-0 w-full h-1 bg-gray-200/20 z-40 dark:bg-gray-700/20'>
			<div
				className='h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out'
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
