import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui";
import { BarChart, PenSquare, Eye, Users, GitBranch, Star, GitFork, Activity } from "lucide-react";
import { auth } from "@/auth";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import Link from "next/link";

const stats = [
	{
		name: "总访问量",
		value: "12,345",
		change: "+5.4%",
		changeType: "positive",
		icon: <Eye className='w-6 h-6 text-muted-foreground' />,
	},
	{
		name: "总收入",
		value: "¥8,765",
		change: "+12.1%",
		changeType: "positive",
		icon: <BarChart className='w-6 h-6 text-muted-foreground' />,
	},
	{
		name: "新文章",
		value: "3",
		change: " ",
		changeType: "neutral",
		icon: <PenSquare className='w-6 h-6 text-muted-foreground' />,
	},
	{
		name: "新用户",
		value: "21",
		change: "-2.3%",
		changeType: "negative",
		icon: <Users className='w-6 h-6 text-muted-foreground' />,
	},
];

const recentActivities = [
	{
		id: 1,
		icon: <Eye className='w-4 h-4' />,
		description: '用户 "Alex" 评论了您的文章 "Next.js 15 新特性"',
		time: "2小时前",
	},
	{
		id: 2,
		icon: <Eye className='w-4 h-4' />,
		description: '用户 "Jane" 评论了您的文章 "Framer Motion 深度指南"',
		time: "3小时前",
	},
	{
		id: 3,
		icon: <Eye className='w-4 h-4' />,
		description: '用户 "Bob" 评论了您的文章 "Tailwind CSS 深度指南"',
		time: "4小时前",
	},
];

const DashboardPage = async () => {
	const session = await auth();

	return (
		<div className='p-6'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-3xl font-bold text-foreground'>仪表盘</h1>
					<p className='text-muted-foreground mt-2'>
						这是您的控制中心，祝您有美好的一天。
					</p>
				</div>
				<Button>添加组件</Button>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
				{stats.map(stat => (
					<Card key={stat.name}>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium'>{stat.name}</CardTitle>
							{stat.icon}
						</CardHeader>
						<CardContent>
							<div className='text-3xl font-bold text-foreground'>{stat.value}</div>
							<p
								className={cn(
									"text-xs text-muted-foreground",
									stat.changeType === "positive" && "text-accent-green",
									stat.changeType === "negative" && "text-destructive"
								)}
							>
								{stat.change}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Projects Statistics Section */}
			<div className='mb-6'>
				<div className='flex items-center justify-between mb-4'>
					<div>
						<h2 className='text-xl font-semibold text-foreground'>项目统计</h2>
						<p className='text-sm text-muted-foreground'>您的GitHub项目概览</p>
					</div>
					<Link href='/dashboard/projects'>
						<Button variant='outline' size='sm'>
							管理项目
						</Button>
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<StatCard
						title="总仓库数"
						value="--"
						subtitle="加载中..."
						icon={GitBranch}
						variant="default"
					/>
					<StatCard
						title="总星标数"
						value="--"
						subtitle="加载中..."
						icon={Star}
						variant="default"
					/>
					<StatCard
						title="总分叉数"
						value="--"
						subtitle="加载中..."
						icon={GitFork}
						variant="default"
					/>
					<StatCard
						title="最近活跃"
						value="--"
						subtitle="30天内更新"
						icon={Activity}
						variant="highlighted"
					/>
				</div>
			</div>

			{/* Recent Activities & Quick Links */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<Card className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>最近动态</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-4'>
							{recentActivities.map(activity => (
								<li key={activity.id} className='flex items-center space-x-4'>
									<div className='p-2 bg-secondary rounded-full'>
										{activity.icon}
									</div>
									<div>
										<p className='font-medium text-foreground'>
											{activity.description}
										</p>
										<p className='text-sm text-muted-foreground'>
											{activity.time}
										</p>
									</div>
								</li>
							))}
						</ul>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>快捷链接</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/dashboard/blog'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									写新文章
								</Link>
							</li>
							<li>
								<Link
									href='/dashboard/projects'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									管理项目
								</Link>
							</li>
							<li>
								<Link
									href='/dashboard/gallery'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									管理画廊
								</Link>
							</li>
							<li>
								<Link
									href='/dashboard/settings'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									系统设置
								</Link>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default DashboardPage;
