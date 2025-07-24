import React from "react";
import { cn } from "@/lib/shared/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
	/** 复选框标签 */
	label?: string;
	/** 复选框描述 */
	description?: string;
	/** 错误信息 */
	error?: string;
	/** 复选框尺寸 */
	size?: "sm" | "md" | "lg";
	/** 不确定状态 */
	indeterminate?: boolean;
	/** 自定义容器类名 */
	containerClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{
			label,
			description,
			error,
			size = "md",
			indeterminate = false,
			containerClassName = "",
			className = "",
			id,
			disabled,
			...props
		},
		ref
	) => {
		// 生成唯一ID
		const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
		const descriptionId = `${checkboxId}-description`;
		const errorId = `${checkboxId}-error`;

		// 尺寸样式
		const sizeStyles = {
			sm: {
				checkbox: "h-4 w-4",
				text: "text-sm",
				description: "text-xs",
			},
			md: {
				checkbox: "h-5 w-5",
				text: "text-base",
				description: "text-sm",
			},
			lg: {
				checkbox: "h-6 w-6",
				text: "text-lg",
				description: "text-base",
			},
		};

		// 基础样式
		const baseStyles =
			"rounded border-2 text-brand-500 transition-all duration-fast focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

		// 状态样式
		const stateStyles = error
			? "border-red-300 focus:border-red-500"
			: "border-gray-300 focus:border-brand-300";

		// 合并复选框样式
		const checkboxClasses = [baseStyles, stateStyles, sizeStyles[size].checkbox, className]
			.filter(Boolean)
			.join(" ");

		// 容器样式
		const containerClasses = ["flex items-start gap-3", containerClassName]
			.filter(Boolean)
			.join(" ");

		// 处理不确定状态
		React.useEffect(() => {
			if (ref && typeof ref === "object" && ref.current) {
				ref.current.indeterminate = indeterminate;
			}
		}, [indeterminate, ref]);

		return (
			<div className={containerClasses}>
				{/* 复选框 */}
				<input
					ref={ref}
					id={checkboxId}
					type='checkbox'
					className={cn(
						"peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						"data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
					)}
					disabled={disabled}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={
						[description ? descriptionId : null, error ? errorId : null]
							.filter(Boolean)
							.join(" ") || undefined
					}
					{...props}
				/>

				{/* 标签和描述 */}
				{(label || description) && (
					<div className='flex-1'>
						{/* 标签 */}
						{label && (
							<label
								htmlFor={checkboxId}
								className={cn(
									"block font-medium",
									disabled ? "text-muted-foreground" : "text-foreground",
									sizeStyles[size].text,
									"cursor-pointer"
								)}
							>
								{label}
							</label>
						)}

						{/* 描述 */}
						{description && !error && (
							<p
								id={descriptionId}
								className={cn(
									"mt-1",
									disabled ? "text-muted-foreground/80" : "text-muted-foreground",
									sizeStyles[size].description
								)}
							>
								{description}
							</p>
						)}

						{/* 错误信息 */}
						{error && (
							<p
								id={errorId}
								className={`mt-1 text-red-600 ${sizeStyles[size].description}`}
								role='alert'
							>
								{error}
							</p>
						)}
					</div>
				)}
			</div>
		);
	}
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
