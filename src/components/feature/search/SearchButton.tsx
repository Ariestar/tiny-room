"use client";

import React from "react";

interface SearchButtonProps {
	onClick: () => void;
	className?: string;
}

export function SearchButton({ onClick, className = "" }: SearchButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border border-border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
			aria-label='搜索文章'
		>
			<svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth={2}
					d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
				/>
			</svg>
			<span className='text-sm'>搜索...</span>
			<div className='flex items-center space-x-1'>
				<kbd className='px-1.5 py-0.5 text-xs bg-background border border-border rounded'>
					⌘
				</kbd>
				<kbd className='px-1.5 py-0.5 text-xs bg-background border border-border rounded'>
					K
				</kbd>
			</div>
		</button>
	);
}
