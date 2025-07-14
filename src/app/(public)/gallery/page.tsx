"use client";

import { listImages } from "@/lib/r2";
import { useEffect, useState } from "react";
import Image from "next/image";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FullscreenCarousel } from "@/components/feature/gallery/FullscreenCarousel";

// Define and export a type for the image data
export type R2Image = {
	key: string;
	url: string;
	uploadedAt: Date | undefined;
};

// Define a layout pattern
const bentoLayout = [
	"md:col-span-2 md:row-span-2", // 1st image
	"md:col-span-1", // 2nd image
	"md:col-span-1", // 3rd image
	"md:col-span-1", // 4th image
	"md:col-span-2", // 5th image
];

export default function GalleryPage() {
	const [images, setImages] = useState<R2Image[]>([]);
	const [loading, setLoading] = useState(true);

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

	useEffect(() => {
		async function fetchImages() {
			setLoading(true);
			const fetchedImages = await listImages();
			// Ensure all images have a key
			const validImages = fetchedImages.filter(
				(img): img is R2Image => typeof img.key === "string"
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

	if (loading) {
		return <p>Loading gallery...</p>;
	}

	if (!images || images.length === 0) {
		return <p>No images found.</p>;
	}

	return (
		<div className='p-4 md:p-8'>
			<BentoGrid className='mx-auto max-w-full'>
				{images.map((image, i) => (
					<BentoCard
						key={image.key}
						className={cn(
							"overflow-hidden cursor-pointer",
							bentoLayout[i % bentoLayout.length] // Cycle through the layout pattern
						)}
						onClick={() => handleImageClick(image.key)}
					>
						<motion.div
							className='relative w-full h-full min-h-[15rem]'
							layoutId={`card-${image.key}`}
						>
							<Image
								src={image.url}
								alt={image.key ?? "gallery image"}
								fill
								className='object-cover'
								sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
							/>
						</motion.div>
					</BentoCard>
				))}
			</BentoGrid>
			<FullscreenCarousel image={selectedImage ?? null} onClose={handleClose} />
		</div>
	);
}
