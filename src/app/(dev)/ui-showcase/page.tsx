import { ArrowRight, Component, Type, Sparkles } from "lucide-react";

export default function Home() {
	return (
		<main className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			{/* Hero Section - 展示设计系统 */}
			<section className='relative overflow-hidden'>
				{/* 背景装饰 */}
				<div className='absolute inset-0 bg-gradient-primary opacity-5'></div>
				<div className='absolute top-20 left-20 w-64 h-64 bg-gradient-accent rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float'></div>
				<div
					className='absolute bottom-20 right-20 w-48 h-48 bg-brand-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float'
					style={{ animationDelay: "1s" }}
				></div>

				<div className='relative max-w-7xl mx-auto px-6 py-24'>
					{/* 主标题区域 */}
					<div className='text-center'>
						<div
							className='inline-flex items-center px-4 py-2 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-medium text-sm mb-8 opacity-0 animate-slide-down'
							style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
						>
							<span className='w-2 h-2 bg-brand-500 rounded-full mr-2 animate-pulse'></span>
							现代化设计系统已启用
						</div>

						<h1
							className='text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 opacity-0 animate-slide-up font-display'
							style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
						>
							Tiny Room
						</h1>

						<p
							className='text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in'
							style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
						>
							一个集展示、管理、分析于一体的现代个人网站。
						</p>

						{/* CTA 按钮组 */}
						<div className='flex justify-center mt-8 space-x-4 animate-fade-in'>
							<a
								href='/ui-showcase/components'
								className='group px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold transition-all duration-300 shadow-soft hover:shadow-medium animate-button-press active:animate-button-press no-underline'
							>
								<span className='flex items-center'>
									查看组件
									<ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300' />
								</span>
							</a>
							<a
								href='https://github.com'
								target='_blank'
								rel='noopener noreferrer'
								className='px-8 py-4 border-2 border-border hover:border-primary text-foreground hover:text-primary-foreground rounded-2xl font-semibold transition-all duration-300 hover:bg-primary hover:scale-[0.98] no-underline'
							>
								GitHub
							</a>
						</div>
					</div>
				</div>
			</section>

			{/* 导航菜单区 */}
			<section className='py-16 bg-gray-50 border-t border-gray-200'>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl font-bold text-gray-900 mb-4 font-display'>
							UI 组件展示
						</h2>
						<p className='text-lg text-gray-600'>探索我们的设计系统和组件库</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto'>
						{/* 组件展示卡片 */}
						<a
							href='/ui-showcase/components'
							className='group bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] no-underline border border-border opacity-0 animate-slide-up'
							style={{ animationDelay: "0.9s", animationFillMode: "forwards" }}
						>
							<div className='w-16 h-16 bg-gradient-primary rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
								<svg
									className='w-8 h-8 text-white'
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
							<h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors'>
								组件展示
							</h3>
							<p className='text-gray-600 leading-relaxed'>
								Button、Input、Card 等基础组件和高级组件的完整展示
							</p>
						</a>

						{/* Timeline展示卡片 */}
						<a
							href='/ui-showcase/timeline'
							className='group bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] no-underline border border-border opacity-0 animate-slide-up'
							style={{ animationDelay: "1.0s", animationFillMode: "forwards" }}
						>
							<div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
								<svg
									className='w-8 h-8 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors'>
								时间线
							</h3>
							<p className='text-gray-600 leading-relaxed'>
								美化后的博客时间线组件，展示文章的时间轴布局
							</p>
						</a>

						{/* 动画效果卡片 */}
						<a
							href='/ui-showcase/animations'
							className='group bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] no-underline border border-border opacity-0 animate-slide-up'
							style={{ animationDelay: "1.1s", animationFillMode: "forwards" }}
						>
							<div className='w-16 h-16 bg-gradient-accent rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
								<svg
									className='w-8 h-8 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M13 10V3L4 14h7v7l9-11h-7z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-accent-purple-600 transition-colors'>
								动画效果
							</h3>
							<p className='text-gray-600 leading-relaxed'>
								Framer Motion 动画系统，包含过渡、手势和复杂动画效果
							</p>
						</a>

						{/* 字体系统卡片 */}
						<a
							href='/ui-showcase/typography'
							className='group bg-white rounded-3xl p-8 shadow-soft hover:shadow-medium transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] no-underline border border-border opacity-0 animate-slide-up'
							style={{ animationDelay: "1.3s", animationFillMode: "forwards" }}
						>
							<div className='w-16 h-16 bg-accent-green-500 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
								<svg
									className='w-8 h-8 text-white'
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
							</div>
							<h3 className='text-xl font-semibold text-gray-900 mb-3 group-hover:text-accent-green-600 transition-colors'>
								字体系统
							</h3>
							<p className='text-gray-600 leading-relaxed'>
								完整的字体层级、间距规范和可读性优化展示
							</p>
						</a>
					</div>
				</div>
			</section>

			{/* 设计系统展示区 */}
			<section className='py-24 bg-white'>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl font-bold text-gray-900 mb-4 font-display'>
							设计系统预览
						</h2>
						<p className='text-lg text-gray-600'>
							现代化、创新、美观的 Vercel 风格设计语言
						</p>
					</div>

					{/* 配色方案展示 */}
					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16'>
						{/* 灰度系统 */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>灰度系统</h3>
							<div className='space-y-2'>
								{[50, 100, 200, 400, 600, 900].map(shade => (
									<div key={shade} className='flex items-center space-x-3'>
										<div
											className={`w-8 h-8 rounded-lg bg-gray-${shade} border border-border`}
										></div>
										<span className='text-sm font-mono text-gray-600'>
											gray-{shade}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* 品牌色 */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>品牌色系</h3>
							<div className='space-y-2'>
								{[100, 300, 500, 700, 900].map(shade => (
									<div key={shade} className='flex items-center space-x-3'>
										<div
											className={`w-8 h-8 rounded-lg bg-brand-${shade} border border-border`}
										></div>
										<span className='text-sm font-mono text-gray-600'>
											brand-{shade}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* 强调色 - 紫色 */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>紫色系</h3>
							<div className='space-y-2'>
								{[100, 300, 500, 700, 900].map(shade => (
									<div key={shade} className='flex items-center space-x-3'>
										<div
											className={`w-8 h-8 rounded-lg bg-accent-purple-${shade} border border-border`}
										></div>
										<span className='text-sm font-mono text-gray-600'>
											purple-{shade}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* 强调色 - 粉色 */}
						<div className='space-y-4'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>粉色系</h3>
							<div className='space-y-2'>
								{[100, 300, 500, 700, 900].map(shade => (
									<div key={shade} className='flex items-center space-x-3'>
										<div
											className={`w-8 h-8 rounded-lg bg-accent-pink-${shade} border border-border`}
										></div>
										<span className='text-sm font-mono text-gray-600'>
											pink-{shade}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* 组件演示区 */}
					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* 卡片组件演示 */}
						<div className='bg-white rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
							<div className='w-12 h-12 bg-gradient-primary rounded-2xl mb-4 flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
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
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>博客文章</h3>
							<p className='text-gray-600'>展示文章列表和内容管理功能</p>
						</div>

						<div className='bg-white rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
							<div className='w-12 h-12 bg-gradient-accent rounded-2xl mb-4 flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>项目展示</h3>
							<p className='text-gray-600'>GitHub 项目集成和技术栈展示</p>
						</div>

						<div className='bg-white rounded-3xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-card-hover cursor-pointer border border-border'>
							<div className='w-12 h-12 bg-accent-green-500 rounded-2xl mb-4 flex items-center justify-center'>
								<svg
									className='w-6 h-6 text-white'
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
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>图片画廊</h3>
							<p className='text-gray-600'>精美的图片展示和管理系统</p>
						</div>
					</div>
				</div>
			</section>

			{/* 技术栈展示 */}
			<section className='py-24 bg-gray-50'>
				<div className='max-w-7xl mx-auto px-6'>
					<div className='text-center mb-16'>
						<h2 className='text-4xl font-bold text-gray-900 mb-4 font-display'>
							现代化技术栈
						</h2>
						<p className='text-lg text-gray-600'>生产级代码，企业级标准</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{[
							{ name: "Next.js 15", color: "brand", icon: "⚡" },
							{ name: "TypeScript", color: "accent-purple", icon: "🔷" },
							{ name: "Tailwind CSS", color: "accent-green", icon: "🎨" },
							{ name: "Framer Motion", color: "accent-pink", icon: "✨" },
						].map(tech => (
							<div
								key={tech.name}
								className='text-center p-6 bg-white rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1'
							>
								<div className='text-4xl mb-4'>{tech.icon}</div>
								<h3 className='font-semibold text-gray-900'>{tech.name}</h3>
							</div>
						))}
					</div>
				</div>
			</section>
		</main>
	);
}
