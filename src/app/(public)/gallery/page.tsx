"use client";

import { listImages } from "@/lib/r2";
import { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FullscreenCarousel } from "@/components/feature/gallery/FullscreenCarousel";
import { useScrollAnimation } from "@/lib/useScrollAnimation";
import Loading from "@/components/ui/Loading";

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
		1500: 4,
		1100: 3,
		700: 2,
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
		<div className='p-4 md:p-8'>
			<h1 className='text-7xl font-bold tracking-tight mb-10 text-center font-display'>
				Gallery
				{!isScrolled && (
					<motion.span layoutId='gallery-emoji' className='inline-block ml-4'>
						🖼️
					</motion.span>
				)}
			</h1>
			<Masonry
				breakpointCols={breakpointColumnsObj}
				className='flex w-auto -ml-2' // Reduced gap
				columnClassName='pl-2 bg-clip-padding' // Reduced gap
			>
				{images.map((image, i) => (
					<motion.div
						key={image.key}
						className='mb-2' // Reduced gap
						onClick={() => handleImageClick(image.key)}
						onViewportEnter={() => preloadImage(image.key, image.url)}
					>
						<div className='p-1 rounded-lg bg-card border border-border/20 shadow-sm overflow-hidden cursor-pointer group/card'>
							<motion.div
								className='relative w-full h-auto'
								layoutId={`card-${image.key}`}
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
				))}
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
