"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	/** 输入框标签 */
	label?: string;
	/** 占位符文本 */
	placeholder?: string;
	/** 错误信息 */
	error?: string;
	/** 帮助文本 */
	helpText?: string;
	/** 输入框变体 */
	variant?: "default" | "filled" | "underlined" | "minimal";
	/** 输入框尺寸 */
	size?: "sm" | "md" | "lg";
	/** 左侧图标 */
	leftIcon?: React.ReactNode;
	/** 右侧图标 */
	rightIcon?: React.ReactNode;
	/** 是否为密码输入框（显示切换按钮） */
	isPassword?: boolean;
	/** 是否为搜索框 */
	isSearch?: boolean;
	/** 是否必填 */
	required?: boolean;
	/** 输入状态 */
	state?: "default" | "success" | "warning" | "error";
	/** 自定义容器类名 */
	containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			placeholder,
			error,
			helpText,
			variant = "default",
			size = "md",
			leftIcon,
			rightIcon,
			isPassword = false,
			isSearch = false,
			required = false,
			state = "default",
			containerClassName = "",
			className = "",
			disabled,
			id,
			type = "text",
			...props
		},
		ref
	) => {
		const [showPassword, setShowPassword] = useState(false);
		const [isFocused, setIsFocused] = useState(false);

		// 生成唯一ID
		const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
		const helpTextId = `${inputId}-help`;
		const errorId = `${inputId}-error`;

		// 确定输入类型
		const inputType = isPassword ? (showPassword ? "text" : "password") : type;

		// 状态判断
		const hasError = error || state === "error";
		const hasSuccess = state === "success";
		const hasWarning = state === "warning";

		// 基础样式
		const baseStyles = [
			"w-full transition-all duration-200 ease-in-out",
			"focus:outline-none",
			"disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted",
			"placeholder:text-muted-foreground",
		];

		// 变体样式
		const variantStyles = {
			default: [
				"bg-transparent border border-input",
				"focus:ring-2 focus:ring-ring",
				"hover:border-input/80",
			],
			filled: [
				"bg-muted border border-transparent",
				"focus:bg-card focus:ring-2 focus:ring-ring",
				"hover:bg-muted/80",
			],
			underlined: [
				"bg-transparent border-0 border-b-2 border-input",
				"focus:border-primary rounded-none px-0",
				"hover:border-input/80",
			],
			minimal: [
				"bg-transparent border border-transparent",
				"focus:border-input focus:bg-accent",
				"hover:bg-accent",
			],
		};

		// 状态样式
		const stateStyles = {
			default: "",
			success: "border-success focus:border-success focus:ring-success/20",
			warning: "border-warning focus:border-warning focus:ring-warning/20",
			error: "border-destructive focus:border-destructive focus:ring-destructive/20",
		};

		// 尺寸样式
		const sizeStyles = {
			sm: "px-3 py-2 text-sm rounded-lg",
			md: "px-4 py-3 text-base rounded-xl",
			lg: "px-5 py-4 text-lg rounded-xl",
		};

		// 图标尺寸
		const iconSizes = {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		};

		// 左侧内边距调整
		const leftPadding = leftIcon
			? {
					sm: "pl-9",
					md: "pl-11",
					lg: "pl-13",
			  }
			: {};

		// 右侧内边距调整
		const rightPadding =
			rightIcon || isPassword || isSearch
				? {
						sm: "pr-9",
						md: "pr-11",
						lg: "pr-13",
				  }
				: {};

		// 组合输入框样式
		const inputClasses = cn([
			...baseStyles,
			...variantStyles[variant],
			stateStyles[
				hasError ? "error" : hasSuccess ? "success" : hasWarning ? "warning" : "default"
			],
			sizeStyles[size],
			leftPadding[size] || "",
			rightPadding[size] || "",
			className,
		]);

		// 标签样式
		const labelClasses = cn([
			"block text-sm font-medium mb-2",
			hasError ? "text-destructive-foreground" : "text-foreground",
			disabled ? "text-muted-foreground" : "",
		]);

		// 帮助文本样式
		const helpTextClasses = cn([
			"mt-2 text-sm",
			hasError
				? "text-destructive-foreground"
				: hasSuccess
				? "text-success-foreground"
				: hasWarning
				? "text-warning-foreground"
				: "text-muted-foreground",
		]);

		// 图标容器样式
		const iconContainerClasses = cn([
			"absolute top-1/2 transform -translate-y-1/2 pointer-events-none",
			"text-muted-foreground",
			isFocused ? "text-foreground" : "",
		]);

		// 左侧图标位置
		const leftIconPosition = {
			sm: "left-3",
			md: "left-3.5",
			lg: "left-4",
		};

		// 右侧图标位置
		const rightIconPosition = {
			sm: "right-3",
			md: "right-3.5",
			lg: "right-4",
		};

		// 密码切换图标
		const PasswordToggleIcon = () => (
			<button
				type='button'
				onClick={() => setShowPassword(!showPassword)}
				className={cn([
					"absolute top-1/2 transform -translate-y-1/2",
					"text-muted-foreground hover:text-foreground",
					"focus:outline-none focus:text-foreground",
					"p-1 rounded transition-colors",
					rightIconPosition[size],
				])}
				aria-label={showPassword ? "隐藏密码" : "显示密码"}
			>
				{showPassword ? (
					<svg
						className={iconSizes[size]}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
						/>
					</svg>
				) : (
					<svg
						className={iconSizes[size]}
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
						/>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth='2'
							d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
						/>
					</svg>
				)}
			</button>
		);

		// 搜索图标
		const SearchIcon = () => (
			<div
				className={cn(
					iconContainerClasses,
					rightIconPosition[size],
					"text-muted-foreground"
				)}
			>
				<svg
					className={iconSizes[size]}
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
					/>
				</svg>
			</div>
		);

		return (
			<div className={cn("relative", containerClassName)}>
				{/* 标签 */}
				{label && (
					<label htmlFor={inputId} className={labelClasses}>
						{label}
						{required && <span className='text-red-500 ml-1'>*</span>}
					</label>
				)}

				{/* 输入框容器 */}
				<div className='relative'>
					{/* 左侧图标 */}
					{leftIcon && (
						<div className={cn([iconContainerClasses, leftIconPosition[size]])}>
							<span className={iconSizes[size]}>{leftIcon}</span>
						</div>
					)}

					{/* 输入框 */}
					<input
						ref={ref}
						id={inputId}
						type={inputType}
						placeholder={placeholder}
						className={inputClasses}
						disabled={disabled}
						required={required}
						onFocus={e => {
							setIsFocused(true);
							props.onFocus?.(e);
						}}
						onBlur={e => {
							setIsFocused(false);
							props.onBlur?.(e);
						}}
						aria-describedby={cn(
							[helpText ? helpTextId : "", error ? errorId : ""]
								.filter(Boolean)
								.join(" ") || undefined
						)}
						aria-invalid={hasError ? "true" : "false"}
						{...props}
					/>

					{/* 右侧图标 */}
					{isPassword && <PasswordToggleIcon />}
					{isSearch && !isPassword && <SearchIcon />}
					{rightIcon && !isPassword && !isSearch && (
						<div className={cn([iconContainerClasses, rightIconPosition[size]])}>
							<span className={iconSizes[size]}>{rightIcon}</span>
						</div>
					)}
				</div>

				{/* 帮助文本或错误信息 */}
				{(helpText || error) && (
					<p
						id={error ? errorId : helpTextId}
						className={helpTextClasses}
						role={error ? "alert" : undefined}
					>
						{error || helpText}
					</p>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export default Input;
