"use client";

import React from "react";
import TopNavigation from "@/components/layout/TopNavigation";
import { PageTransition } from "@/components/animation/PageTransition";
import { Input } from "@/components/ui";

export default function TypographyPage() {
	return (
		<div className='min-h-screen bg-background'>
			<TopNavigation currentPage='typography' />

			<main className='bg-card'>
				{/* 头部区域 */}
				<section className='py-24 bg-white'>
					<div className='container-wide'>
						<div className='text-center mb-16'>
							<h1 className='mb-6 text-display'>Vercel 风格排版系统</h1>
							<p className='text-xl text-gray-600 max-w-3xl mx-auto'>
								现代化、响应式、可访问的排版设计，为优质用户体验而生
							</p>
						</div>
					</div>
				</section>

				{/* 标题演示 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>标题层次系统</h2>

							<div className='space-y-8'>
								<div>
									<h1 className='text-5xl font-bold'>Typography Showcase (H1)</h1>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-bold | text-5xl
									</p>
								</div>

								<div>
									<h2 className='text-4xl font-semibold'>
										Section Heading (H2) - Emphasized
									</h2>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-semibold | text-4xl
									</p>
								</div>

								<div>
									<h3 className='text-3xl font-medium'>
										Sub-section Heading (H3)
									</h3>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-medium | text-3xl
									</p>
								</div>

								<div>
									<h4 className='text-2xl font-medium'>Component Title (H4)</h4>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-medium | text-2xl
									</p>
								</div>

								<div>
									<h5 className='text-xl font-medium'>Card Title (H5)</h5>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-medium | text-xl
									</p>
								</div>

								<div>
									<h6 className='text-lg font-medium'>Item Title (H6)</h6>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										font-medium | text-lg
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 段落文本演示 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8'>
							<h2 className='mb-8 text-display'>段落文本系统</h2>

							<div className='space-y-8'>
								<div>
									<h3 className='mb-4'>标准段落</h3>
									<p className='text-base md:text-lg text-foreground'>
										This is the primary body text, used for main content
										paragraphs. It is designed for maximum readability and
										comfort over long reading sessions. The quick brown fox
										jumps over the lazy dog.
									</p>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										base → lg (responsive) | text-foreground | leading-relaxed |
									</p>
								</div>

								<div>
									<h3 className='mb-4'>大号段落文本</h3>
									<p className='text-lg md:text-xl text-foreground/90'>
										This is a larger body text, suitable for introductory
										paragraphs or stand-out quotes. Its increased size provides
										more emphasis.
									</p>
									<p className='text-sm text-muted-foreground font-mono mt-2'>
										lg → xl (responsive) | text-foreground/90 | leading-relaxed
									</p>
								</div>

								<div>
									<h3 className='mb-4'>小号辅助文本</h3>
									<p className='text-sm text-muted-foreground'>
										This is muted text, used for secondary information,
										captions, or less important details that should not distract
										from the main content.
									</p>
									<p className='text-xs text-muted-foreground/80 font-mono mt-2'>
										text-sm | text-muted-foreground
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 特殊文本效果 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>特殊文本效果</h2>

							<div className='grid md:grid-cols-2 gap-8'>
								<div>
									<h3 className='mb-4'>渐变文本</h3>
									<h4 className='text-gradient mb-2'>品牌渐变效果</h4>
									<h4 className='text-gradient-accent mb-4'>强调渐变效果</h4>
									<h4 className='gradient-text-animated'>动态渐变效果</h4>
									<p className='text-sm text-gray-500 font-mono mt-4'>
										.text-gradient | .text-gradient-accent |
										.gradient-text-animated
									</p>
								</div>

								<div>
									<h3 className='mb-4'>链接样式</h3>
									<p>
										这里有一个{" "}
										<a
											href='#'
											className='text-primary underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-ring'
										>
											This is a standard hyperlink
										</a>
										， 悬停时会显示下划线效果。还有一个
										<a
											href='#'
											className='text-accent-purple-600 hover:text-accent-purple-700'
										>
											{" "}
											强调链接
										</a>
										。
									</p>
									<p className='text-sm text-gray-500 font-mono mt-4'>
										text-primary | underline-offset-4 | hover:underline
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 代码和引用 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8'>
							<h2 className='mb-8 text-display'>代码与引用</h2>

							<div className='space-y-8'>
								<div>
									<h3 className='mb-4'>内联代码</h3>
									<p>
										使用 <code>npm install</code> 命令安装依赖，然后运行{" "}
										<code>npm run dev</code> 启动开发服务器。 TypeScript
										类型定义通过 <code>interface User</code> 来声明。
									</p>
								</div>

								<div>
									<h3 className='mb-4'>代码块</h3>
									<pre>
										<code>{`function createUser(name: string): User {
  return {
    id: Math.random(),
    name,
    createdAt: new Date()
  };
}`}</code>
									</pre>
								</div>

								<div>
									<h3 className='mb-4'>引用块</h3>
									<blockquote className='border-l-4 border-border pl-4 italic text-muted-foreground'>
										"The only way to do great work is to love what you do."
									</blockquote>
									<footer className='mt-2 text-sm text-right text-muted-foreground'>
										- Steve Jobs
									</footer>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 列表样式 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>列表样式</h2>

							<div className='grid md:grid-cols-2 gap-8'>
								<div>
									<h3 className='mb-4'>无序列表</h3>
									<ul className='list-disc pl-6 space-y-2 text-foreground'>
										<li>现代化设计系统</li>
										<li>响应式排版</li>
										<li>可访问性优化</li>
										<li>高品质视觉效果</li>
									</ul>
								</div>

								<div>
									<h3 className='mb-4'>有序列表</h3>
									<ol className='list-decimal pl-6 space-y-2 text-foreground'>
										<li>设置项目基础结构</li>
										<li>配置设计系统</li>
										<li>实现核心组件</li>
										<li>优化用户体验</li>
									</ol>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 按钮样式演示 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8'>
							<h2 className='mb-8 text-display'>按钮组件样式</h2>

							<div className='flex flex-wrap gap-4 mb-6'>
								<button className='btn-primary'>主要按钮</button>
								<button className='btn-secondary'>次要按钮</button>
								<button className='btn-ghost'>幽灵按钮</button>
							</div>

							<div className='flex flex-wrap gap-4'>
								<button className='btn-primary px-6 py-3 text-lg'>大号按钮</button>
								<button className='btn-secondary px-3 py-2 text-sm'>
									小号按钮
								</button>
							</div>
						</div>
					</div>
				</section>

				{/* 输入框样式演示 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>表单元素样式</h2>

							<div className='space-y-4 max-w-md'>
								<div>
									<label className='block text-sm font-medium text-foreground mb-2'>
										邮箱地址
									</label>
									<input
										type='email'
										className='input'
										placeholder='your@email.com'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-muted-foreground mb-2'>
										消息内容
									</label>
									<textarea
										className='input min-h-[100px] resize-y'
										placeholder='请输入您的消息...'
									></textarea>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 容器演示 */}
				<section className='py-16 bg-card'>
					<div className='container-wide'>
						<div className='bg-white rounded-3xl p-8'>
							<h2 className='mb-8 text-display text-center'>容器系统演示</h2>

							<div className='space-y-8'>
								<div className='container-narrow bg-white rounded-2xl p-6'>
									<h3>窄容器 (max-width: 672px)</h3>
									<p>适用于文章内容、表单等需要专注阅读的场景。</p>
								</div>

								<div className='container-prose bg-white rounded-2xl p-6'>
									<h3>文章容器 (max-width: 896px)</h3>
									<p>适用于博客文章、长文档等需要良好阅读体验的内容。</p>
								</div>

								<div className='bg-white rounded-2xl p-6'>
									<h3>宽容器 (max-width: 1280px)</h3>
									<p>
										适用于首页、产品展示等需要更多空间的布局。当前这个演示就使用了宽容器。
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 分隔线演示 */}
				<section className='py-16 bg-card'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>分隔线样式</h2>
							<p>上面的内容</p>
							<hr />
							<p>下面的内容，使用了渐变分隔线效果</p>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
