"use client";

import React, { useState } from "react";
import {
	Button,
	Input,
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
	Badge,
	Alert,
	Loading,
	Checkbox,
	Navigation,
	TopNavigation,
	type NavigationItem,
} from "@/components/ui";

export default function ComponentsPage() {
	// 状态管理
	const [inputValues, setInputValues] = useState({
		success: "输入正确",
		warning: "需要注意",
		error: "输入错误",
		password: "",
		search: "",
	});

	const [isChecked, setIsChecked] = useState(false);
	const [isUncertain, setIsUncertain] = useState(false);

	// 导航数据
	const navigationItems: NavigationItem[] = [
		{
			id: "home",
			label: "首页",
			active: true,
			icon: (
				<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M8 1v4M16 1v4'
					/>
				</svg>
			),
		},
		{
			id: "projects",
			label: "项目",
			icon: (
				<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
					/>
				</svg>
			),
			badge: 3,
		},
		{
			id: "blog",
			label: "博客",
			icon: (
				<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
					/>
				</svg>
			),
			badge: "新",
		},
		{
			id: "about",
			label: "关于",
			icon: (
				<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
			),
		},
		{
			id: "contact",
			label: "联系方式",
			disabled: true,
			icon: (
				<svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
					/>
				</svg>
			),
		},
	];

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50'>
			<TopNavigation currentPage='components' />

			{/* 页面标题 */}
			<div className='bg-white border-b border-gray-100'>
				<div className='container mx-auto px-6 py-12'>
					<div className='text-center'>
						<h1 className='text-5xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent mb-4'>
							Tiny Room UI 组件库
						</h1>
						<p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
							现代化、可访问、美观的 React UI 组件库，基于 Tailwind CSS 构建，
							支持多种变体和状态，让你的应用界面更加精美
						</p>
						<div className='flex justify-center gap-4 mt-8'>
							<Badge variant='primary' size='lg'>
								✨ 现代化设计
							</Badge>
							<Badge variant='success' size='lg'>
								♿ 无障碍支持
							</Badge>
							<Badge variant='info' size='lg'>
								🎨 丰富变体
							</Badge>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-6 py-12'>
				<div className='grid gap-12'>
					{/* Navigation 导航组件 */}
					<Card variant='elevated' size='lg' shadow>
						<CardHeader divider>
							<CardTitle level={2} gradient>
								🧭 Navigation 导航组件
							</CardTitle>
							<p className='text-gray-600'>支持多种布局和样式的现代导航组件</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 水平导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										水平导航 (Horizontal)
									</h4>
									<Navigation
										items={navigationItems}
										variant='horizontal'
										size='md'
									/>
								</div>

								{/* 标签页导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										标签页导航 (Tabs)
									</h4>
									<Navigation items={navigationItems} variant='tabs' size='md' />
								</div>

								{/* 药丸导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										药丸导航 (Pills)
									</h4>
									<Navigation items={navigationItems} variant='pills' size='md' />
								</div>

								{/* 垂直导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										垂直导航 (Vertical)
									</h4>
									<div className='max-w-xs'>
										<Navigation
											items={navigationItems}
											variant='vertical'
											size='md'
										/>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Button 按钮组件 */}
					<Card variant='elevated' size='lg' shadow>
						<CardHeader divider>
							<CardTitle level={2} gradient>
								🔘 Button 按钮组件
							</CardTitle>
							<p className='text-gray-600'>
								现代化按钮组件，支持多种变体、尺寸和状态
							</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 按钮变体 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										按钮变体
									</h4>
									<div className='flex flex-wrap gap-3'>
										<Button variant='primary'>主要按钮</Button>
										<Button variant='secondary'>次要按钮</Button>
										<Button variant='outline'>轮廓按钮</Button>
										<Button variant='ghost'>幽灵按钮</Button>
										<Button variant='destructive'>危险按钮</Button>
										<Button variant='success'>成功按钮</Button>
										<Button variant='gradient'>渐变按钮</Button>
										<Button variant='minimal'>极简按钮</Button>
									</div>
								</div>

								{/* 按钮尺寸 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										按钮尺寸
									</h4>
									<div className='flex flex-wrap items-center gap-3'>
										<Button size='sm'>小号</Button>
										<Button size='md'>中号</Button>
										<Button size='lg'>大号</Button>
										<Button size='xl'>超大</Button>
									</div>
								</div>

								{/* 带图标的按钮 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										带图标按钮
									</h4>
									<div className='flex flex-wrap gap-3'>
										<Button
											leftIcon={
												<svg
													className='w-4 h-4'
													fill='currentColor'
													viewBox='0 0 20 20'
												>
													<path
														fillRule='evenodd'
														d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
														clipRule='evenodd'
													/>
												</svg>
											}
											variant='primary'
										>
											新增
										</Button>
										<Button
											rightIcon={
												<svg
													className='w-4 h-4'
													fill='currentColor'
													viewBox='0 0 20 20'
												>
													<path
														fillRule='evenodd'
														d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
														clipRule='evenodd'
													/>
												</svg>
											}
											variant='outline'
										>
											下一步
										</Button>
									</div>
								</div>

								{/* 按钮状态 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										按钮状态
									</h4>
									<div className='flex flex-wrap gap-3'>
										<Button disabled>禁用状态</Button>
										<Button loading>加载中...</Button>
										<Button fullWidth>全宽按钮</Button>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Input 输入框组件 */}
					<Card variant='elevated' size='lg' shadow>
						<CardHeader divider>
							<CardTitle level={2} gradient>
								📝 Input 输入框组件
							</CardTitle>
							<p className='text-gray-600'>多样化的输入组件，支持各种状态和样式</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 输入框变体 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										输入框变体
									</h4>
									<div className='space-y-4'>
										<Input
											variant='default'
											placeholder='默认样式输入框'
											label='Default'
										/>
										<Input
											variant='filled'
											placeholder='填充样式输入框'
											label='Filled'
										/>
										<Input
											variant='underlined'
											placeholder='下划线样式输入框'
											label='Underlined'
										/>
										<Input
											variant='minimal'
											placeholder='极简样式输入框'
											label='Minimal'
										/>
									</div>
								</div>

								{/* 输入框功能 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										输入框功能
									</h4>
									<div className='space-y-4'>
										<Input
											type='password'
											placeholder='请输入密码'
											label='密码输入'
											isPassword
											value={inputValues.password}
											onChange={e =>
												setInputValues(prev => ({
													...prev,
													password: e.target.value,
												}))
											}
										/>
										<Input
											placeholder='搜索...'
											label='搜索框'
											leftIcon={
												<svg
													className='w-4 h-4'
													fill='currentColor'
													viewBox='0 0 20 20'
												>
													<path
														fillRule='evenodd'
														d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
														clipRule='evenodd'
													/>
												</svg>
											}
											value={inputValues.search}
											onChange={e =>
												setInputValues(prev => ({
													...prev,
													search: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								{/* 输入框状态 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										输入框状态
									</h4>
									<div className='space-y-4'>
										<Input
											label='成功状态'
											value={inputValues.success}
											state='success'
											helpText='验证通过！'
											onChange={e =>
												setInputValues(prev => ({
													...prev,
													success: e.target.value,
												}))
											}
										/>
										<Input
											label='警告状态'
											value={inputValues.warning}
											state='warning'
											helpText='请检查输入内容'
											onChange={e =>
												setInputValues(prev => ({
													...prev,
													warning: e.target.value,
												}))
											}
										/>
										<Input
											label='错误状态'
											value={inputValues.error}
											state='error'
											error='这是错误信息'
											onChange={e =>
												setInputValues(prev => ({
													...prev,
													error: e.target.value,
												}))
											}
										/>
									</div>
								</div>

								{/* 输入框尺寸 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-gray-900'>
										输入框尺寸
									</h4>
									<div className='space-y-4'>
										<Input size='sm' placeholder='小号输入框' label='Small' />
										<Input size='md' placeholder='中号输入框' label='Medium' />
										<Input size='lg' placeholder='大号输入框' label='Large' />
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Card 卡片组件 */}
					<Card variant='elevated' size='lg' shadow>
						<CardHeader divider>
							<CardTitle level={2} gradient>
								🃏 Card 卡片组件
							</CardTitle>
							<p className='text-gray-600'>灵活多变的卡片容器，支持多种布局和样式</p>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{/* 默认卡片 */}
								<Card variant='default' hoverable>
									<CardHeader>
										<CardTitle level={4}>默认卡片</CardTitle>
										<p className='text-sm text-gray-600'>基础样式的卡片</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-gray-700'>
											这是默认样式的卡片内容，简洁明了。
										</p>
									</CardContent>
									<CardFooter align='right'>
										<Button size='sm' variant='outline'>
											了解更多
										</Button>
									</CardFooter>
								</Card>

								{/* 浮动卡片 */}
								<Card variant='elevated' hoverable>
									<CardHeader>
										<CardTitle level={4}>浮动卡片</CardTitle>
										<p className='text-sm text-gray-600'>带阴影的浮动效果</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-gray-700'>
											这种卡片有优雅的阴影效果，显得更加立体。
										</p>
									</CardContent>
									<CardFooter align='right'>
										<Button size='sm' variant='primary'>
											立即体验
										</Button>
									</CardFooter>
								</Card>

								{/* 渐变卡片 */}
								<Card variant='gradient' hoverable>
									<CardHeader>
										<CardTitle level={4} gradient>
											渐变卡片
										</CardTitle>
										<p className='text-sm text-gray-600'>炫彩渐变背景</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-gray-700'>
											渐变背景让卡片更加生动有趣。
										</p>
									</CardContent>
									<CardFooter align='right'>
										<Button size='sm' variant='secondary'>
											查看详情
										</Button>
									</CardFooter>
								</Card>
							</div>
						</CardContent>
					</Card>

					{/* 其他组件 */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Badge 徽章组件 */}
						<Card variant='elevated' hoverable>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									🏷️ Badge 徽章
								</CardTitle>
								<p className='text-gray-600'>状态指示和标签组件</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-gray-900'>颜色变体</h5>
										<div className='flex flex-wrap gap-2'>
											<Badge variant='default'>Default</Badge>
											<Badge variant='primary'>Primary</Badge>
											<Badge variant='success'>Success</Badge>
											<Badge variant='warning'>Warning</Badge>
											<Badge variant='danger'>Danger</Badge>
											<Badge variant='info'>Info</Badge>
											<Badge variant='purple'>Purple</Badge>
											<Badge variant='pink'>Pink</Badge>
										</div>
									</div>
									<div className='space-y-3'>
										<h5 className='font-medium text-gray-900'>尺寸和样式</h5>
										<div className='flex flex-wrap items-center gap-2'>
											<Badge size='sm'>小号</Badge>
											<Badge size='md'>中号</Badge>
											<Badge size='lg'>大号</Badge>
											<Badge rounded>圆形</Badge>
											<Badge dot>有圆点</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Alert 警告组件 */}
						<Card variant='elevated' hoverable>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									⚠️ Alert 警告框
								</CardTitle>
								<p className='text-gray-600'>消息通知和状态提示</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<Alert variant='info' title='信息提示'>
										这是一条普通的信息提示。
									</Alert>
									<Alert variant='success' title='操作成功'>
										您的操作已成功完成！
									</Alert>
									<Alert variant='warning' title='注意事项'>
										请注意检查相关设置。
									</Alert>
									<Alert variant='danger' title='错误警告' dismissible>
										发生了错误，请稍后重试。
									</Alert>
								</div>
							</CardContent>
						</Card>

						{/* Loading 加载组件 */}
						<Card variant='elevated' hoverable>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									⏳ Loading 加载
								</CardTitle>
								<p className='text-gray-600'>多种加载动画效果</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-gray-900'>加载类型</h5>
										<div className='flex flex-wrap items-center gap-6'>
											<Loading variant='spinner' />
											<Loading variant='dots' />
											<Loading variant='pulse' />
											<Loading variant='bars' />
											<Loading variant='ring' />
										</div>
									</div>
									<div className='space-y-3'>
										<h5 className='font-medium text-gray-900'>尺寸和颜色</h5>
										<div className='flex flex-wrap items-center gap-6'>
											<Loading variant='spinner' size='sm' />
											<Loading variant='spinner' size='md' />
											<Loading variant='spinner' size='lg' />
											<Loading variant='spinner' color='primary' />
											<Loading variant='spinner' color='secondary' />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Checkbox 复选框组件 */}
						<Card variant='elevated' hoverable>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									☑️ Checkbox 复选框
								</CardTitle>
								<p className='text-gray-600'>选择和确认操作</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-gray-900'>基础复选框</h5>
										<div className='space-y-3'>
											<Checkbox
												label='我同意服务条款'
												description='请仔细阅读我们的服务条款和隐私政策'
												checked={isChecked}
												onChange={e => setIsChecked(e.target.checked)}
											/>
											<Checkbox
												label='不确定状态'
												indeterminate={isUncertain}
												onChange={e => setIsUncertain(e.target.checked)}
											/>
											<Checkbox label='禁用状态' disabled />
											<Checkbox label='错误状态' error='请勾选此项以继续' />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* 页脚信息 */}
					<Card variant='minimal' className='text-center'>
						<CardContent>
							<div className='flex justify-center items-center gap-2 text-gray-600'>
								<span>🎨</span>
								<span>由 Tiny Room 团队精心设计</span>
								<span>•</span>
								<span>基于 React + Tailwind CSS</span>
								<span>•</span>
								<span>现代化 UI 组件库</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
