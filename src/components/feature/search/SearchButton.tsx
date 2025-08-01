"use client";

import React from "react";
import { cn } from '@/lib/shared/utils';

interface SearchButtonProps {
	onClick: () => void;
	className?: string;
	showIcon?: boolean;
	showText?: boolean;
	showShortcut?: boolean;
}

export function SearchButton({
	onClick,
	className,
	showIcon = true,
	showText = false,
	showShortcut = false
}: SearchButtonProps) {

	if (!showIcon && !showText && !showShortcut) {
		return null; // Don't render anything if all flags are false
	}

	return (
		<button
			onClick={onClick}
			className={cn(
				"flex items-center text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
				{
					// Style for button with text
					"space-x-2 px-3 py-2 text-sm": showText,
					// Style for icon-only button
					"h-10 w-10 justify-center": !showText && showIcon,
					"w-full space-x-2": showIcon && showShortcut
				},
				className
			)}
			aria-label='搜索文章'
		>
			{/* Icon is conditionally visible */}
			{showIcon && (
				<svg className='w-4 h-4 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
					/>
				</svg>
			)}

			{/* Text is conditionally visible */}
			{showText && (
				<span className='text-sm'>搜索...</span>
			)}

			{/* Shortcut is conditionally visible */}
			{showShortcut && (
				<div className='flex items-center space-x-1 ml-auto'>
					<kbd className='px-1.5 py-0.5 text-xs bg-background border border-border rounded'>
						⌘
					</kbd>
					<kbd className='px-1.5 py-0.5 text-xs bg-background border border-border rounded'>
						K
					</kbd>
				</div>
			)}
		</button>
	);
}
