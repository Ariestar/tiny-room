"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navigation, { NavigationItem } from "@/components/layout/Navigation";
import { LayoutDashboard, Pencil, Briefcase, ImageIcon, Settings, LogOut, MapPin } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardClientLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	// If on the login page, render children directly without the layout
	if (pathname === "/dashboard/login") {
		return <>{children}</>;
	}
	const navigationItems: NavigationItem[] = [
		{
			id: "dashboard",
			href: "/dashboard",
			label: "仪表盘",
			icon: <LayoutDashboard />,
			active: pathname === "/dashboard",
		},
		{
			id: "blog",
			href: "/dashboard/blog",
			label: "博客管理",
			icon: <Pencil />,
			active: pathname.startsWith("/dashboard/blog"),
		},
		{
			id: "projects",
			href: "/dashboard/projects",
			label: "项目管理",
			icon: <Briefcase />,
			active: pathname.startsWith("/dashboard/projects"),
		},
		{
			id: "gallery",
			href: "/dashboard/gallery",
			label: "图库管理",
			icon: <ImageIcon />,
			active: pathname.startsWith("/dashboard/gallery"),
		},
		{
			id: "foodmap",
			href: "/dashboard/foodmap",
			label: "美食地图",
			icon: <MapPin />,
			active: pathname.startsWith("/dashboard/foodmap"),
		},
		{
			id: "settings",
			href: "/dashboard/settings",
			label: "设置",
			icon: <Settings />,
			active: pathname.startsWith("/dashboard/settings"),
		},
	];
	const logoutItem: NavigationItem = {
		id: "logout",
		href: "#",
		label: "登出",
		icon: <LogOut />,
		onClick: () => {
			const callbackUrl = typeof window !== 'undefined'
				? `${window.location.origin}/dashboard/login`
				: "/dashboard/login";
			signOut({ callbackUrl });
		},
	};
	return (
		<div className='flex h-screen bg-background text-foreground'>
			<aside className='flex flex-col w-64 bg-card border-r border-border'>
				<div className='flex-1 p-4 overflow-y-auto'>
					<Navigation
						items={navigationItems}
						variant='vertical'
						size='md'
						className='space-y-1'
					/>
				</div>
				<div className='p-4 border-t border-border'>
					<Navigation
						items={[logoutItem]}
						variant='vertical'
						size='md'
						className='space-y-1'
					/>
				</div>
			</aside>
			<main className='flex-1 p-6 overflow-auto'>{children}</main>
		</div>
	);
}
