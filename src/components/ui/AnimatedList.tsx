"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { containerVariants, itemVariants, durations, easings } from "@/lib/animations";

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
						transition: { duration: durations.normal, ease: easings.easeOut },
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
							duration: durations.normal,
							ease: easings.easeOut,
							scale: { duration: durations.slow },
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
						transition: easings.springBouncy,
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
							duration: durations.slow,
							ease: easings.easeOut,
							rotate: { duration: durations.normal },
						},
					},
				},
			};

		default: // 'stagger'
			return {
				container: containerVariants,
				item: itemVariants,
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
		// 如果禁用动画，返回普通div
		if (disableAnimation) {
			return (
				<div ref={ref} className={className} {...(props as any)}>
					{children}
				</div>
			);
		}

		// 获取动画变体
		const { container, item } = React.useMemo(() => {
			if (customContainerVariants && customItemVariants) {
				return {
					container: customContainerVariants,
					item: customItemVariants,
				};
			}
			return createListVariants(animationType, staggerDelay, delayChildren);
		}, [
			animationType,
			staggerDelay,
			delayChildren,
			customContainerVariants,
			customItemVariants,
		]);

		return (
			<motion.div
				ref={ref}
				variants={container}
				initial='hidden'
				animate='visible'
				className={className}
				{...props}
			>
				{React.Children.map(children, (child, index) => (
					<motion.div key={index} variants={item} custom={index}>
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
