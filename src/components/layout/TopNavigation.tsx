"use client";

import React from "react";

interface TopNavigationProps {
	currentPage: "components" | "animations" | "typography";
}

const TopNavigation: React.FC<TopNavigationProps> = ({ currentPage }) => {
	const navItems = [
		{
			key: "components",
			label: "组件展示",
			href: "/ui-showcase/components",
			color: "brand",
		},
		{
			key: "animations",
			label: "动画效果",
			href: "/ui-showcase/animations",
			color: "accent-purple",
		},
		{
			key: "typography",
			label: "字体系统",
			href: "/ui-showcase/typography",
			color: "accent-green",
		},
	];

	return (
		<div className='bg-white border-b border-gray-200 sticky top-0 z-50'>
			<div className='container mx-auto px-6 py-4'>
				<div className='flex items-center justify-between'>
					<a
						href='/ui-showcase'
						className='flex items-center text-brand-600 hover:text-brand-700 font-semibold text-lg no-underline transition-colors duration-200'
					>
						<svg
							className='w-5 h-5 mr-2 transition-transform duration-200 group-hover:-translate-x-1'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M10 19l-7-7m0 0l7-7m-7 7h18'
							/>
						</svg>
						返回主页
					</a>

					<nav className='hidden md:flex items-center space-x-6'>
						{navItems.map(item => {
							const isActive = currentPage === item.key;
							return (
								<a
									key={item.key}
									href={item.href}
									className={`px-3 py-2 text-sm font-medium rounded-lg no-underline transition-all duration-200 ${
										isActive
											? `text-${item.color}-600 bg-${item.color}-50 shadow-sm`
											: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
									}`}
								>
									{item.label}
								</a>
							);
						})}
					</nav>

					{/* 移动端菜单按钮 */}
					<button className='md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M4 6h16M4 12h16M4 18h16'
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default TopNavigation;
