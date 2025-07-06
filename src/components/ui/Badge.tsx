import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** 徽章变体 */
	variant?: "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline";
	/** 徽章尺寸 */
	size?: "sm" | "md" | "lg";
	/** 是否为圆形徽章 */
	rounded?: boolean;
	/** 是否有点状指示器 */
	dot?: boolean;
	/** 子元素 */
	children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			variant = "secondary",
			size = "md",
			rounded = false,
			dot = false,
			children,
			className = "",
			...props
		},
		ref
	) => {
		// 基础样式
		const baseStyles =
			"inline-flex items-center font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

		// 变体样式
		const variantStyles = {
			primary: "border-transparent bg-primary text-primary-foreground focus:ring-primary",
			secondary: "border-transparent bg-secondary text-secondary-foreground focus:ring-ring",
			destructive:
				"border-transparent bg-destructive text-destructive-foreground focus:ring-destructive",
			success:
				"border-transparent bg-emerald-500 text-primary-foreground focus:ring-emerald-300",
			warning: "border-transparent bg-amber-500 text-black focus:ring-amber-300",
			info: "border-transparent bg-sky-500 text-primary-foreground focus:ring-sky-300",
			outline: "text-foreground border-input focus:ring-ring",
		};

		// 尺寸样式
		const sizeStyles = {
			sm: "px-2 py-0.5 text-xs",
			md: "px-2.5 py-1 text-sm",
			lg: "px-3 py-1.5 text-base",
		};

		// 圆角样式
		const roundedStyles = rounded ? "rounded-full" : "rounded-md";

		// 合并所有样式
		const badgeClasses = cn(
			baseStyles,
			variantStyles[variant ?? "secondary"],
			sizeStyles[size],
			roundedStyles,
			className
		);

		return (
			<span ref={ref} className={badgeClasses} {...props}>
				{/* 点状指示器 */}
				{dot && (
					<svg
						className='mr-1.5 h-2 w-2 fill-current'
						viewBox='0 0 6 6'
						aria-hidden='true'
					>
						<circle cx={3} cy={3} r={3} />
					</svg>
				)}
				{children}
			</span>
		);
	}
);

Badge.displayName = "Badge";

export default Badge;
