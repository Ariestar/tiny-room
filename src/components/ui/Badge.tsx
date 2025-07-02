import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	/** 徽章变体 */
	variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "purple" | "pink";
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
			variant = "default",
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
			"inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

		// 变体样式
		const variantStyles = {
			default: "bg-gray-100 text-gray-800 focus:ring-gray-300",
			primary: "bg-brand-100 text-brand-800 focus:ring-brand-300",
			success: "bg-accent-green-100 text-accent-green-800 focus:ring-accent-green-300",
			warning: "bg-accent-orange-100 text-accent-orange-800 focus:ring-accent-orange-300",
			danger: "bg-red-100 text-red-800 focus:ring-red-300",
			info: "bg-blue-100 text-blue-800 focus:ring-blue-300",
			purple: "bg-accent-purple-100 text-accent-purple-800 focus:ring-accent-purple-300",
			pink: "bg-accent-pink-100 text-accent-pink-800 focus:ring-accent-pink-300",
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
		const badgeClasses = [
			baseStyles,
			variantStyles[variant],
			sizeStyles[size],
			roundedStyles,
			className,
		]
			.filter(Boolean)
			.join(" ");

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
