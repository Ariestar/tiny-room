"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { R2Image } from "@/app/(public)/gallery/page";
// import { useRouter, usePathname, useSearchParams } from "next/navigation"; // 暂时保留，后续可能用于导航功能
import { useEffect, useState, useRef } from "react";
import { ScrollIndicator } from "@/components/animation/ScrollIndicator";
import { ImageDetails } from "./ImageDetails";

type FullscreenCarouselProps = {
	image: R2Image | null;
	onClose: () => void;
	onNext?: () => void;
	onPrev?: () => void;
	hasNext?: boolean;
	hasPrev?: boolean;
};

export function FullscreenCarousel({ image, onClose, onNext, onPrev, hasNext = false, hasPrev = false }: FullscreenCarouselProps) {
	// const router = useRouter();
	// const pathname = usePathname();
	// const searchParams = useSearchParams();

	// 滚动状态管理
	const [scrollProgress, setScrollProgress] = useState(0);
	const [showScrollIndicator, setShowScrollIndicator] = useState(true);
	const [showImageDetails, setShowImageDetails] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// 手势状态管理
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);
	const [mouseStart, setMouseStart] = useState<number | null>(null);

	// 设备方向状态
	const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
	const [isAutoRotate, setIsAutoRotate] = useState(true);

	// 最小滑动距离
	const minSwipeDistance = 50;

	// 导航处理函数
	const handleNext = () => {
		if (onNext && hasNext) {
			onNext();
		}
	};

	const handlePrev = () => {
		if (onPrev && hasPrev) {
			onPrev();
		}
	};

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

	// 触摸手势处理
	const onTouchStart = (e: React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
		// 触摸时禁用鼠标拖拽
		setIsDragging(false);
		setDragOffset(0);
	};

	const onTouchMove = (e: React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const onTouchEnd = (e: React.TouchEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		// 修复手势方向：向左滑动显示下一张，向右滑动显示上一张
		const isLeftSwipe = distance > minSwipeDistance;  // 手指向左移动
		const isRightSwipe = distance < -minSwipeDistance; // 手指向右移动

		if (isLeftSwipe && hasNext) {
			handleNext(); // 向左滑动 → 下一张
		}
		if (isRightSwipe && hasPrev) {
			handlePrev(); // 向右滑动 → 上一张
		}

		// 重置触摸状态
		setTouchStart(null);
		setTouchEnd(null);
	};

	// 鼠标拖拽处理
	const onMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
		setDragOffset(0); // 重置偏移量
		setMouseStart(e.clientX);
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		e.preventDefault();
		e.stopPropagation();
		// 计算相对于拖拽开始位置的偏移量
		const currentOffset = e.clientX - (mouseStart || 0);
		setDragOffset(currentOffset);
	};

	const onMouseUp = (e: React.MouseEvent) => {
		if (!isDragging) return;
		e.preventDefault();
		e.stopPropagation();

		const distance = dragOffset;
		// 修复拖拽方向：向左拖拽显示下一张，向右拖拽显示上一张
		const isLeftSwipe = distance < -minSwipeDistance;  // 鼠标向左移动
		const isRightSwipe = distance > -minSwipeDistance; // 鼠标向右移动

		if (isLeftSwipe && hasNext) {
			handleNext(); // 向左拖拽 → 下一张
		}
		if (isRightSwipe && hasPrev) {
			handlePrev(); // 向右拖拽 → 上一张
		}

		setIsDragging(false);
		setDragOffset(0);
	};

	useEffect(() => {
		if (!image) return;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" && hasNext) handleNext();
			if (e.key === "ArrowLeft" && hasPrev) handlePrev();
			if (e.key === "Escape") onClose();
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [image, hasNext, hasPrev]);

	// 重置滚动状态
	useEffect(() => {
		if (image) {
			setScrollProgress(0);
			setShowScrollIndicator(true);
			setShowImageDetails(false);
			if (containerRef.current) {
				containerRef.current.scrollTop = 0;
			}
			// 隐藏body滚动条
			document.body.classList.add("overflow-hidden");
		} else {
			// 恢复body滚动条
			document.body.classList.remove("overflow-hidden");
		}

		// 清理函数：组件卸载时恢复body滚动条
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [image]);

	// 设备方向检测和自动旋转
	useEffect(() => {
		if (!image || !isAutoRotate) return;

		const updateOrientation = () => {
			const isPortrait = window.innerHeight > window.innerWidth;
			setOrientation(isPortrait ? 'portrait' : 'landscape');
		};

		// 初始检测
		updateOrientation();

		// 监听窗口大小变化
		window.addEventListener('resize', updateOrientation);

		// 监听设备方向变化（移动设备）
		if ('onorientationchange' in window) {
			window.addEventListener('orientationchange', updateOrientation);
		}

		return () => {
			window.removeEventListener('resize', updateOrientation);
			if ('onorientationchange' in window) {
				window.removeEventListener('orientationchange', updateOrientation);
			}
		};
	}, [image, isAutoRotate]);

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
						className="w-full h-full overflow-y-auto overflow-x-hidden scrollbar-none"
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
								x: isDragging ? Math.max(-100, Math.min(100, dragOffset * 0.3)) : 0, // 限制拖拽范围，添加阻尼效果
							}}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{
								type: "spring",
								damping: 25,
								stiffness: 300,
								x: { type: "spring", damping: 20, stiffness: 200 } // 拖拽时的特殊动画
							}}
							onTouchStart={onTouchStart}
							onTouchMove={onTouchMove}
							onTouchEnd={onTouchEnd}
							onMouseDown={onMouseDown}
							onMouseMove={onMouseMove}
							onMouseUp={onMouseUp}
							style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
						>
							{/* 图片容器 - 占满全屏 */}
							<div
								className="relative bg-transparent"
								style={{
									width: isAutoRotate && orientation === 'portrait' ? '100vh' : '100%',
									height: isAutoRotate && orientation === 'portrait' ? '100vw' : '100%',
									transform: isAutoRotate && orientation === 'portrait' ? 'rotate(90deg)' : 'rotate(0deg)',
									transformOrigin: 'center center',
									position: 'absolute',
									top: isAutoRotate && orientation === 'portrait' ? 'calc((100vh - 100vw) / 2)' : '0',
									left: isAutoRotate && orientation === 'portrait' ? 'calc((100vw - 100vh) / 2)' : '0'
								}}
							>
								<Image
									src={image.url}
									alt={image.key ?? "fullscreen gallery image"}
									fill
									className="bg-transparent transition-transform duration-300 object-contain"
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

					{/* 左右导航按钮 */}
					{hasPrev && (
						<motion.button
							className='absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 bg-black/20 backdrop-blur-sm rounded-full p-3 transition-colors'
							onClick={(e) => {
								e.stopPropagation();
								handlePrev();
							}}
							whileHover={{ scale: 1.1, x: -5 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<ChevronLeft size={28} />
						</motion.button>
					)}

					{hasNext && (
						<motion.button
							className='absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 bg-black/20 backdrop-blur-sm rounded-full p-3 transition-colors'
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							whileHover={{ scale: 1.1, x: 5 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
						>
							<ChevronRight size={28} />
						</motion.button>
					)}


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
