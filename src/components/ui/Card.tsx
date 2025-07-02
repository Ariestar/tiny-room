import React from "react";
import { cn } from "@/lib/utils";

// Card 主组件 Props
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 卡片变体 */
	variant?: "default" | "elevated" | "outlined" | "minimal" | "gradient";
	/** 卡片尺寸 */
	size?: "sm" | "md" | "lg";
	/** 是否可悬停 */
	hoverable?: boolean;
	/** 是否可点击 */
	clickable?: boolean;
	/** 是否有阴影 */
	shadow?: boolean;
	/** 子元素 */
	children: React.ReactNode;
}

// CardHeader Props
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 是否有分隔线 */
	divider?: boolean;
	children: React.ReactNode;
}

// CardTitle Props
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	/** 标题级别 */
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	/** 是否为渐变文字 */
	gradient?: boolean;
	children: React.ReactNode;
}

// CardDescription Props
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
}

// CardContent Props
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 内容内边距 */
	padding?: "none" | "sm" | "md" | "lg";
	children: React.ReactNode;
}

// CardFooter Props
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 是否有分隔线 */
	divider?: boolean;
	/** 对齐方式 */
	align?: "left" | "center" | "right" | "between";
	children: React.ReactNode;
}

// Card 主组件
const Card = React.forwardRef<HTMLDivElement, CardProps>(
	(
		{
			variant = "default",
			size = "md",
			hoverable = false,
			clickable = false,
			shadow = false,
			className = "",
			children,
			...props
		},
		ref
	) => {
		// 基础样式
		const baseStyles = [
			"rounded-2xl overflow-hidden transition-all duration-300",
			clickable ? "cursor-pointer" : "",
		];

		// 变体样式
		const variantStyles = {
			default: [
				"bg-white border border-gray-150",
				hoverable || clickable ? "hover:border-gray-200" : "",
			],
			elevated: [
				"bg-white border-0",
				"shadow-soft",
				hoverable || clickable ? "hover:shadow-medium" : "",
			],
			outlined: [
				"bg-transparent border-2 border-gray-200",
				hoverable || clickable ? "hover:border-gray-300 hover:bg-gray-50" : "",
			],
			minimal: [
				"bg-gray-50 border border-transparent",
				hoverable || clickable ? "hover:bg-gray-100 hover:border-gray-200" : "",
			],
			gradient: [
				"bg-gradient-to-br from-brand-50 to-accent-purple-50",
				"border border-brand-100",
				hoverable || clickable ? "hover:from-brand-100 hover:to-accent-purple-100" : "",
			],
		};

		// 尺寸样式
		const sizeStyles = {
			sm: "p-4",
			md: "p-6",
			lg: "p-8",
		};

		// 悬停效果
		const hoverStyles =
			hoverable || clickable ? ["hover:-translate-y-1", "hover:shadow-medium"] : [];

		// 阴影样式
		const shadowStyles = shadow ? "shadow-strong" : "";

		// 组合样式
		const cardClasses = cn([
			...baseStyles,
			...variantStyles[variant],
			sizeStyles[size],
			...hoverStyles,
			shadowStyles,
			className,
		]);

		return (
			<div ref={ref} className={cardClasses} {...props}>
				{children}
			</div>
		);
	}
);

Card.displayName = "Card";

// CardHeader 组件
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
	({ divider = false, className = "", children, ...props }, ref) => {
		const headerClasses = cn([
			"flex flex-col space-y-1.5",
			divider ? "border-b border-gray-100 pb-4 mb-4" : "",
			className,
		]);

		return (
			<div ref={ref} className={headerClasses} {...props}>
				{children}
			</div>
		);
	}
);

CardHeader.displayName = "CardHeader";

// CardTitle 组件
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
	({ level = 3, gradient = false, className = "", children, ...props }, ref) => {
		const Component = `h${level}` as keyof JSX.IntrinsicElements;

		const titleClasses = cn([
			"font-semibold leading-none tracking-tight",
			gradient ? "text-gradient" : "text-gray-900",
			// 根据级别设置尺寸
			level === 1 ? "text-3xl" : "",
			level === 2 ? "text-2xl" : "",
			level === 3 ? "text-xl" : "",
			level === 4 ? "text-lg" : "",
			level === 5 ? "text-base" : "",
			level === 6 ? "text-sm" : "",
			className,
		]);

		return (
			<Component ref={ref} className={titleClasses} {...props}>
				{children}
			</Component>
		);
	}
);

CardTitle.displayName = "CardTitle";

// CardDescription 组件
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
	({ className = "", children, ...props }, ref) => {
		const descriptionClasses = cn(["text-sm text-gray-600 leading-relaxed", className]);

		return (
			<p ref={ref} className={descriptionClasses} {...props}>
				{children}
			</p>
		);
	}
);

CardDescription.displayName = "CardDescription";

// CardContent 组件
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
	({ padding = "md", className = "", children, ...props }, ref) => {
		// 内边距样式
		const paddingStyles = {
			none: "",
			sm: "p-4",
			md: "p-6",
			lg: "p-8",
		};

		const contentClasses = cn([paddingStyles[padding], className]);

		return (
			<div ref={ref} className={contentClasses} {...props}>
				{children}
			</div>
		);
	}
);

CardContent.displayName = "CardContent";

// CardFooter 组件
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
	({ divider = false, align = "left", className = "", children, ...props }, ref) => {
		// 对齐样式
		const alignStyles = {
			left: "justify-start",
			center: "justify-center",
			right: "justify-end",
			between: "justify-between",
		};

		const footerClasses = cn([
			"flex items-center",
			alignStyles[align],
			divider ? "border-t border-gray-100 pt-4 mt-4" : "",
			className,
		]);

		return (
			<div ref={ref} className={footerClasses} {...props}>
				{children}
			</div>
		);
	}
);

CardFooter.displayName = "CardFooter";

export default Card;
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
