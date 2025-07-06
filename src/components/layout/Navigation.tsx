"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface NavigationItem {
	/** 导航项标识 */
	id: string;
	/** 显示文本 */
	label: string;
	/** 链接地址 */
	href?: string;
	/** 点击事件处理器 */
	onClick?: () => void;
	/** 图标 */
	icon?: React.ReactNode;
	/** 是否为活跃状态 */
	active?: boolean;
	/** 是否禁用 */
	disabled?: boolean;
	/** 徽章数字 */
	badge?: number | string;
	/** 子菜单项 */
	children?: NavigationItem[];
}

export interface NavigationProps extends React.HTMLAttributes<HTMLElement> {
	/** 导航项数据 */
	items: NavigationItem[];
	/** 导航变体 */
	variant?: "horizontal" | "vertical" | "tabs" | "pills" | "minimal";
	/** 导航尺寸 */
	size?: "sm" | "md" | "lg";
	/** 对齐方式 */
	align?: "left" | "center" | "right" | "between";
	/** 是否有分隔线 */
	divider?: boolean;
	/** 是否为固定位置 */
	sticky?: boolean;
	/** 点击处理 */
	onItemClick?: (item: NavigationItem) => void;
	/** 自定义容器类名 */
	containerClassName?: string;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
	(
		{
			items,
			variant = "horizontal",
			size = "md",
			align = "left",
			divider = false,
			sticky = false,
			onItemClick,
			containerClassName = "",
			className = "",
			...props
		},
		ref
	) => {
		// 基础样式
		const baseStyles = [
			"flex transition-all duration-200",
			sticky
				? "sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
				: "",
		];

		// 变体样式
		const variantStyles = {
			horizontal: [
				"flex-row",
				align === "center" ? "justify-center" : "",
				align === "right" ? "justify-end" : "",
				align === "between" ? "justify-between" : "",
				"gap-1",
			],
			vertical: ["flex-col", "gap-1"],
			tabs: [
				"flex-row",
				"border-b border-border",
				align === "center" ? "justify-center" : "",
				align === "right" ? "justify-end" : "",
				"gap-0",
			],
			pills: ["flex-row flex-wrap", "bg-muted rounded-xl p-1", "gap-1"],
			minimal: [
				"flex-row",
				align === "center" ? "justify-center" : "",
				align === "right" ? "justify-end" : "",
				"gap-6",
			],
		};

		// 容器样式
		const containerClasses = cn([
			...baseStyles,
			...variantStyles[variant],
			divider && variant !== "tabs" ? "border-b border-border pb-4" : "",
			className,
		]);

		// 处理项目点击
		const handleItemClick = (item: NavigationItem) => {
			if (item.disabled) return;
			onItemClick?.(item);
		};

		// 渲染导航项
		const renderNavigationItem = (item: NavigationItem) => {
			const isActive = item.active;

			// 项目基础样式
			const itemBaseStyles = [
				"inline-flex items-center gap-2 transition-all duration-200",
				"focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2",
				item.disabled
					? "opacity-50 cursor-not-allowed pointer-events-none"
					: "cursor-pointer",
			];

			// 尺寸样式
			const sizeStyles = {
				sm: "px-3 py-1.5 text-sm",
				md: "px-4 py-2.5 text-base",
				lg: "px-6 py-3 text-lg",
			};

			// 变体特定样式
			const itemVariantStyles = {
				horizontal: [
					"rounded-xl",
					isActive
						? "bg-accent text-accent-foreground font-semibold"
						: "text-muted-foreground hover:text-foreground hover:bg-accent",
				],
				vertical: [
					"rounded-xl w-full",
					isActive
						? "bg-accent text-accent-foreground font-semibold"
						: "text-muted-foreground hover:text-foreground hover:bg-accent",
				],
				tabs: [
					"border-b-2 rounded-none",
					isActive
						? "border-primary text-primary font-semibold"
						: "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
				],
				pills: [
					"rounded-lg",
					isActive
						? "bg-background text-foreground font-medium shadow-sm"
						: "text-muted-foreground hover:text-foreground hover:bg-background/60",
				],
				minimal: [
					"border-none bg-transparent",
					isActive
						? "text-primary font-semibold"
						: "text-muted-foreground hover:text-foreground",
				],
			};

			// 组合项目样式
			const itemClasses = cn([
				...itemBaseStyles,
				sizeStyles[size],
				...itemVariantStyles[variant],
			]);

			// 图标尺寸
			const iconSizes = {
				sm: "h-4 w-4",
				md: "h-5 w-5",
				lg: "h-6 w-6",
			};

			// 徽章组件
			const Badge = ({ count }: { count: number | string }) => (
				<span
					className={cn([
						"inline-flex items-center justify-center",
						"min-w-[1.25rem] h-5 px-1.5",
						"text-xs font-medium text-destructive-foreground",
						"bg-destructive rounded-full",
						typeof count === "number" && count > 99 ? "px-1" : "",
					])}
				>
					{typeof count === "number" && count > 99 ? "99+" : count}
				</span>
			);

			const content = (
				<>
					{/* 图标 */}
					{item.icon && (
						<span className={cn("flex-shrink-0", iconSizes[size])}>{item.icon}</span>
					)}

					{/* 标签 */}
					<span className='flex-1 text-left'>{item.label}</span>

					{/* 徽章 */}
					{item.badge && <Badge count={item.badge} />}

					{/* 子菜单指示器 */}
					{item.children && item.children.length > 0 && (
						<svg
							className={cn("flex-shrink-0", iconSizes[size])}
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M19 9l-7 7-7-7'
							/>
						</svg>
					)}
				</>
			);

			if (item.onClick) {
				return (
					<button
						key={item.id}
						className={itemClasses}
						onClick={item.onClick}
						disabled={item.disabled}
					>
						{content}
					</button>
				);
			}

			if (item.href) {
				return (
					<Link
						href={{ pathname: item.href }}
						className={itemClasses}
						onClick={() => handleItemClick(item)}
						aria-current={isActive ? "page" : undefined}
					>
						{content}
					</Link>
				);
			}

			return (
				<button
					key={item.id}
					className={itemClasses}
					onClick={() => handleItemClick(item)}
					disabled={item.disabled}
				>
					{content}
				</button>
			);
		};

		return (
			<div className={cn("w-full", containerClassName)}>
				<nav ref={ref} className={containerClasses} {...props}>
					{items.map(renderNavigationItem)}
				</nav>
			</div>
		);
	}
);

Navigation.displayName = "Navigation";

export default Navigation;
