import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { BarChart, PenSquare, Eye, Users } from "lucide-react";
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
									href='#'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									写新文章
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									管理评论
								</Link>
							</li>
							<li>
								<Link
									href='#'
									className='font-medium text-foreground hover:text-primary transition-colors'
								>
									查看分析
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
