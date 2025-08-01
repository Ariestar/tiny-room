"use client";
import { PageTitle } from "@/components/ui/PageTitle";

import { listImages } from "@/lib/data/api/r2";
import { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";

import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FullscreenCarousel } from "@/components/feature/gallery/FullscreenCarousel";
import Loading from "@/components/ui/Loading";
import {
	MagneticHover,
	BreathingAnimation,
	getAnimationDelay,
	getMagneticStrength
} from "@/components/animation";

// Define and export a type for the image data
export type R2Image = {
	key: string;
	url: string;
	uploadedAt: Date | undefined;
	width: number;
	height: number;
};

function GalleryClient() {
	const [images, setImages] = useState<R2Image[]>([]);
	const [loading, setLoading] = useState(true);
	const [preloadedBlobs, setPreloadedBlobs] = useState<Record<string, string>>({});

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const photoId = searchParams.get("photoId");

	const selectedImage = images.find(img => img.key === photoId);

	const handleClose = () => {
		router.push(pathname as any, { scroll: false });
	};

	const handleImageClick = (key: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("photoId", key);
		router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
	};

	const preloadImage = useCallback(
		async (key: string, url: string) => {
			if (preloadedBlobs[key]) return;

			try {
				const response = await fetch(url);
				const blob = await response.blob();
				const blobUrl = URL.createObjectURL(blob);
				setPreloadedBlobs(prev => ({ ...prev, [key]: blobUrl }));
			} catch (error) {
				console.error("Failed to preload image:", error);
			}
		},
		[preloadedBlobs]
	);

	useEffect(() => {
		async function fetchImages() {
			setLoading(true);
			const fetchedImages = await listImages();
			const validImages = fetchedImages.filter(
				(img: R2Image | null): img is R2Image => img !== null && typeof img.key === "string"
			);
			setImages(validImages);
			setLoading(false);
		}
		fetchImages();
	}, []);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	useEffect(() => {
		if (photoId) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [photoId]);

	const breakpointColumnsObj = {
		default: 3, // More columns on larger screens for density
		3500: 3,
		1500: 2,
		500: 1,
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center h-[80vh]'>
				<Loading size='xl' />
			</div>
		);
	}

	if (!images || images.length === 0) {
		return <p>No images found.</p>;
	}

	return (
		<div className="p-4 md:p-8">
			<PageTitle title="Gallery" emoji="🖼️" className="text-center" />
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className={`masonry-grid flex w-auto ${photoId ? 'pointer-events-none' : ''}`} // 只对瀑布流禁用交互
				columnClassName='masonry-grid_column pl-2 bg-clip-padding' // Reduced gap, 移除 relative
			>
				{images.map((image, i) => {
					// 确定图片类型（风景或人像）
					const isLandscape = image.width > image.height;
					const contentType = isLandscape ? "landscape" : "portrait";

					// 计算视差层级和动画延迟
					const animationDelay = getAnimationDelay(i, 0.3);
					const magneticStrength = getMagneticStrength("gallery");

					return (
						<div key={image.key} className='mb-2 gallery-image-item'> {/* 添加特殊的 CSS 类 */}
							<MagneticHover
								strength={magneticStrength}
								scaleOnHover={1.1}
								showHalo={false}
								disabled={!!photoId} // 全屏模式时禁用磁悬浮效果
								className="block" // 确保是块级元素
							>
								<BreathingAnimation
									contentType={contentType}
									delay={animationDelay}
									scaleRange={[0.99, 1.01]}
									pauseOnHover={false}
								>
									<motion.div
										onClick={() => handleImageClick(image.key)}
										onViewportEnter={() => preloadImage(image.key, image.url)}
										className="block" // 确保是块级元素
									>
										<div className='p-1 rounded-lg bg-card border border-border/20 shadow-sm cursor-pointer group/card'>
											<motion.div
												className='relative w-full h-auto overflow-hidden rounded-md'
											>
												<Image
													src={image.url}
													alt={image.key ?? "gallery image"}
													width={image.width}
													height={image.height}
													className='rounded-md transition-transform duration-300 ease-in-out group-hover/card:scale-105'
													sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
													priority={i < 5} // Prioritize loading for the first few images
												/>
											</motion.div>
										</div>
									</motion.div>
								</BreathingAnimation>
							</MagneticHover>
						</div>
					);
				})}
			</Masonry>
			<FullscreenCarousel
				image={
					selectedImage
						? {
							...selectedImage,
							url: preloadedBlobs[selectedImage.key] || selectedImage.url,
						}
						: null
				}
				onClose={handleClose}
			/>
		</div>
	);
}

export default function GalleryPage() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center h-[80vh]'>
					<Loading size='xl' />
				</div>
			}
		>
			<GalleryClient />
		</Suspense>
	);
}
