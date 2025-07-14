"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	return (
		<motion.div
			className={cn(
				"grid md:auto-rows-[minmax(18rem,auto)] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
};

export const BentoCard = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	return (
		<motion.div
			className={cn(
				"row-span-1 rounded-xl group/bento",
				"bg-card border border-border/20",
				"p-4 flex flex-col justify-between",
				"shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-fast ease-in-out",
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
};
