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
		<div className='min-h-screen bg-background'>
			<TopNavigation currentPage='components' />

			{/* 页面标题 */}
			<div className='bg-card border-b border-border'>
				<div className='container mx-auto px-6 py-12'>
					<div className='text-center'>
						<h1 className='text-5xl font-bold text-foreground mb-4'>
							Tiny Room UI 组件库
						</h1>
						<p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
							现代化、可访问、美观的 React UI 组件库，基于 Tailwind CSS 构建，
							支持多种变体和状态，让你的应用界面更加精美
						</p>
						<div className='flex justify-center gap-4 mt-8'>
							<Badge variant='primary' size='lg'>
								✨ 现代化设计
							</Badge>
							<Badge variant='primary' size='lg'>
								♿ 无障碍支持
							</Badge>
							<Badge variant='primary' size='lg'>
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
							<p className='text-muted-foreground'>
								支持多种布局和样式的现代导航组件
							</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 水平导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
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
									<h4 className='text-lg font-semibold text-foreground'>
										标签页导航 (Tabs)
									</h4>
									<Navigation items={navigationItems} variant='tabs' size='md' />
								</div>

								{/* 药丸导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										药丸导航 (Pills)
									</h4>
									<Navigation items={navigationItems} variant='pills' size='md' />
								</div>

								{/* 垂直导航 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
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
							<p className='text-muted-foreground'>
								现代化按钮组件，支持多种变体、尺寸和状态
							</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 按钮变体 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										按钮变体
									</h4>
									<div className='flex flex-wrap gap-3'>
										<Button variant='primary'>主要按钮</Button>
										<Button variant='secondary'>次要按钮</Button>
										<Button variant='outline'>轮廓按钮</Button>
										<Button variant='ghost'>幽灵按钮</Button>
										<Button variant='destructive'>危险按钮</Button>
										<Button variant='gradient'>渐变按钮</Button>
										<Button variant='minimal'>极简按钮</Button>
									</div>
								</div>

								{/* 按钮尺寸 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
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
									<h4 className='text-lg font-semibold text-foreground'>
										带图标按钮
									</h4>
									<div className='flex flex-wrap items-center gap-3'>
										<Button
											variant='primary'
											leftIcon={
												<svg
													className='w-5 h-5'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M12 6v6m0 0v6m0-6h6m-6 0H6'
													/>
												</svg>
											}
										>
											添加内容
										</Button>
										<Button
											variant='destructive'
											rightIcon={<Loading size='sm' />}
										>
											正在删除
										</Button>
										<Button variant='outline' size='icon'>
											<svg
												className='w-5 h-5'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='2'
													d='M4 6h16M4 12h16M4 18h16'
												/>
											</svg>
										</Button>
									</div>
								</div>

								{/* 按钮状态 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										按钮状态
									</h4>
									<div className='flex flex-wrap items-center gap-3'>
										<Button loading>加载中</Button>
										<Button disabled>禁用</Button>
										<Button fullWidth>块级按钮</Button>
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
							<p className='text-muted-foreground'>
								多样化的输入组件，支持各种状态和样式
							</p>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{/* 输入框变体 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										输入框变体
									</h4>
									<div className='grid md:grid-cols-2 gap-6'>
										<Input
											variant='default'
											placeholder='默认输入框'
											label='默认样式'
										/>
										<Input
											variant='filled'
											placeholder='填充输入框'
											label='填充样式'
										/>
										<Input
											variant='underlined'
											placeholder='下划线输入框'
											label='下划线样式'
										/>
										<Input
											variant='minimal'
											placeholder='极简输入框'
											label='极简样式'
										/>
									</div>
								</div>
								{/* 输入框功能 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										输入框功能
									</h4>
									<div className='max-w-md space-y-4'>
										<Input
											placeholder='带左侧图标'
											leftIcon={
												<svg
													className='w-5 h-5'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
													/>
												</svg>
											}
										/>
										<Input placeholder='带右侧图标' rightIcon={<Loading />} />
										<Input isPassword placeholder='密码输入框' />
										<Input isSearch placeholder='搜索...' />
									</div>
								</div>

								{/* 输入框状态 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										输入框状态
									</h4>
									<div className='max-w-md space-y-4'>
										<div>
											<Input
												value={inputValues.success}
												state='success'
												onChange={e =>
													setInputValues({
														...inputValues,
														success: e.target.value,
													})
												}
											/>
											<p className='mt-2 text-sm text-muted-foreground'>
												成功状态
											</p>
										</div>
										<div>
											<Input
												value={inputValues.warning}
												state='warning'
												onChange={e =>
													setInputValues({
														...inputValues,
														warning: e.target.value,
													})
												}
											/>
											<p className='mt-2 text-sm text-muted-foreground'>
												警告状态
											</p>
										</div>
										<div>
											<Input
												value={inputValues.error}
												state='error'
												onChange={e =>
													setInputValues({
														...inputValues,
														error: e.target.value,
													})
												}
											/>
											<p className='mt-2 text-sm text-muted-foreground'>
												错误状态
											</p>
										</div>
									</div>
								</div>

								{/* 输入框尺寸 */}
								<div className='space-y-4'>
									<h4 className='text-lg font-semibold text-foreground'>
										输入框尺寸
									</h4>
									<div className='max-w-md space-y-4'>
										<Input size='sm' placeholder='小号输入框' />
										<Input size='md' placeholder='中号输入框' />
										<Input size='lg' placeholder='大号输入框' />
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
							<p className='text-muted-foreground'>
								灵活多变的卡片容器，支持多种布局和样式
							</p>
						</CardHeader>
						<CardContent>
							<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
								<Card hoverable clickable>
									<CardHeader>
										<CardTitle level={4}>默认卡片</CardTitle>
										<p className='text-sm text-foreground'>基础样式的卡片</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-foreground'>
											这是默认样式的卡片内容，简洁明了。
										</p>
									</CardContent>
									<CardFooter>
										<Button size='sm'>查看详情</Button>
									</CardFooter>
								</Card>

								<Card variant='elevated' hoverable clickable>
									<CardHeader>
										<CardTitle level={4}>浮动卡片</CardTitle>
										<p className='text-sm text-foreground'>带阴影的浮动效果</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-foreground'>
											这种卡片有优雅的阴影效果，显得更加立体。
										</p>
									</CardContent>
									<CardFooter>
										<Button variant='secondary' size='sm'>
											了解更多
										</Button>
									</CardFooter>
								</Card>

								<Card variant='gradient' hoverable clickable>
									<CardHeader>
										<CardTitle level={4}>渐变卡片</CardTitle>
										<p className='text-sm text-foreground'>炫彩渐变背景</p>
									</CardHeader>
									<CardContent padding='md'>
										<p className='text-foreground'>
											渐变背景让卡片更加生动有趣。
										</p>
									</CardContent>
									<CardFooter>
										<Button variant='minimal' size='sm'>
											立即体验
										</Button>
									</CardFooter>
								</Card>
							</div>

							<div className='mt-8 grid gap-6'>
								<Card variant='outlined'>
									<CardContent>
										<div className='flex items-center justify-between'>
											<div>
												<CardTitle level={5}>轮廓卡片</CardTitle>
												<p className='text-muted-foreground'>
													只保留边框，适合简约设计
												</p>
											</div>
											<Button variant='outline' size='sm'>
												操作
											</Button>
										</div>
									</CardContent>
								</Card>
								<Card variant='minimal'>
									<CardContent>
										<div className='flex items-center justify-between'>
											<div>
												<CardTitle level={5}>极简卡片</CardTitle>
												<p className='text-muted-foreground'>
													无背景和边框，内容区域更加突出
												</p>
											</div>
											<Button variant='minimal' size='sm'>
												操作
											</Button>
										</div>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>

					{/* 其他组件 */}
					<div className='grid md:grid-cols-2 gap-12'>
						{/* Badge 徽章组件 */}
						<Card variant='elevated'>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									🏷️ Badge 徽章
								</CardTitle>
								<p className='text-muted-foreground'>状态指示和标签组件</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>颜色变体</h5>
										<div className='flex flex-wrap gap-2'>
											<Badge variant='primary'>主要</Badge>
											<Badge variant='info'>信息</Badge>
											<Badge variant='warning'>警告</Badge>
											<Badge variant='destructive'>危险</Badge>
											<Badge variant='success'>成功</Badge>
											<Badge variant='secondary'>次要</Badge>
											<Badge variant='outline'>轮廓</Badge>
										</div>
									</div>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>尺寸和样式</h5>
										<div className='flex flex-wrap items-center gap-2'>
											<Badge size='sm'>小号</Badge>
											<Badge size='md'>中号</Badge>
											<Badge size='lg'>大号</Badge>
											<Badge rounded>圆角</Badge>
											<Badge dot>带点</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Alert 警告组件 */}
						<Card variant='elevated'>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									⚠️ Alert 警告框
								</CardTitle>
								<p className='text-muted-foreground'>消息通知和状态提示</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<Alert variant='info' title='提示信息' dismissible>
										这是一条普通的信息提示。
									</Alert>
									<Alert variant='success' title='操作成功' dismissible>
										你的操作已成功完成。
									</Alert>
									<Alert variant='warning' title='需要注意' dismissible>
										请注意，这个操作可能产生意外结果。
									</Alert>
									<Alert variant='destructive' title='发生错误' dismissible>
										抱歉，处理您的请求时发生错误。
									</Alert>
								</div>
							</CardContent>
						</Card>

						{/* Loading 加载组件 */}
						<Card variant='elevated'>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									⏳ Loading 加载
								</CardTitle>
								<p className='text-muted-foreground'>多种加载动画效果</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>加载类型</h5>
										<div className='flex flex-wrap items-center gap-6'>
											<Loading variant='spinner' />
											<Loading variant='dots' />
											<Loading variant='pulse' />
											<Loading variant='bars' />
											<Loading variant='ring' />
										</div>
									</div>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>尺寸和颜色</h5>
										<div className='flex flex-wrap items-center gap-6'>
											<Loading variant='spinner' size='sm' />
											<Loading variant='dots' size='md' />
											<Loading variant='pulse' size='lg' />
											<Loading variant='bars' size='xl' />
											<Loading variant='ring' color='primary' />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Checkbox 复选框组件 */}
						<Card variant='elevated'>
							<CardHeader divider>
								<CardTitle level={3} gradient>
									☑️ Checkbox 复选框
								</CardTitle>
								<p className='text-muted-foreground'>选择和确认操作</p>
							</CardHeader>
							<CardContent>
								<div className='space-y-6'>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>基础复选框</h5>
										<div className='space-y-3'>
											<Checkbox
												id='terms'
												checked={isChecked}
												onChange={e => setIsChecked(e.target.checked)}
												label='我同意服务条款和隐私政策。'
											/>
											<Checkbox
												id='uncertain'
												checked={isUncertain}
												onChange={e => setIsUncertain(e.target.checked)}
												label='不确定状态'
												indeterminate={isUncertain}
											/>
										</div>
									</div>
									<div className='space-y-3'>
										<h5 className='font-medium text-foreground'>禁用状态</h5>
										<div className='flex items-center space-x-3'>
											<Checkbox id='disabled' checked disabled />
											<label
												htmlFor='disabled'
												className='text-sm text-foreground'
											>
												已选中并禁用
											</label>
										</div>
										<div className='flex items-center space-x-3'>
											<Checkbox id='unchecked-disabled' disabled />
											<label
												htmlFor='unchecked-disabled'
												className='text-sm text-foreground'
											>
												未选中并禁用
											</label>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* 页脚信息 */}
					<Card variant='minimal' className='text-center'>
						<CardContent>
							<div className='flex justify-center items-center gap-2 text-foreground'>
								<span>🎨</span>
								<span>由 Tiny Room 团队精心设计</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
