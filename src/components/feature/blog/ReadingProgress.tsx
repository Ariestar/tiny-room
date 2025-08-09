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
		<div className='fixed right-0 top-0 w-1 h-full bg-gray-200/30 rounded-full dark:bg-gray-700/30 z-[100]'>
			<div
				className='w-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out origin-top'
				style={{ height: `${progress}%` }}
			/>
		</div>
	);
}
