"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui";
import { BarChart, PenSquare, Eye, Users, GitBranch, Star, GitFork, Activity } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/shared/utils";
import Link from "next/link";

interface AnalyticsStats {
	totalViews: number;
	todayViews: number;
	popularPosts: Array<{ slug: string; views: number }>;
	dailyStats: Array<{ date: string; views: number }>;
}

interface ShareStats {
	summary: {
		totalShares: number;
		topPlatforms: Array<{ platform: string; count: number }>;
	};
}

interface ProjectStats {
	totalRepos: number;
	totalStars: number;
	totalForks: number;
	recentlyActive: number;
}

// Removed server-side data fetching function


const DashboardPage = () => {
	const [analytics, setAnalytics] = useState<AnalyticsStats | null>(null);
	const [shares, setShares] = useState<ShareStats | null>(null);
	const [projects, setProjects] = useState<ProjectStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const [analyticsRes, sharesRes, projectsRes] = await Promise.allSettled([
					fetch('/api/analytics/stats', { cache: 'no-store' }),
					fetch('/api/analytics/share', { cache: 'no-store' }),
					fetch('/api/projects/stats', { cache: 'no-store' })
				]);

				if (analyticsRes.status === 'fulfilled' && analyticsRes.value.ok) {
					setAnalytics(await analyticsRes.value.json());
				}

				if (sharesRes.status === 'fulfilled' && sharesRes.value.ok) {
					setShares(await sharesRes.value.json());
				}

				if (projectsRes.status === 'fulfilled' && projectsRes.value.ok) {
					setProjects(await projectsRes.value.json());
				}
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const statsCards = [
		{
			name: "总浏览量",
			value: analytics?.totalViews?.toLocaleString() || "0",
			change: analytics ? "+100%" : "暂无数据",
			changeType: analytics ? "positive" : "neutral",
			icon: <Eye className='w-6 h-6 text-muted-foreground' />,
		},
		{
			name: "今日浏览量",
			value: analytics?.todayViews?.toLocaleString() || "0",
			change: analytics ? "今日" : "暂无数据",
			changeType: analytics ? "positive" : "neutral",
			icon: <Activity className='w-6 h-6 text-muted-foreground' />,
		},
		{
			name: "分享总量",
			value: shares?.summary?.totalShares?.toLocaleString() || "0",
			change: shares?.summary?.topPlatforms?.[0]?.platform || "暂无数据",
			changeType: shares ? "positive" : "neutral",
			icon: <BarChart className='w-6 h-6 text-muted-foreground' />,
		},
		{
			name: "活跃项目",
			value: projects?.recentlyActive?.toString() || "0",
			change: projects ? "30天内更新" : "暂无数据",
			changeType: projects ? "positive" : "neutral",
			icon: <GitBranch className='w-6 h-6 text-muted-foreground' />,
		},
	];

	// Build recent activities from analytics data
	const recentActivitiesFromData = analytics?.popularPosts?.slice(0, 3).map((post, i) => ({
		id: i + 1,
		icon: <Eye className='w-4 h-4' />,
		description: `文章 "${post.slug}" 获得了 ${post.views} 次浏览`,
		time: "最近",
	})) || [];

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
				{statsCards.map(stat => (
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
						value={projects?.totalRepos || 0}
						subtitle={projects ? "GitHub 仓库" : "未连接"}
						icon={GitBranch}
						variant="default"
					/>
					<StatCard
						title="总星标数"
						value={projects?.totalStars || 0}
						subtitle={projects ? "获得星标" : "未连接"}
						icon={Star}
						variant="default"
					/>
					<StatCard
						title="总分叉数"
						value={projects?.totalForks || 0}
						subtitle={projects ? "项目分叉" : "未连接"}
						icon={GitFork}
						variant="default"
					/>
					<StatCard
						title="最近活跃"
						value={projects?.recentlyActive || 0}
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
							{recentActivitiesFromData.length > 0 ? (
								recentActivitiesFromData.map(activity => (
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
								))
							) : (
								<li className='text-center text-muted-foreground py-8'>
									暂无最近活动数据
								</li>
							)}
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
