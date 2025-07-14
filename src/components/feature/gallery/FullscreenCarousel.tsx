"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import type { R2Image } from "@/app/(public)/gallery/page";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type FullscreenCarouselProps = {
	image: R2Image | null;
	onClose: () => void;
};

export function FullscreenCarousel({ image, onClose }: FullscreenCarouselProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Placeholder for next/prev logic
	const handleNext = () => console.log("Next image");
	const handlePrev = () => console.log("Previous image");

	useEffect(() => {
		if (!image) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") handleNext();
			if (e.key === "ArrowLeft") handlePrev();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [image]);

	return (
		<AnimatePresence>
			{image && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm'
					onClick={onClose}
				>
					<motion.div
						className='relative w-[90vw] h-[90vh]'
						onClick={e => e.stopPropagation()} // Prevent closing when clicking on the image itself
						layoutId={`card-${image.key}`}
					>
						<Image
							src={image.url}
							alt={image.key ?? "fullscreen gallery image"}
							fill
							className='object-contain'
							sizes='100vw'
						/>
					</motion.div>
					<motion.button
						className='absolute top-4 right-4 text-white hover:text-gray-300'
						onClick={onClose}
					>
						<X size={32} />
					</motion.button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
