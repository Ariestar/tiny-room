import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { BarChart, PenSquare, Eye, Users } from "lucide-react";

const stats = [
	{
		title: "总访问量",
		value: "12,345",
		icon: <Eye className='w-6 h-6 text-gray-400' />,
		change: "+5.2%",
		changeType: "positive",
	},
	{
		title: "项目数量",
		value: "18",
		icon: <BarChart className='w-6 h-6 text-gray-400' />,
		change: "+2",
		changeType: "positive",
	},
	{
		title: "博客文章",
		value: "32",
		icon: <PenSquare className='w-6 h-6 text-gray-400' />,
		change: "-1.8%",
		changeType: "negative",
	},
	{
		title: "订阅用户",
		value: "1,204",
		icon: <Users className='w-6 h-6 text-gray-400' />,
		change: "+150",
		changeType: "positive",
	},
];

export default function DashboardPage() {
	return (
		<div className='p-8 space-y-8'>
			<header>
				<h1 className='text-4xl font-bold tracking-tight text-gray-800'>
					欢迎回来, Admin!
				</h1>
				<p className='mt-2 text-lg text-gray-500'>这是您的控制中心，祝您有美好的一天。</p>
			</header>

			<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{stats.map(stat => (
					<Card key={stat.title} variant='elevated' hoverable>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle level={5}>{stat.title}</CardTitle>
							{stat.icon}
						</CardHeader>
						<CardContent>
							<div className='text-3xl font-bold text-gray-900'>{stat.value}</div>
							<p
								className={`text-sm mt-1 ${
									stat.changeType === "positive"
										? "text-green-600"
										: "text-red-600"
								}`}
							>
								{stat.change}
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
				<Card variant='minimal' className='lg:col-span-2'>
					<CardHeader>
						<CardTitle>近期活动</CardTitle>
						<CardDescription>最近在您的网站上发生的事情。</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{[1, 2, 3, 4, 5].map(i => (
								<div key={i} className='flex items-center'>
									<div className='flex-1'>
										<p className='font-medium text-gray-800'>
											用户 "Alex" 评论了您的文章 "Next.js 15 新特性".
										</p>
										<p className='text-sm text-gray-500'>2小时前</p>
									</div>
									<button className='text-sm font-medium text-brand-600 hover:text-brand-800'>
										查看
									</button>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card variant='minimal'>
					<CardHeader>
						<CardTitle>热门内容</CardTitle>
						<CardDescription>您最受欢迎的文章和项目。</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='space-y-3'>
							<li className='font-medium text-gray-700 hover:text-brand-600 cursor-pointer'>
								1. 如何用 Framer Motion 制作动画
							</li>
							<li className='font-medium text-gray-700 hover:text-brand-600 cursor-pointer'>
								2. 我的个人摄影作品集
							</li>
							<li className='font-medium text-gray-700 hover:text-brand-600 cursor-pointer'>
								3. Tailwind CSS 深度指南
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
