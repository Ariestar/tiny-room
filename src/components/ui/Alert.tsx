import React, { useState } from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
	/** 警告框变体 */
	variant?: "info" | "success" | "warning" | "danger";
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

		// 基础样式
		const baseStyles = "relative rounded-xl border p-4 transition-all duration-200";

		// 变体样式
		const variantStyles = {
			info: "bg-blue-50 border-blue-200 text-blue-800",
			success: "bg-accent-green-50 border-accent-green-200 text-accent-green-800",
			warning: "bg-accent-orange-50 border-accent-orange-200 text-accent-orange-800",
			danger: "bg-red-50 border-red-200 text-red-800",
		};

		// 默认图标
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
			danger: (
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

		// 合并所有样式
		const alertClasses = [baseStyles, variantStyles[variant], className]
			.filter(Boolean)
			.join(" ");

		return (
			<div ref={ref} className={alertClasses} role='alert' {...props}>
				<div className='flex'>
					{/* 图标 */}
					{showIcon && (
						<div className='flex-shrink-0'>{icon || defaultIcons[variant]}</div>
					)}

					{/* 内容 */}
					<div className={showIcon ? "ml-3 flex-1" : "flex-1"}>
						{/* 标题 */}
						{title && <h3 className='text-sm font-medium mb-1'>{title}</h3>}

						{/* 内容 */}
						<div className='text-sm'>{children}</div>
					</div>

					{/* 关闭按钮 */}
					{dismissible && (
						<div className='ml-auto pl-3'>
							<div className='-mx-1.5 -my-1.5'>
								<button
									type='button'
									className='inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
									onClick={handleDismiss}
									aria-label='关闭警告'
								>
									{closeIcon}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
);

Alert.displayName = "Alert";

export default Alert;
