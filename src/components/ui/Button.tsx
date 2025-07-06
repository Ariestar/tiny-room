"use client";

import React from "react";
import { motion, HTMLMotionProps, Variants, useAnimation } from "framer-motion";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { hoverVariants, tapVariants, durations, easings } from "@/lib/animations";
import Loading from "./Loading";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
	/** 按钮变体 */
	variant?:
		| "primary"
		| "secondary"
		| "ghost"
		| "outline"
		| "destructive"
		| "gradient"
		| "minimal";
	/** 按钮尺寸 */
	size?: "sm" | "md" | "lg" | "xl" | "icon";
	/** 是否为加载状态 */
	loading?: boolean;
	/** 是否为块级按钮 */
	fullWidth?: boolean;
	/** 左侧图标 */
	leftIcon?: React.ReactNode;
	/** 右侧图标 */
	rightIcon?: React.ReactNode;
	/** 是否有阴影效果 */
	shadow?: boolean;
	/** 是否禁用动画 */
	disableAnimation?: boolean;
	/** 自定义动画变体 */
	variants?: Variants;
	/** 子元素 */
	children?: React.ReactNode;
	/** 是否作为子组件渲染 */
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = "primary",
			size = "md",
			loading = false,
			fullWidth = false,
			leftIcon,
			rightIcon,
			shadow = false,
			disableAnimation = false,
			variants: customVariants,
			disabled = false,
			className = "",
			children,
			asChild = false,
			...props
		},
		ref
	) => {
		const controls = useAnimation();
		const Comp: any = asChild ? Slot : motion.button;

		const handleMouseEnter = () => {
			// ... existing code ...
		};

		// 基础样式
		const baseStyles = [
			"font-medium transition-all duration-200 ease-in-out",
			"focus:outline-none",
			"disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
			"relative overflow-hidden",
		];

		// 变体样式
		const variantStyles = {
			primary: [
				"bg-primary text-primary-foreground hover:bg-primary/90",
				"border border-transparent",
				"focus:ring-2 focus:ring-offset-2 focus:ring-primary",
			],
			secondary: [
				"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				"border border-border",
				"focus:ring-2 focus:ring-offset-2 focus:ring-ring",
			],
			ghost: [
				"text-primary hover:bg-primary/10",
				"border border-transparent",
				"focus:ring-2 focus:ring-offset-2 focus:ring-ring",
			],
			outline: [
				"text-primary border border-primary",
				"hover:bg-primary hover:text-primary-foreground",
				"focus:ring-2 focus:ring-offset-2 focus:ring-primary",
			],
			destructive: [
				"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				"border border-transparent",
				"focus:ring-2 focus:ring-offset-2 focus:ring-destructive",
			],
			gradient: [
				"bg-gradient-to-r from-gradient-start to-gradient-end text-white",
				"border border-transparent",
				"focus:ring-2 focus:ring-offset-2 focus:ring-brand-300",
				"shadow-soft hover:shadow-medium",
			],
			minimal: [
				"bg-muted text-muted-foreground",
				"hover:bg-accent hover:text-accent-foreground",
				"border border-transparent",
				"focus:ring-2 focus:ring-offset-2 focus:ring-ring",
			],
		};

		// 尺寸样式
		const sizeStyles = {
			sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
			md: "px-4 py-2.5 text-sm rounded-xl gap-2",
			lg: "px-6 py-3 text-base rounded-xl gap-2.5",
			xl: "px-8 py-4 text-lg rounded-2xl gap-3",
			icon: "p-2.5 rounded-xl",
		};

		// 图标尺寸
		const iconSizes = {
			sm: "h-4 w-4",
			md: "h-4 w-4",
			lg: "h-5 w-5",
			xl: "h-6 w-6",
			icon: "h-5 w-5",
		};

		// 组合样式类
		const buttonClasses = cn([
			size === "icon" ? "grid place-items-center" : "inline-flex items-center justify-center",
			...baseStyles,
			variantStyles[variant],
			sizeStyles[size],
			fullWidth ? "w-full" : "",
			shadow ? "shadow-strong" : "",
			loading ? "pointer-events-none" : "",
			className,
		]);

		// 动画变体
		const buttonVariants: Variants = customVariants || {
			rest: {
				scale: 1,
				y: 0,
				boxShadow:
					variant === "primary"
						? "0 1px 3px rgba(0, 0, 0, 0.12)"
						: "0 1px 2px rgba(0, 0, 0, 0.05)",
			},
			hover: {
				scale: variant === "gradient" ? 1.05 : 1.02,
				y: variant === "primary" || variant === "destructive" ? -1 : 0,
				boxShadow:
					variant === "primary"
						? "0 10px 25px rgba(0, 112, 243, 0.15)"
						: variant === "gradient"
						? "0 10px 25px rgba(124, 58, 237, 0.2)"
						: "0 4px 12px rgba(0, 0, 0, 0.15)",
				transition: {
					duration: durations.fast,
					ease: easings.easeOut,
				},
			},
			tap: {
				scale: 0.98,
				y: 0,
				transition: {
					duration: durations.fast / 2,
					ease: easings.easeOut,
				},
			},
		};

		// 加载状态动画变体
		const loadingVariants: Variants = {
			loading: {
				scale: [1, 1.02, 1],
				transition: {
					duration: 1.5,
					repeat: Infinity,
					ease: easings.easeInOut,
				},
			},
		};

		// 渐变背景动画变体
		const gradientOverlayVariants: Variants = {
			rest: { opacity: 0, scale: 0.8 },
			hover: {
				opacity: 1,
				scale: 1.1,
				transition: {
					duration: durations.normal,
					ease: easings.easeOut,
				},
			},
		};

		// 加载状态动画
		const LoadingSpinner = () => (
			<motion.svg
				className={cn(iconSizes[size])}
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				animate={{ rotate: 360 }}
				transition={{
					duration: 1,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<circle
					className='opacity-25'
					cx='12'
					cy='12'
					r='10'
					stroke='currentColor'
					strokeWidth='4'
				></circle>
				<path
					className='opacity-75'
					fill='currentColor'
					d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
				></path>
			</motion.svg>
		);

		// 内容动画变体
		const contentVariants: Variants = {
			rest: { opacity: 1 },
			loading: {
				opacity: 0.6,
				transition: { duration: durations.fast },
			},
		};

		return (
			<Comp
				ref={ref}
				className={buttonClasses}
				animate={controls}
				initial='rest'
				whileHover={!disableAnimation && !disabled ? "hover" : undefined}
				whileTap={!disableAnimation && !disabled ? "tap" : undefined}
				variants={buttonVariants}
				disabled={disabled || loading}
				onMouseEnter={handleMouseEnter}
				{...props}
			>
				{size === "icon" ? (
					loading ? (
						<LoadingSpinner />
					) : (
						children
					)
				) : (
					<>
						{variant === "gradient" && (
							<motion.div
								className='absolute inset-0 bg-gradient-to-r from-gradient-end to-gradient-start'
								variants={gradientOverlayVariants}
								initial='rest'
							/>
						)}

						<motion.div
							className='relative z-10 flex items-center justify-center'
							animate={loading ? "loading" : "rest"}
							variants={contentVariants}
						>
							{loading && <LoadingSpinner />}
							{!loading && leftIcon && (
								<span className={cn("mr-2", iconSizes[size])}>{leftIcon}</span>
							)}
							<span className='truncate'>{children}</span>
							{!loading && rightIcon && (
								<span className={cn("ml-2", iconSizes[size])}>{rightIcon}</span>
							)}
						</motion.div>
					</>
				)}
			</Comp>
		);
	}
);

Button.displayName = "Button";

export default Button;
