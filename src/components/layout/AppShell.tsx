'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { cn } from '@/lib/shared/utils';
import { Logo } from '@/components/ui/Logo';
import { Search } from '@/components/feature/search/Search';
import { ChevronLeft } from 'lucide-react'; // 使用lucide-react作为图标库
import { motion } from 'framer-motion';

const NAV_LINKS = [
    // 示例：为每个链接添加图标
    { href: '/blog', label: '博客', icon: '📝' },
    { href: '/gallery', label: '相册', icon: '🖼️' },
    { href: '/projects', label: '项目', icon: '💼' },
    { href: '/dashboard', label: '仪表盘', icon: '📊' },
];

const NavLinks = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const pathname = usePathname();
    return (
        <nav className="flex flex-col space-y-2">
            {NAV_LINKS.map((link, index) => (
                <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.1 }}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.1, transition: { duration: 0.1, ease: "easeInOut" } }}
                    whileTap={{ scale: 0.9, transition: { duration: 0.1, ease: "easeInOut" } }}
                >
                    <Link
                        key={link.href}
                        href={link.href as any}
                        className={cn(
                            "p-2 rounded-xl flex items-center",
                            isCollapsed ? "justify-center" : "",
                            pathname.startsWith(link.href)
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <span className="text-lg">{link.icon}</span>
                        {!isCollapsed && <span className="ml-2 font-medium">{link.label}</span>}
                    </Link></motion.div>
            ))}
        </nav>
    );
}

const DesktopSidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean, setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <aside
            className={cn(
                "hidden lg:flex h-screen flex-col justify-between items-center border-r border-border bg-background p-4 transition-all duration-300 ease-in-out group sticky top-0",
                isCollapsed ? "w-20" : "w-36"
            )}
        >
            <div className={cn("mb-8", isCollapsed ? "mx-auto" : "")}>
                <Logo showText={!isCollapsed} />
            </div>
            <div className="flex-grow">
                <NavLinks isCollapsed={isCollapsed} />
            </div>
            <div className={cn("flex items-center space-x-2", isCollapsed ? "flex-col space-y-2" : "justify-center")}>
                <Search showIcon={true} />
                <ThemeSwitcher />
            </div>

            {/* 折叠按钮 */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground 
                hover:text-foreground hover:scale-125 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
            >
                <ChevronLeft className={cn("h-4 w-4 transition-transform duration-300", isCollapsed ? "rotate-180" : "rotate-0")} />
            </button>
        </aside>
    );
};

const MobileTopBar = () => {
    return (
        <header className="lg:hidden h-16 border-b border-border flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <Logo showText={true} />
            <div className="flex items-center space-x-2">
                <Search showIcon={true} showText={true} />
                <ThemeSwitcher />
            </div>
        </header>
    );
}


export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground lg:flex">
            <DesktopSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex flex-col flex-1 w-full min-w-0">
                <MobileTopBar />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};
