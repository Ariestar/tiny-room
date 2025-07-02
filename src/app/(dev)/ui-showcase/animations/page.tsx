"use client";

import React, { useState } from "react";
import {
	Button,
	AnimatedDiv,
	FadeIn,
	SlideUp,
	SlideDown,
	SlideLeft,
	SlideRight,
	ScaleIn,
	BounceIn,
	RotateIn,
	AnimatedList,
	StaggerList,
	CascadeList,
	WaveList,
	ScaleList,
	RotateList,
	PageTransition,
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Badge,
	TopNavigation,
} from "@/components/ui";
import { Play, Pause, RotateCcw, Sparkles, Zap, Star, Heart, Code } from "lucide-react";

export default function AnimationsPage() {
	const [isPlaying, setIsPlaying] = useState(true);
	const [selectedDemo, setSelectedDemo] = useState<string>("basic");

	// 示例数据
	const demoItems = [
		{ id: 1, title: "项目 Alpha", description: "现代化的React应用", color: "bg-blue-500" },
		{ id: 2, title: "项目 Beta", description: "Vue.js仪表板", color: "bg-green-500" },
		{ id: 3, title: "项目 Gamma", description: "Next.js博客系统", color: "bg-purple-500" },
		{ id: 4, title: "项目 Delta", description: "TypeScript工具库", color: "bg-orange-500" },
		{ id: 5, title: "项目 Epsilon", description: "Tailwind UI组件", color: "bg-pink-500" },
	];

	const animationSections = [
		{
			id: "basic",
			title: "基础动画",
			description: "展示基本的进入动画效果",
			icon: <Sparkles className='h-5 w-5' />,
		},
		{
			id: "list",
			title: "列表动画",
			description: "交错动画和列表过渡效果",
			icon: <Zap className='h-5 w-5' />,
		},
		{
			id: "interaction",
			title: "交互动画",
			description: "按钮悬停和点击动画",
			icon: <Star className='h-5 w-5' />,
		},
		{
			id: "advanced",
			title: "高级动画",
			description: "复杂的组合动画效果",
			icon: <Code className='h-5 w-5' />,
		},
	];

	const resetAnimations = () => {
		setIsPlaying(false);
		setTimeout(() => setIsPlaying(true), 50);
	};

	return (
		<PageTransition transitionType='slideUp'>
			<div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
				<TopNavigation currentPage='animations' />

				{/* 页面头部 */}
				<div className='bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-16 z-40'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
						<FadeIn>
							<div className='flex items-center justify-between'>
								<div>
									<h1 className='text-3xl font-bold bg-gradient-to-r from-brand-600 to-accent-purple-600 bg-clip-text text-transparent'>
										Framer Motion 动画展示
									</h1>
									<p className='text-gray-600 mt-2'>探索流畅、现代的动画效果</p>
								</div>
								<div className='flex items-center gap-3'>
									<Button
										variant={isPlaying ? "primary" : "secondary"}
										size='sm'
										leftIcon={
											isPlaying ? (
												<Pause className='h-4 w-4' />
											) : (
												<Play className='h-4 w-4' />
											)
										}
										onClick={() => setIsPlaying(!isPlaying)}
									>
										{isPlaying ? "暂停" : "播放"}
									</Button>
									<Button
										variant='outline'
										size='sm'
										leftIcon={<RotateCcw className='h-4 w-4' />}
										onClick={resetAnimations}
									>
										重置
									</Button>
								</div>
							</div>
						</FadeIn>
					</div>
				</div>

				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
						{/* 侧边导航 */}
						<div className='lg:col-span-1'>
							<SlideLeft delay={0.2}>
								<div className='bg-white rounded-2xl shadow-soft border border-gray-200 p-6 sticky top-24'>
									<h3 className='font-semibold text-gray-900 mb-4'>动画类型</h3>
									<nav className='space-y-2'>
										{animationSections.map((section, index) => (
											<FadeIn key={section.id} delay={0.1 + index * 0.1}>
												<button
													onClick={() => setSelectedDemo(section.id)}
													className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
														selectedDemo === section.id
															? "bg-brand-50 text-brand-700 border border-brand-200"
															: "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
													}`}
												>
													<div className='flex items-center gap-3'>
														{section.icon}
														<div>
															<div className='font-medium'>
																{section.title}
															</div>
															<div className='text-sm opacity-75'>
																{section.description}
															</div>
														</div>
													</div>
												</button>
											</FadeIn>
										))}
									</nav>
								</div>
							</SlideLeft>
						</div>

						{/* 主要内容区域 */}
						<div className='lg:col-span-3'>
							<div className='space-y-8'>
								{/* 基础动画演示 */}
								{selectedDemo === "basic" && (
									<SlideUp key='basic-demo'>
										<Card className='p-8'>
											<CardHeader>
												<CardTitle>基础进入动画</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
													{/* 淡入 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															淡入动画
														</h4>
														<FadeIn key={`fade-${isPlaying}`}>
															<div className='bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl'>
																<Heart className='h-8 w-8 mb-2' />
																<p>淡入效果</p>
															</div>
														</FadeIn>
													</div>

													{/* 上滑 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															上滑动画
														</h4>
														<SlideUp
															key={`slideup-${isPlaying}`}
															delay={0.1}
														>
															<div className='bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl'>
																<Sparkles className='h-8 w-8 mb-2' />
																<p>上滑效果</p>
															</div>
														</SlideUp>
													</div>

													{/* 缩放 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															缩放动画
														</h4>
														<ScaleIn
															key={`scale-${isPlaying}`}
															delay={0.2}
														>
															<div className='bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl'>
																<Star className='h-8 w-8 mb-2' />
																<p>缩放效果</p>
															</div>
														</ScaleIn>
													</div>

													{/* 弹入 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															弹入动画
														</h4>
														<BounceIn
															key={`bounce-${isPlaying}`}
															delay={0.3}
														>
															<div className='bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl'>
																<Zap className='h-8 w-8 mb-2' />
																<p>弹入效果</p>
															</div>
														</BounceIn>
													</div>

													{/* 旋转进入 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															旋转进入
														</h4>
														<RotateIn
															key={`rotate-${isPlaying}`}
															delay={0.4}
														>
															<div className='bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl'>
																<RotateCcw className='h-8 w-8 mb-2' />
																<p>旋转效果</p>
															</div>
														</RotateIn>
													</div>

													{/* 左滑进入 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															左滑进入
														</h4>
														<SlideLeft
															key={`slideleft-${isPlaying}`}
															delay={0.5}
														>
															<div className='bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl'>
																<Code className='h-8 w-8 mb-2' />
																<p>左滑效果</p>
															</div>
														</SlideLeft>
													</div>
												</div>
											</CardContent>
										</Card>
									</SlideUp>
								)}

								{/* 列表动画演示 */}
								{selectedDemo === "list" && (
									<SlideUp key='list-demo'>
										<Card className='p-8'>
											<CardHeader>
												<CardTitle>列表动画效果</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
													{/* 交错列表 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															交错动画
														</h4>
														<StaggerList
															key={`stagger-${isPlaying}`}
															className='space-y-3'
														>
															{demoItems.map(item => (
																<div
																	key={item.id}
																	className='bg-white border border-gray-200 rounded-xl p-4 shadow-soft'
																>
																	<div className='flex items-center gap-3'>
																		<div
																			className={`w-3 h-3 rounded-full ${item.color}`}
																		></div>
																		<div>
																			<div className='font-medium text-gray-900'>
																				{item.title}
																			</div>
																			<div className='text-sm text-gray-500'>
																				{item.description}
																			</div>
																		</div>
																	</div>
																</div>
															))}
														</StaggerList>
													</div>

													{/* 波浪动画 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															波浪动画
														</h4>
														<WaveList
															key={`wave-${isPlaying}`}
															className='space-y-3'
														>
															{demoItems.map(item => (
																<div
																	key={item.id}
																	className='bg-white border border-gray-200 rounded-xl p-4 shadow-soft'
																>
																	<div className='flex items-center gap-3'>
																		<div
																			className={`w-3 h-3 rounded-full ${item.color}`}
																		></div>
																		<div>
																			<div className='font-medium text-gray-900'>
																				{item.title}
																			</div>
																			<div className='text-sm text-gray-500'>
																				{item.description}
																			</div>
																		</div>
																	</div>
																</div>
															))}
														</WaveList>
													</div>

													{/* 级联动画 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															级联动画
														</h4>
														<CascadeList
															key={`cascade-${isPlaying}`}
															className='space-y-3'
														>
															{demoItems.slice(0, 3).map(item => (
																<div
																	key={item.id}
																	className='bg-white border border-gray-200 rounded-xl p-4 shadow-soft'
																>
																	<div className='flex items-center gap-3'>
																		<div
																			className={`w-3 h-3 rounded-full ${item.color}`}
																		></div>
																		<div>
																			<div className='font-medium text-gray-900'>
																				{item.title}
																			</div>
																			<div className='text-sm text-gray-500'>
																				{item.description}
																			</div>
																		</div>
																	</div>
																</div>
															))}
														</CascadeList>
													</div>

													{/* 缩放列表 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															缩放动画
														</h4>
														<ScaleList
															key={`scalelist-${isPlaying}`}
															className='space-y-3'
														>
															{demoItems.slice(0, 3).map(item => (
																<div
																	key={item.id}
																	className='bg-white border border-gray-200 rounded-xl p-4 shadow-soft'
																>
																	<div className='flex items-center gap-3'>
																		<div
																			className={`w-3 h-3 rounded-full ${item.color}`}
																		></div>
																		<div>
																			<div className='font-medium text-gray-900'>
																				{item.title}
																			</div>
																			<div className='text-sm text-gray-500'>
																				{item.description}
																			</div>
																		</div>
																	</div>
																</div>
															))}
														</ScaleList>
													</div>
												</div>
											</CardContent>
										</Card>
									</SlideUp>
								)}

								{/* 交互动画演示 */}
								{selectedDemo === "interaction" && (
									<SlideUp key='interaction-demo'>
										<Card className='p-8'>
											<CardHeader>
												<CardTitle>交互动画效果</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='space-y-8'>
													{/* 按钮动画 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															按钮动画（悬停和点击试试）
														</h4>
														<div className='flex flex-wrap gap-4'>
															<Button
																variant='primary'
																leftIcon={
																	<Heart className='h-4 w-4' />
																}
															>
																主要按钮
															</Button>
															<Button
																variant='secondary'
																rightIcon={
																	<Star className='h-4 w-4' />
																}
															>
																次要按钮
															</Button>
															<Button
																variant='gradient'
																leftIcon={
																	<Sparkles className='h-4 w-4' />
																}
															>
																渐变按钮
															</Button>
															<Button variant='outline'>
																轮廓按钮
															</Button>
															<Button variant='ghost'>
																幽灵按钮
															</Button>
														</div>
													</div>

													{/* 卡片悬停效果 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															卡片悬停效果
														</h4>
														<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
															{demoItems.slice(0, 3).map(item => (
																<AnimatedDiv
																	key={item.id}
																	animation='scale'
																	className='bg-white border border-gray-200 rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-200 cursor-pointer'
																>
																	<div
																		className={`w-12 h-12 ${item.color} rounded-xl mb-4 flex items-center justify-center`}
																	>
																		<Code className='h-6 w-6 text-white' />
																	</div>
																	<h5 className='font-semibold text-gray-900 mb-2'>
																		{item.title}
																	</h5>
																	<p className='text-gray-600 text-sm'>
																		{item.description}
																	</p>
																	<Badge
																		variant='default'
																		className='mt-3'
																	>
																		项目
																	</Badge>
																</AnimatedDiv>
															))}
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</SlideUp>
								)}

								{/* 高级动画演示 */}
								{selectedDemo === "advanced" && (
									<SlideUp key='advanced-demo'>
										<Card className='p-8'>
											<CardHeader>
												<CardTitle>高级动画组合</CardTitle>
											</CardHeader>
											<CardContent>
												<div className='space-y-8'>
													{/* 复杂组合动画 */}
													<div className='space-y-4'>
														<h4 className='font-semibold text-gray-900'>
															复杂组合动画
														</h4>
														<div className='bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8'>
															<StaggerList
																key={`advanced-${isPlaying}`}
																className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
															>
																{demoItems.map((item, index) => (
																	<AnimatedDiv
																		key={item.id}
																		animation='bounce'
																		delay={index * 0.1}
																		className='group'
																	>
																		<div className='bg-white rounded-xl p-6 shadow-soft group-hover:shadow-strong transition-all duration-300 group-hover:-translate-y-2'>
																			<div className='flex items-center justify-between mb-4'>
																				<div
																					className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
																				>
																					<Star className='h-5 w-5 text-white' />
																				</div>
																				<Badge variant='primary'>
																					#{item.id}
																				</Badge>
																			</div>
																			<h5 className='font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors'>
																				{item.title}
																			</h5>
																			<p className='text-gray-600 text-sm leading-relaxed'>
																				{item.description}
																			</p>
																			<div className='mt-4 pt-4 border-t border-gray-100'>
																				<Button
																					size='sm'
																					variant='ghost'
																					className='group-hover:bg-brand-50'
																				>
																					查看详情
																				</Button>
																			</div>
																		</div>
																	</AnimatedDiv>
																))}
															</StaggerList>
														</div>
													</div>

													{/* 性能信息 */}
													<FadeIn delay={0.5}>
														<div className='bg-gradient-to-r from-brand-50 to-accent-purple-50 border border-brand-200 rounded-xl p-6'>
															<div className='flex items-start gap-4'>
																<div className='w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0'>
																	<Zap className='h-5 w-5 text-white' />
																</div>
																<div>
																	<h5 className='font-semibold text-gray-900 mb-2'>
																		性能优化
																	</h5>
																	<p className='text-gray-600 leading-relaxed'>
																		所有动画都经过性能优化，使用
																		GPU 加速和 Framer Motion
																		的智能动画系统。
																		支持动画控制、延迟、自定义缓动函数等高级功能。
																	</p>
																</div>
															</div>
														</div>
													</FadeIn>
												</div>
											</CardContent>
										</Card>
									</SlideUp>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}
