"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { optimizedAnimationVariants, easingConfig } from "@/lib/ui/animations";

// 列表动画预设类型
export type ListAnimationType = "stagger" | "cascade" | "wave" | "scale" | "rotate";

// 组件Props接口
export interface AnimatedListProps
	extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate"> {
	/** 动画类型 */
	animationType?: ListAnimationType;
	/** 自定义容器变体 */
	containerVariants?: Variants;
	/** 自定义项目变体 */
	itemVariants?: Variants;
	/** 交错延迟时间（秒） */
	staggerDelay?: number;
	/** 起始延迟时间（秒） */
	delayChildren?: number;
	/** 是否禁用动画 */
	disableAnimation?: boolean;
	/** 子元素数组 */
	children: React.ReactNode[];
	/** 额外的CSS类名 */
	className?: string;
}

// 创建不同类型的列表动画变体
const createListVariants = (
	animationType: ListAnimationType,
	staggerDelay: number,
	delayChildren: number
): { container: Variants; item: Variants } => {
	const baseContainer: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerDelay,
				delayChildren,
			},
		},
	};

	switch (animationType) {
		case "cascade":
			return {
				container: baseContainer,
				item: {
					hidden: { opacity: 0, x: -50 },
					visible: {
						opacity: 1,
						x: 0,
						transition: { duration: 0.6, ease: easingConfig.easeOut },
					},
				},
			};

		case "wave":
			return {
				container: baseContainer,
				item: {
					hidden: { opacity: 0, y: 20, scale: 0.8 },
					visible: {
						opacity: 1,
						y: 0,
						scale: 1,
						transition: {
							duration: 0.6,
							ease: easingConfig.easeOut,
							scale: { duration: 0.8 },
						},
					},
				},
			};

		case "scale":
			return {
				container: baseContainer,
				item: {
					hidden: { opacity: 0, scale: 0 },
					visible: {
						opacity: 1,
						scale: 1,
						transition: {
							type: "spring",
							stiffness: 400,
							damping: 20,
							mass: 0.6,
						},
					},
				},
			};

		case "rotate":
			return {
				container: baseContainer,
				item: {
					hidden: { opacity: 0, rotate: -45, scale: 0.5 },
					visible: {
						opacity: 1,
						rotate: 0,
						scale: 1,
						transition: {
							duration: 0.8,
							ease: easingConfig.easeOut,
							rotate: { duration: 0.6 },
						},
					},
				},
			};

		default: // 'stagger'
			return {
				container: baseContainer,
				item: optimizedAnimationVariants.slideUp,
			};
	}
};

/**
 * AnimatedList - 列表动画组件
 *
 * 使用方式：
 * <AnimatedList animationType="stagger">
 *   {items.map((item, index) => (
 *     <div key={index}>{item}</div>
 *   ))}
 * </AnimatedList>
 */
export const AnimatedList = React.forwardRef<HTMLDivElement, AnimatedListProps>(
	(
		{
			animationType = "stagger",
			containerVariants: customContainerVariants,
			itemVariants: customItemVariants,
			staggerDelay = 0.1,
			delayChildren = 0.1,
			disableAnimation = false,
			children,
			className,
			...props
		},
		ref
	) => {
		const listVariants: Variants = React.useMemo(() => {
			if (disableAnimation) return {};

			const variantsMap = {
				stagger: {
					visible: {
						transition: {
							staggerChildren: staggerDelay,
						},
					},
				},
				cascade: {
					visible: {
						transition: {
							staggerChildren: staggerDelay,
							delayChildren: delayChildren,
						},
					},
				},
				wave: {
					visible: {
						transition: {
							staggerChildren: staggerDelay,
							when: "beforeChildren",
						},
					},
				},
				scale: {
					visible: {
						transition: {
							staggerChildren: staggerDelay,
						},
					},
				},
				rotate: {},
			};

			return variantsMap[animationType] || {};
		}, [animationType, staggerDelay, delayChildren, disableAnimation]);

		if (disableAnimation) {
			return (
				<div ref={ref} className={className} {...(props as any)}>
					{children}
				</div>
			);
		}

		return (
			<motion.div
				ref={ref}
				initial='hidden'
				animate='visible'
				variants={listVariants}
				className={className}
				{...props}
			>
				{React.Children.map(children, (child, index) => (
					<motion.div key={index} custom={index}>
						{child}
					</motion.div>
				))}
			</motion.div>
		);
	}
);

AnimatedList.displayName = "AnimatedList";

// 预设列表动画组件
export const StaggerList = React.forwardRef<
	HTMLDivElement,
	Omit<AnimatedListProps, "animationType">
>((props, ref) => <AnimatedList ref={ref} animationType='stagger' {...props} />);
StaggerList.displayName = "StaggerList";

export const CascadeList = React.forwardRef<
	HTMLDivElement,
	Omit<AnimatedListProps, "animationType">
>((props, ref) => <AnimatedList ref={ref} animationType='cascade' {...props} />);
CascadeList.displayName = "CascadeList";

export const WaveList = React.forwardRef<HTMLDivElement, Omit<AnimatedListProps, "animationType">>(
	(props, ref) => <AnimatedList ref={ref} animationType='wave' {...props} />
);
WaveList.displayName = "WaveList";

export const ScaleList = React.forwardRef<HTMLDivElement, Omit<AnimatedListProps, "animationType">>(
	(props, ref) => <AnimatedList ref={ref} animationType='scale' {...props} />
);
ScaleList.displayName = "ScaleList";

export const RotateList = React.forwardRef<
	HTMLDivElement,
	Omit<AnimatedListProps, "animationType">
>((props, ref) => <AnimatedList ref={ref} animationType='rotate' {...props} />);
RotateList.displayName = "RotateList";
