"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import { MobileNavigation } from "./MobileNavigation";

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: NavItem[];
}

interface SmartNavigationProps {
    items: NavItem[];
    className?: string;
    variant?: "horizontal" | "vertical" | "tabs" | "pills" | "minimal";
    sticky?: boolean;
    showBrand?: boolean;
    brandText?: string;
    brandHref?: string;
    onItemClick?: (item: NavItem) => void;
}

// 常用图标组件
const HomeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const BlogIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
);

const ProjectIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const GalleryIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const AboutIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

// 默认导航项配置
const defaultNavItems: NavItem[] = [
    {
        id: "home",
        label: "首页",
        href: "/",
        icon: <HomeIcon className="w-5 h-5" />,
    },
    {
        id: "blog",
        label: "博客",
        href: "/blog",
        icon: <BlogIcon className="w-5 h-5" />,
        children: [
            { id: "blog-all", label: "所有文章", href: "/blog" },
            { id: "blog-tech", label: "技术文章", href: "/blog?category=tech" },
            { id: "blog-life", label: "生活随笔", href: "/blog?category=life" },
        ],
    },
    {
        id: "projects",
        label: "项目",
        href: "/projects",
        icon: <ProjectIcon className="w-5 h-5" />,
    },
    {
        id: "gallery",
        label: "画廊",
        href: "/gallery",
        icon: <GalleryIcon className="w-5 h-5" />,
    },
    {
        id: "about",
        label: "关于",
        href: "/about",
        icon: <AboutIcon className="w-5 h-5" />,
    },
];

export function SmartNavigation({
    items = defaultNavItems,
    className = "",
    variant = "horizontal",
    sticky = true,
    showBrand = true,
    brandText = "Tiny Room",
    brandHref = "/",
    onItemClick,
}: SmartNavigationProps) {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    // 检测移动端
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 为导航项添加活跃状态
    const itemsWithActive = items.map(item => ({
        ...item,
        active: pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)),
        children: item.children?.map(child => ({
            ...child,
            active: pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href)),
        })),
    }));

    // 移动端渲染
    if (isMobile) {
        return (
            <MobileNavigation
                items={itemsWithActive}
                className={className}
                onItemClick={onItemClick}
                hideOnScroll={true}
            />
        );
    }

    // 桌面端渲染
    return (
        <div className={`${sticky ? 'sticky top-0 z-50' : ''} ${className}`}>
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* 品牌区域 */}
                        {showBrand && (
                            <div className="flex items-center space-x-4">
                                <a href={brandHref} className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">T</span>
                                    </div>
                                    <span className="font-bold text-xl text-gray-900 dark:text-white">
                                        {brandText}
                                    </span>
                                </a>
                            </div>
                        )}

                        {/* 导航区域 */}
                        <div className="flex-1 flex justify-center">
                            <Navigation
                                items={itemsWithActive as any}
                                variant={variant as any}
                                size="md"
                                align="center"
                                onItemClick={onItemClick as any}
                                className="max-w-2xl"
                            />
                        </div>

                        {/* 右侧操作区域 */}
                        <div className="flex items-center space-x-4">
                            {/* 搜索按钮 */}
                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                title="搜索"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* 主题切换按钮 */}
                            <button
                                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                title="切换主题"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 预设的导航配置
export function BlogNavigation(props: Omit<SmartNavigationProps, 'items'>) {
    return <SmartNavigation {...props} items={defaultNavItems} />;
}

export function MinimalNavigation(props: Omit<SmartNavigationProps, 'variant'>) {
    return <SmartNavigation {...props} variant="minimal" />;
}

export function TabsNavigation(props: Omit<SmartNavigationProps, 'variant'>) {
    return <SmartNavigation {...props} variant="tabs" />;
}