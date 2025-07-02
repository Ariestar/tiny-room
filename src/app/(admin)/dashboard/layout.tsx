import Link from "next/link";
import { Navigation } from "@/components/ui";
import type { NavigationItem } from "@/components/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const navigationItems: NavigationItem[] = [
		{
			id: "overview",
			label: "概览",
			href: "/dashboard",
			icon: (
				<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
					/>
				</svg>
			),
		},
		{
			id: "blog",
			label: "博客管理",
			href: "/dashboard/blog",
			icon: (
				<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
					/>
				</svg>
			),
		},
		{
			id: "projects",
			label: "项目管理",
			href: "/dashboard/projects",
			icon: (
				<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
					/>
				</svg>
			),
		},
		{
			id: "gallery",
			label: "图库管理",
			href: "/dashboard/gallery",
			icon: (
				<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
					/>
				</svg>
			),
		},
		{
			id: "settings",
			label: "系统设置",
			href: "/dashboard/settings",
			icon: (
				<svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
					/>
				</svg>
			),
		},
	];

	return (
		<div className='min-h-screen bg-brand-50'>
			{/* Dashboard Header */}
			<header className='bg-white border-b border-brand-200 px-6 py-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<Link
							href='/'
							className='text-2xl font-bold text-brand-800 hover:text-brand-600 transition-colors'
						>
							Tiny Room
						</Link>
						<span className='text-brand-400'>/</span>
						<span className='text-brand-600 font-semibold'>管理后台</span>
					</div>
					<div className='flex items-center space-x-4'>
						<Link
							href='/'
							className='px-4 py-2 text-brand-600 hover:text-brand-800 hover:bg-brand-100 rounded-lg transition-colors'
						>
							返回前台
						</Link>
					</div>
				</div>
			</header>

			<div className='flex'>
				{/* Sidebar */}
				<aside className='w-64 bg-white border-r border-brand-200 min-h-[calc(100vh-73px)]'>
					<nav className='p-4'>
						<Navigation
							items={navigationItems}
							variant='vertical'
							className='space-y-2'
						/>
					</nav>
				</aside>

				{/* Main Content */}
				<main className='flex-1 p-8'>
					<div className='max-w-7xl mx-auto'>{children}</div>
				</main>
			</div>
		</div>
	);
}
