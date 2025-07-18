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
		<div className='fixed right-4 top-1/2 -translate-y-1/2 w-1 h-64 bg-gray-200/30 rounded-full z-40 dark:bg-gray-700/30'>
			<div
				className='w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150 ease-out'
				style={{ height: `${progress}%` }}
			/>
			<div className='absolute -right-8 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 font-mono'>
				{Math.round(progress)}%
			</div>
		</div>
	);
}
