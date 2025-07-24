"use client";

import { cn } from "@/lib/shared/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

export const BentoGrid = ({
	className,
	children,
	...props
}: React.ComponentProps<typeof motion.div>) => {
	return (
		<motion.div
			className={cn(
				"grid md:auto-rows-[minmax(18rem,auto)] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto grid-flow-row-dense",
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
};

const bentoCardVariants = cva(
	"rounded-xl group/bento bg-card border border-border/20 p-4 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-fast ease-in-out",
	{
		variants: {
			size: {
				default: "md:col-span-1 md:row-span-1",
				landscape: "md:col-span-2 md:row-span-1",
				portrait: "md:col-span-1 md:row-span-2",
				large: "md:col-span-2 md:row-span-2",
			},
		},
		defaultVariants: {
			size: "default",
		},
	}
);

export interface BentoCardProps
	extends React.ComponentProps<typeof motion.div>,
	VariantProps<typeof bentoCardVariants> { }

export const BentoCard = ({ className, size, children, ...props }: BentoCardProps) => {
	return (
		<motion.div className={cn(bentoCardVariants({ size, className }))} {...props}>
			{children}
		</motion.div>
	);
};
