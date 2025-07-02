import React from "react";
import Navigation, { NavigationItem } from "@/components/ui/Navigation";
import { LayoutGrid, FileText, ImageIcon, Briefcase, Settings, LogOut } from "lucide-react";

const navigationItems: NavigationItem[] = [
	{
		id: "dashboard",
		label: "仪表盘",
		href: "/dashboard",
		icon: <LayoutGrid />,
		active: true,
	},
	{
		id: "projects",
		label: "项目管理",
		href: "/dashboard/projects",
		icon: <Briefcase />,
	},
	{
		id: "blog",
		label: "博客管理",
		href: "/dashboard/blog",
		icon: <FileText />,
		badge: 5,
	},
	{
		id: "gallery",
		label: "图库管理",
		href: "/dashboard/gallery",
		icon: <ImageIcon />,
	},
];

const settingsItem: NavigationItem = {
	id: "settings",
	label: "设置",
	href: "/dashboard/settings",
	icon: <Settings />,
};

const logoutItem: NavigationItem = {
	id: "logout",
	label: "登出",
	href: "/api/auth/signout",
	icon: <LogOut />,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex h-screen bg-gray-50/50'>
			<aside className='flex flex-col w-64 bg-white border-r border-gray-100'>
				<div className='h-16 flex items-center px-6 border-b border-gray-100'>
					<h1 className='text-xl font-bold text-gray-800'>Tiny Room</h1>
				</div>
				<div className='flex-1 p-4'>
					<Navigation
						items={navigationItems}
						variant='vertical'
						size='md'
						className='space-y-1'
					/>
				</div>
				<div className='p-4 border-t border-gray-100'>
					<Navigation
						items={[settingsItem, logoutItem]}
						variant='vertical'
						size='md'
						className='space-y-1'
					/>
				</div>
			</aside>
			<main className='flex-1 overflow-y-auto'>{children}</main>
		</div>
	);
}
