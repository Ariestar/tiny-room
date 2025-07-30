"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { R2Image } from "@/app/(public)/gallery/page";
// import { useRouter, usePathname, useSearchParams } from "next/navigation"; // 暂时保留，后续可能用于导航功能
import { useEffect, useState, useRef } from "react";
import { ScrollIndicator } from "@/components/animation/ScrollIndicator";
import { ImageDetails } from "./ImageDetails";

type FullscreenCarouselProps = {
	image: R2Image | null;
	onClose: () => void;
};

export function FullscreenCarousel({ image, onClose }: FullscreenCarouselProps) {
	// const router = useRouter();
	// const pathname = usePathname();
	// const searchParams = useSearchParams();

	// 滚动状态管理
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showScrollIndicator, setShowScrollIndicator] = useState(true);
	const [showImageDetails, setShowImageDetails] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// Placeholder for next/prev logic
	const handleNext = () => console.log("Next image");
	const handlePrev = () => console.log("Previous image");

	// 滚动处理函数
	const handleScroll = () => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const scrollTop = container.scrollTop;
		const scrollHeight = container.scrollHeight - container.clientHeight;
		const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

		setScrollProgress(progress);

		// 滚动超过 20% 时隐藏指示器，显示详情
		if (progress > 0.2) {
			setShowScrollIndicator(false);
			setShowImageDetails(true);
		} else {
			setShowScrollIndicator(true);
			setShowImageDetails(false);
		}
	};

	// 滚动到详情区域
	const scrollToDetails = () => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const targetScroll = container.clientHeight * 0.8; // 滚动到 80% 位置

		container.scrollTo({
			top: targetScroll,
			behavior: 'smooth'
		});
	};

	useEffect(() => {
		if (!image) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [image]);

	// 重置滚动状态
	useEffect(() => {
		if (image) {
			setScrollProgress(0);
			setShowScrollIndicator(true);
			setShowImageDetails(false);
			if (containerRef.current) {
				containerRef.current.scrollTop = 0;
			}
		}
	}, [image]);

	return (
		<AnimatePresence>
			{image && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-[9999] bg-black pointer-events-auto'
					onClick={onClose}
				>
					{/* 滚动容器 */}
					<div
						ref={containerRef}
						className="w-full h-full overflow-y-auto overflow-x-hidden"
						onScroll={handleScroll}
						onClick={(e) => e.stopPropagation()}
					>
						{/* 图片区域 */}
						<motion.div
							className="relative w-full h-screen flex items-center justify-center"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{
								scale: 1,
								opacity: 1,
								y: scrollProgress * -50, // 轻微的视差效果
							}}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
						>
							<div className="relative w-[90vw] h-[90vh] bg-transparent">
								<Image
									src={image.url}
									alt={image.key ?? "fullscreen gallery image"}
									fill
									className='object-contain bg-transparent'
									sizes='100vw'
									priority
								/>
							</div>
						</motion.div>

						{/* 详情区域 */}
						<motion.div
							className="min-h-screen p-8 flex items-center justify-center"
							initial={{ opacity: 0, y: 100 }}
							animate={{
								opacity: showImageDetails ? 1 : 0.3,
								y: showImageDetails ? 0 : 50,
							}}
							transition={{ duration: 0.6, ease: "easeOut" }}
						>
							<ImageDetails
								image={image}
								visible={true}
								className="max-w-4xl"
							/>
						</motion.div>
					</div>

					{/* 关闭按钮 */}
					<motion.button
						className='absolute top-4 right-4 z-10 text-white hover:text-gray-300 bg-black/20 backdrop-blur-sm rounded-full p-2 transition-colors'
						onClick={onClose}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<X size={24} />
					</motion.button>

					{/* 滚动指示器 */}
					<ScrollIndicator
						visible={showScrollIndicator}
						text="向下滚动查看详情"
						position="bottom-center"
						onClick={scrollToDetails}
						autoHideDelay={4000}
					/>

					{/* 滚动进度条 */}
					<motion.div
						className="fixed left-0 top-0 w-1 bg-primary z-10"
						style={{
							height: `${scrollProgress * 100}%`,
							background: `linear-gradient(to bottom, 
								rgb(var(--primary-rgb, 0, 112, 243)), 
								rgb(var(--secondary-rgb, 124, 58, 237))
							)`,
						}}
						initial={{ scaleY: 0 }}
						animate={{ scaleY: 1 }}
						transition={{ duration: 0.3 }}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
