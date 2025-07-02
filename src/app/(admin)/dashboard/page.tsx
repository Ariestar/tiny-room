import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function DashboardPage() {
	// 模拟统计数据
	const stats = [
		{
			title: "博客文章",
			value: "24",
			change: "+3",
			changeType: "increase" as const,
			icon: (
				<svg
					className='w-8 h-8 text-emerald-600'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
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
			title: "项目作品",
			value: "12",
			change: "+2",
			changeType: "increase" as const,
			icon: (
				<svg
					className='w-8 h-8 text-blue-600'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
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
			title: "图片",
			value: "186",
			change: "+15",
			changeType: "increase" as const,
			icon: (
				<svg
					className='w-8 h-8 text-purple-600'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
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
			title: "总访问量",
			value: "2,847",
			change: "+12%",
			changeType: "increase" as const,
			icon: (
				<svg
					className='w-8 h-8 text-orange-600'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
					/>
				</svg>
			),
		},
	];

	const recentActivities = [
		{ type: "blog", action: "发布新文章", item: "《现代前端开发趋势》", time: "2小时前" },
		{ type: "project", action: "更新项目", item: "个人网站重构", time: "1天前" },
		{ type: "gallery", action: "上传图片", item: "设计作品集", time: "2天前" },
		{ type: "blog", action: "编辑文章", item: "《TypeScript最佳实践》", time: "3天前" },
	];

	return (
		<div className='space-y-8'>
			{/* 页面标题 */}
			<div className='border-b border-brand-200 pb-4'>
				<h1 className='text-3xl font-bold text-brand-900'>仪表板概览</h1>
				<p className='text-brand-600 mt-2'>欢迎回来！这里是您网站的总体概况。</p>
			</div>

			{/* 统计卡片 */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{stats.map((stat, index) => (
					<Card
						key={index}
						variant='elevated'
						className='hover:shadow-large transition-shadow duration-300'
					>
						<CardContent className='p-6'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-sm font-medium text-brand-600'>
										{stat.title}
									</p>
									<div className='flex items-baseline mt-2'>
										<p className='text-2xl font-bold text-brand-900'>
											{stat.value}
										</p>
										<span className='ml-2 text-sm font-medium text-emerald-600'>
											{stat.change}
										</span>
									</div>
								</div>
								<div className='p-3 bg-brand-50 rounded-xl'>{stat.icon}</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* 最近活动 */}
				<Card variant='elevated'>
					<CardHeader>
						<CardTitle>最近活动</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{recentActivities.map((activity, index) => (
								<div
									key={index}
									className='flex items-center space-x-4 p-3 hover:bg-brand-50 rounded-lg transition-colors'
								>
									<div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0'></div>
									<div className='flex-1 min-w-0'>
										<p className='text-sm font-medium text-brand-900 truncate'>
											{activity.action}
										</p>
										<p className='text-sm text-brand-600 truncate'>
											{activity.item}
										</p>
									</div>
									<span className='text-xs text-brand-500 whitespace-nowrap'>
										{activity.time}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* 快速操作 */}
				<Card variant='elevated'>
					<CardHeader>
						<CardTitle>快速操作</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4'>
							<a
								href='/dashboard/blog'
								className='group p-4 border-2 border-brand-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200'
							>
								<div className='text-blue-600 mb-2'>
									<svg
										className='w-8 h-8'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M12 4v16m8-8H4'
										/>
									</svg>
								</div>
								<h3 className='font-semibold text-brand-900 group-hover:text-blue-700'>
									新建文章
								</h3>
								<p className='text-sm text-brand-600'>创建新的博客文章</p>
							</a>

							<a
								href='/dashboard/projects'
								className='group p-4 border-2 border-brand-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200'
							>
								<div className='text-emerald-600 mb-2'>
									<svg
										className='w-8 h-8'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
										/>
									</svg>
								</div>
								<h3 className='font-semibold text-brand-900 group-hover:text-emerald-700'>
									添加项目
								</h3>
								<p className='text-sm text-brand-600'>展示新的项目作品</p>
							</a>

							<a
								href='/dashboard/gallery'
								className='group p-4 border-2 border-brand-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200'
							>
								<div className='text-purple-600 mb-2'>
									<svg
										className='w-8 h-8'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
								</div>
								<h3 className='font-semibold text-brand-900 group-hover:text-purple-700'>
									上传图片
								</h3>
								<p className='text-sm text-brand-600'>管理图片画廊</p>
							</a>

							<a
								href='/dashboard/settings'
								className='group p-4 border-2 border-brand-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200'
							>
								<div className='text-orange-600 mb-2'>
									<svg
										className='w-8 h-8'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
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
								</div>
								<h3 className='font-semibold text-brand-900 group-hover:text-orange-700'>
									系统设置
								</h3>
								<p className='text-sm text-brand-600'>配置网站选项</p>
							</a>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
