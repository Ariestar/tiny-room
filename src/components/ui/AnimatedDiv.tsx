"use client";

import React, { useRef, useMemo } from "react";
import { motion, HTMLMotionProps, Variants, useInView } from "framer-motion";
import { animationPresets } from "@/lib/animations";

// 动画预设类型
export type AnimationPreset = keyof typeof animationPresets;

// 组件Props接口
export interface AnimatedDivProps
	extends Omit<HTMLMotionProps<"div">, "variants" | "initial" | "animate" | "exit"> {
	/** 动画预设 */
	animation?: AnimationPreset;
	/** 自定义动画变体 */
	variants?: Variants;
	/** 延迟时间（秒） */
	delay?: number;
	/** 动画持续时间（秒） */
	duration?: number;
	/** 是否禁用动画 */
	disableAnimation?: boolean;
	/** 触发动画的条件 */
	animate?: boolean;
	/** 子元素 */
	children: React.ReactNode;
	/** 额外的CSS类名 */
	className?: string;
}

/**
 * AnimatedDiv - 通用动画容器组件
 *
 * 使用方式：
 * <AnimatedDiv animation="fadeIn">内容</AnimatedDiv>
 * <AnimatedDiv animation="slideUp" delay={0.2}>内容</AnimatedDiv>
 */
export const AnimatedDiv = React.forwardRef<HTMLDivElement, AnimatedDivProps>(
	(
		{
			animation = "fade",
			variants,
			delay = 0,
			duration,
			disableAnimation = false,
			animate = true,
			children,
			className,
			...props
		},
		ref
	) => {
		const customVariants: Variants = React.useMemo(() => {
			if (disableAnimation) return {};
			const animationVariants = variants || animationPresets[animation];

			if (!animationVariants) return {};

			const newVariants: Variants = {};

			Object.keys(animationVariants).forEach(key => {
				const variant = animationVariants[key];
				if (typeof variant === "object" && variant !== null) {
					newVariants[key] = {
						...variant,
						transition: {
							// @ts-ignore
							...((variant as any).transition || {}),
							...(delay && { delay }),
							...(duration && { duration }),
						},
					};
				} else {
					newVariants[key] = variant;
				}
			});

			return newVariants;
		}, [animation, variants, delay, duration, disableAnimation]);

		if (disableAnimation) {
			return (
				// @ts-ignore
				<div ref={ref} className={className} {...props}>
					{children}
				</div>
			);
		}

		return (
			<motion.div
				ref={ref}
				variants={customVariants}
				initial='hidden'
				animate={animate ? "visible" : "hidden"}
				exit='exit'
				className={className}
				{...props}
			>
				{children}
			</motion.div>
		);
	}
);

AnimatedDiv.displayName = "AnimatedDiv";

// 导出预设动画组件
export const FadeIn = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='fade' {...props} />
);
FadeIn.displayName = "FadeIn";

export const SlideUp = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='slideUp' {...props} />
);
SlideUp.displayName = "SlideUp";

export const SlideDown = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='slideDown' {...props} />
);
SlideDown.displayName = "SlideDown";

export const SlideLeft = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='slideLeft' {...props} />
);
SlideLeft.displayName = "SlideLeft";

export const SlideRight = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='slideRight' {...props} />
);
SlideRight.displayName = "SlideRight";

export const ScaleIn = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='scale' {...props} />
);
ScaleIn.displayName = "ScaleIn";

export const BounceIn = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='bounce' {...props} />
);
BounceIn.displayName = "BounceIn";

export const RotateIn = React.forwardRef<HTMLDivElement, Omit<AnimatedDivProps, "animation">>(
	(props, ref) => <AnimatedDiv ref={ref} animation='rotate' {...props} />
);
RotateIn.displayName = "RotateIn";
