"use client";

import React from "react";
import { TopNavigation } from "@/components/ui";

export default function TypographyPage() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<TopNavigation currentPage='typography' />

			<main className='bg-gray-50'>
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
				<section className='py-16 bg-gray-50'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>标题层次系统</h2>

							<div className='space-y-8'>
								<div>
									<h1>H1 - 主标题 / Main Heading</h1>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										4xl → 5xl → 6xl (responsive) | font-bold | tracking-tight
									</p>
								</div>

								<div>
									<h2>H2 - 章节标题 / Section Heading</h2>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										3xl → 4xl → 5xl (responsive) | font-bold | tracking-tight
									</p>
								</div>

								<div>
									<h3>H3 - 子章节标题 / Subsection Heading</h3>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										2xl → 3xl → 4xl (responsive) | font-semibold |
										tracking-tight
									</p>
								</div>

								<div>
									<h4>H4 - 组件标题 / Component Heading</h4>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										xl → 2xl → 3xl (responsive) | font-semibold | tracking-tight
									</p>
								</div>

								<div>
									<h5>H5 - 小组件标题 / Small Component Heading</h5>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										lg → xl → 2xl (responsive) | font-medium
									</p>
								</div>

								<div>
									<h6>H6 - 最小标题 / Minimal Heading</h6>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										base → lg → xl (responsive) | font-medium
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 段落文本演示 */}
				<section className='py-16 bg-white'>
					<div className='container-prose'>
						<div className='bg-gray-50 rounded-3xl p-8'>
							<h2 className='mb-8 text-display'>段落文本系统</h2>

							<div className='space-y-8'>
								<div>
									<h3 className='mb-4'>标准段落</h3>
									<p>
										这是标准段落文本的演示。我们使用了优化的行高（leading-relaxed）和最大宽度（65ch）
										来确保最佳的阅读体验。字体大小在移动设备上为
										16px，在桌面设备上为 18px， 提供了良好的响应式体验。
									</p>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										base → lg (responsive) | text-gray-600 | leading-relaxed |
										max-width: 65ch
									</p>
								</div>

								<div>
									<h3 className='mb-4'>大号段落文本</h3>
									<p className='text-lg md:text-xl text-gray-700'>
										这是大号段落文本，通常用于重要说明、引言或需要强调的内容。
										它使用了更大的字号和稍深的颜色来吸引读者注意。
									</p>
									<p className='text-sm text-gray-500 font-mono mt-2'>
										lg → xl (responsive) | text-gray-700 | leading-relaxed
									</p>
								</div>

								<div>
									<h3 className='mb-4'>小号辅助文本</h3>
									<p className='text-sm text-gray-500'>
										这是小号辅助文本，通常用于说明、标签、时间戳等次要信息。
										使用了较浅的颜色以降低视觉权重。
									</p>
									<p className='text-xs text-gray-400 font-mono mt-2'>
										text-sm | text-gray-500
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 特殊文本效果 */}
				<section className='py-16 bg-gray-50'>
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
										<a href='#' className='text-brand-600 hover:text-brand-700'>
											标准链接
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
										hover时显示 2px 下划线，偏移 4px
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 代码和引用 */}
				<section className='py-16 bg-white'>
					<div className='container-prose'>
						<div className='bg-gray-50 rounded-3xl p-8'>
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
									<blockquote>
										&ldquo;设计不仅仅是它看起来的样子和感觉如何。设计是它如何工作的。&rdquo;
										<br />— 史蒂夫·乔布斯
									</blockquote>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* 列表样式 */}
				<section className='py-16 bg-gray-50'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>列表样式</h2>

							<div className='grid md:grid-cols-2 gap-8'>
								<div>
									<h3 className='mb-4'>无序列表</h3>
									<ul className='list-disc pl-6 space-y-2'>
										<li>现代化设计系统</li>
										<li>响应式排版</li>
										<li>可访问性优化</li>
										<li>高品质视觉效果</li>
									</ul>
								</div>

								<div>
									<h3 className='mb-4'>有序列表</h3>
									<ol className='list-decimal pl-6 space-y-2'>
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
				<section className='py-16 bg-white'>
					<div className='container-prose'>
						<div className='bg-gray-50 rounded-3xl p-8'>
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
				<section className='py-16 bg-gray-50'>
					<div className='container-prose'>
						<div className='bg-white rounded-3xl p-8 shadow-soft'>
							<h2 className='mb-8 text-display'>表单元素样式</h2>

							<div className='space-y-4 max-w-md'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										邮箱地址
									</label>
									<input
										type='email'
										className='input'
										placeholder='your@email.com'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
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
				<section className='py-16 bg-white'>
					<div className='container-wide'>
						<div className='bg-gray-50 rounded-3xl p-8'>
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
				<section className='py-16 bg-gray-50'>
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
