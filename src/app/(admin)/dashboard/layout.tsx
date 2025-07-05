"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navigation, { NavigationItem } from "@/components/ui/Navigation";
import { LayoutDashboard, Pencil, Briefcase, ImageIcon, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	const navigationItems: NavigationItem[] = [
		{
			id: "dashboard",
			label: "Dashboard",
			href: "/dashboard",
			icon: <LayoutDashboard />,
			active: pathname === "/dashboard",
		},
		{
			id: "blog",
			label: "Blog",
			href: "/dashboard/blog",
			icon: <Pencil />,
			active: pathname.startsWith("/dashboard/blog"),
		},
		{
			id: "projects",
			label: "Projects",
			href: "/dashboard/projects",
			icon: <Briefcase />,
			active: pathname.startsWith("/dashboard/projects"),
		},
		{
			id: "gallery",
			label: "Gallery",
			href: "/dashboard/gallery",
			icon: <ImageIcon />,
			active: pathname.startsWith("/dashboard/gallery"),
		},
		{
			id: "settings",
			label: "Settings",
			href: "/dashboard/settings",
			icon: <Settings />,
			active: pathname.startsWith("/dashboard/settings"),
		},
	];

	const logoutItem: NavigationItem = {
		id: "logout",
		label: "Logout",
		href: "/api/auth/signout",
		icon: <LogOut />,
	};

	return (
		<div className='flex h-screen bg-gray-50 text-gray-800'>
			<aside className='flex flex-col w-64 bg-white border-r border-gray-200'>
				<div className='h-16 flex items-center px-6 border-b border-gray-200'>
					<h1 className='text-xl font-bold text-gray-900'>Tiny Room</h1>
				</div>
				<div className='flex-1 p-4 overflow-y-auto'>
					<Navigation
						items={navigationItems}
						variant='vertical'
						size='md'
						className='space-y-1'
					/>
				</div>
				<div className='p-4 border-t border-gray-200'>
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
