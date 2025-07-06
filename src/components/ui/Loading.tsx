import React from "react";
import { cn } from "@/lib/utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 加载动画类型 */
	variant?: "spinner" | "dots" | "pulse" | "bars" | "ring";
	/** 加载器尺寸 */
	size?: "sm" | "md" | "lg" | "xl";
	/** 加载器颜色 */
	color?: "primary" | "secondary" | "foreground" | "background";
	/** 显示加载文本 */
	text?: string;
	/** 是否居中显示 */
	center?: boolean;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
	(
		{
			variant = "spinner",
			size = "md",
			color = "secondary",
			text,
			center = false,
			className = "",
			...props
		},
		ref
	) => {
		// 尺寸样式
		const sizeStyles = {
			sm: "h-4 w-4",
			md: "h-6 w-6",
			lg: "h-8 w-8",
			xl: "h-12 w-12",
		};

		// 颜色样式
		const colorStyles = {
			primary: "text-primary",
			secondary: "text-secondary-foreground",
			foreground: "text-foreground",
			background: "text-background",
		};

		// 文本尺寸
		const textSizeStyles = {
			sm: "text-sm",
			md: "text-base",
			lg: "text-lg",
			xl: "text-xl",
		};

		// 容器样式
		const containerClasses = [
			"flex flex-col items-center gap-3",
			center ? "justify-center min-h-[200px]" : "",
			className,
		]
			.filter(Boolean)
			.join(" ");

		// 加载器样式
		const loaderClasses = cn(sizeStyles[size], colorStyles[color]);

		// 旋转器组件
		const Spinner = () => (
			<svg
				className={`${loaderClasses} animate-spin`}
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				aria-hidden='true'
			>
				<circle
					className='opacity-25'
					cx='12'
					cy='12'
					r='10'
					stroke='currentColor'
					strokeWidth='4'
				/>
				<path
					className='opacity-75'
					fill='currentColor'
					d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
				/>
			</svg>
		);

		// 点状动画组件
		const Dots = () => (
			<div className='flex space-x-1'>
				{[0, 1, 2].map(index => (
					<div
						key={index}
						className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full animate-pulse`}
						style={{
							animationDelay: `${index * 0.2}s`,
							animationDuration: "1s",
						}}
					/>
				))}
			</div>
		);

		// 脉冲动画组件
		const Pulse = () => (
			<div
				className={`${loaderClasses} bg-current rounded-full animate-pulse`}
				style={{ animationDuration: "1.5s" }}
			/>
		);

		// 条形动画组件
		const Bars = () => (
			<div className={cn("flex items-end space-x-1", loaderClasses)}>
				{[0, 1, 2, 3].map(index => (
					<div
						key={index}
						className='w-1 animate-pulse'
						style={{
							height:
								size === "sm"
									? "12px"
									: size === "md"
									? "16px"
									: size === "lg"
									? "20px"
									: "24px",
							animationDelay: `${index * 0.15}s`,
							animationDuration: "1.2s",
							backgroundColor: "currentColor",
						}}
					/>
				))}
			</div>
		);

		// 环形动画组件
		const Ring = () => (
			<div
				className={`${loaderClasses} border-2 border-current border-t-transparent rounded-full animate-spin`}
				style={{ animationDuration: "1s" }}
			/>
		);

		// 根据变体选择组件
		const renderLoader = () => {
			switch (variant) {
				case "spinner":
					return <Spinner />;
				case "dots":
					return <Dots />;
				case "pulse":
					return <Pulse />;
				case "bars":
					return <Bars />;
				case "ring":
					return <Ring />;
				default:
					return <Spinner />;
			}
		};

		return (
			<div
				ref={ref}
				className={cn(containerClasses, className)}
				role='status'
				aria-live='polite'
				{...props}
			>
				{renderLoader()}
				{text && (
					<span className={cn(textSizeStyles[size], colorStyles[color], "font-medium")}>
						{text}
					</span>
				)}
				<span className='sr-only'>加载中...</span>
			</div>
		);
	}
);

Loading.displayName = "Loading";

export default Loading;
