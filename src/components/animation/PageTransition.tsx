"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/shared/utils";
import { pageTransitions, easingConfig } from "@/lib/ui/animations";

// 页面转场类型
export type PageTransitionType =
	| "slide"
	| "fade"
	| "scale"
	| "slideUp"
	| "slideDown"
	| "rotate"
	| "flip";

// 组件Props接口
export interface PageTransitionProps
	extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "exit"> {
	/** 转场动画类型 */
	transitionType?: PageTransitionType;
	/** 自定义动画变体 */
	variants?: Variants;
	/** 动画持续时间（秒） */
	duration?: number;
	/** 是否禁用动画 */
	disableAnimation?: boolean;
	/** 子元素 */
	children: React.ReactNode;
	/** 额外的CSS类名 */
	className?: string;
}

// 创建不同类型的页面转场变体
const createPageVariants = (transitionType: PageTransitionType, duration: number): Variants => {
	const baseDuration = duration;

	switch (transitionType) {
		case "fade":
			return {
				initial: { opacity: 0 },
				in: { opacity: 1 },
				out: { opacity: 0 },
			};

		case "scale":
			return {
				initial: { opacity: 0, scale: 0.95 },
				in: { opacity: 1, scale: 1 },
				out: { opacity: 0, scale: 1.05 },
			};

		case "slideUp":
			return {
				initial: { opacity: 0, y: 50 },
				in: { opacity: 1, y: 0 },
				out: { opacity: 0, y: -50 },
			};

		case "slideDown":
			return {
				initial: { opacity: 0, y: -50 },
				in: { opacity: 1, y: 0 },
				out: { opacity: 0, y: 50 },
			};

		case "rotate":
			return {
				initial: { opacity: 0, rotate: -5, scale: 0.95 },
				in: { opacity: 1, rotate: 0, scale: 1 },
				out: { opacity: 0, rotate: 5, scale: 0.95 },
			};

		case "flip":
			return {
				initial: { opacity: 0, rotateY: -90, scale: 0.8 },
				in: { opacity: 1, rotateY: 0, scale: 1 },
				out: { opacity: 0, rotateY: 90, scale: 0.8 },
			};

		default: // 'slide'
			return {
				initial: { x: 30, opacity: 0 },
				in: { x: 0, opacity: 1 },
				out: { x: -30, opacity: 0 },
			};
	}
};

/**
 * PageTransition - 页面转场动画组件
 *
 * 使用方式：
 * <PageTransition transitionType="slide">
 *   <YourPageComponent />
 * </PageTransition>
 */
export const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
	(
		{
			transitionType = "slide",
			variants,
			duration = 0.6,
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
		const animationVariants = variants || createPageVariants(transitionType, duration);

		// 创建转场配置
		const transition = {
			type: "tween",
			ease: easingConfig.easeInOut,
			duration,
		};

		return (
			<motion.div
				ref={ref}
				initial='initial'
				animate='in'
				variants={animationVariants}
				transition={transition}
				className={cn("w-full relative", className)}
				style={{
					willChange: 'transform, opacity',
					isolation: 'isolate',
					contain: 'layout style paint'
				}}
				{...props}
			>
				{children}
			</motion.div>
		);
	}
);

PageTransition.displayName = "PageTransition";

// 预设页面转场组件
export const SlideTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='slide' {...props} />);
SlideTransition.displayName = "SlideTransition";

export const FadeTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='fade' {...props} />);
FadeTransition.displayName = "FadeTransition";

export const ScaleTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='scale' {...props} />);
ScaleTransition.displayName = "ScaleTransition";

export const SlideUpTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='slideUp' {...props} />);
SlideUpTransition.displayName = "SlideUpTransition";

export const SlideDownTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='slideDown' {...props} />);
SlideDownTransition.displayName = "SlideDownTransition";

export const RotateTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='rotate' {...props} />);
RotateTransition.displayName = "RotateTransition";

export const FlipTransition = React.forwardRef<
	HTMLDivElement,
	Omit<PageTransitionProps, "transitionType">
>((props, ref) => <PageTransition ref={ref} transitionType='flip' {...props} />);
FlipTransition.displayName = "FlipTransition";
