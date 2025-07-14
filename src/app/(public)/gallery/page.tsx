"use client";

import { listImages } from "@/lib/r2";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FullscreenCarousel } from "@/components/feature/gallery/FullscreenCarousel";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

// Define and export a type for the image data
export type R2Image = {
	key: string;
	url: string;
	uploadedAt: Date | undefined;
	width: number;
	height: number;
};

// Determines the span of a card based on image dimensions
const getCardSizeClass = (width: number, height: number): string => {
	// Landscape image
	if (width > height) return "md:col-span-2";
	// Portrait image
	if (height > width) return "md:row-span-2";
	// Square or near-square image
	return "md:col-span-1 md:row-span-1";
};

export default function GalleryPage() {
	const [images, setImages] = useState<R2Image[]>([]);
	const [loading, setLoading] = useState(true);
	const [preloadedBlobs, setPreloadedBlobs] = useState<Record<string, string>>({});

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const photoId = searchParams.get("photoId");

	const { isScrolled, scrollToTop } = useScrollAnimation(400);

	const selectedImage = images.find(img => img.key === photoId);

	const handleClose = () => {
		router.push(pathname as any, { scroll: false });
	};

	const handleImageClick = (key: string) => {
		const params = new URLSearchParams(searchParams);
		params.set("photoId", key);
		router.push(`${pathname}?${params.toString()}` as any, { scroll: false });
	};

	// Preload image and store it as a blob
	const preloadImage = useCallback(
		async (key: string, url: string) => {
			if (preloadedBlobs[key]) return; // Already preloaded

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
			// Ensure all images have a key
			const validImages = fetchedImages.filter(
				(img: R2Image | null): img is R2Image => img !== null && typeof img.key === "string"
			);
			setImages(validImages);
			setLoading(false);
		}
		fetchImages();
	}, []);

	// Add keyboard support for closing the modal
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") handleClose();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	// Lock body scroll when modal is open
	useEffect(() => {
		if (photoId) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
		// Cleanup on unmount
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [photoId]);

	if (loading) {
		return <p>Loading gallery...</p>;
	}

	if (!images || images.length === 0) {
		return <p>No images found.</p>;
	}

	return (
		<div className='p-4 md:p-8'>
			<h1 className='text-7xl font-bold tracking-tight mb-10 text-center font-display'>
				Gallery
				{!isScrolled && (
					<motion.span layoutId='gallery-emoji' className='inline-block ml-4'>
						🖼️
					</motion.span>
				)}
			</h1>
			<BentoGrid className='mx-auto max-w-full'>
				{images.map((image, i) => (
					<BentoCard
						key={image.key}
						className={cn(
							"overflow-hidden cursor-pointer",
							getCardSizeClass(image.width, image.height)
						)}
						onClick={() => handleImageClick(image.key)}
						onViewportEnter={() => preloadImage(image.key, image.url)}
					>
						<motion.div
							className='relative w-full h-full min-h-[15rem]'
							layoutId={`card-${image.key}`}
						>
							<Image
								src={image.url}
								alt={image.key ?? "gallery image"}
								fill
								className='object-contain'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
								priority={i === 0}
							/>
						</motion.div>
					</BentoCard>
				))}
			</BentoGrid>
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
			<AnimatePresence>
				{isScrolled && (
					<motion.div
						layoutId='gallery-emoji'
						className='fixed bottom-8 right-8 z-50 cursor-pointer'
						onClick={scrollToTop}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.5 }}
					>
						<span className='text-4xl'>🖼️</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
