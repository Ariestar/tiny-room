"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 警告框变体 */
	variant?: "info" | "success" | "warning" | "destructive";
	/** 警告框标题 */
	title?: string;
	/** 是否可关闭 */
	dismissible?: boolean;
	/** 关闭时的回调 */
	onDismiss?: () => void;
	/** 图标（可选，如果不提供则使用默认图标） */
	icon?: React.ReactNode;
	/** 是否显示图标 */
	showIcon?: boolean;
	/** 子元素 */
	children: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
	(
		{
			variant = "info",
			title,
			dismissible = false,
			onDismiss,
			icon,
			showIcon = true,
			children,
			className = "",
			...props
		},
		ref
	) => {
		const [isVisible, setIsVisible] = useState(true);

		// 处理关闭
		const handleDismiss = () => {
			setIsVisible(false);
			onDismiss?.();
		};

		// 如果已关闭则不渲染
		if (!isVisible) return null;

		const baseStyles =
			"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground";

		const variantStyles = {
			info: "bg-card text-card-foreground border-info/50 text-info-foreground [&>svg]:text-info-foreground",
			success:
				"bg-card text-card-foreground border-success/50 text-success-foreground [&>svg]:text-success-foreground",
			warning:
				"bg-card text-card-foreground border-warning/50 text-warning-foreground [&>svg]:text-warning-foreground",
			destructive: "bg-card border-destructive/50 text-destructive [&>svg]:text-destructive",
		};

		const defaultIcons = {
			info: (
				<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
					<path
						fillRule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
						clipRule='evenodd'
					/>
				</svg>
			),
			success: (
				<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
					<path
						fillRule='evenodd'
						d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L8.23 10.661a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
						clipRule='evenodd'
					/>
				</svg>
			),
			warning: (
				<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
					<path
						fillRule='evenodd'
						d='M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z'
						clipRule='evenodd'
					/>
				</svg>
			),
			destructive: (
				<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
					<path
						fillRule='evenodd'
						d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
						clipRule='evenodd'
					/>
				</svg>
			),
		};

		// 关闭按钮图标
		const closeIcon = (
			<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
				<path d='M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z' />
			</svg>
		);

		return (
			<div
				ref={ref}
				className={cn(baseStyles, variantStyles[variant], className)}
				role='alert'
				{...props}
			>
				{showIcon && (icon || defaultIcons[variant])}

				<div className='flex-1'>
					{title && (
						<h5 className='mb-1 font-medium leading-none tracking-tight text-foreground'>
							{title}
						</h5>
					)}
					<div className='text-sm [&_p]:leading-relaxed'>{children}</div>
				</div>

				{dismissible && (
					<button
						type='button'
						className='absolute right-4 top-4 rounded-sm p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
						onClick={handleDismiss}
						aria-label='关闭警告'
					>
						{closeIcon}
						<span className='sr-only'>关闭</span>
					</button>
				)}
			</div>
		);
	}
);

Alert.displayName = "Alert";

export default Alert;
