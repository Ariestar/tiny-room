"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileNavItem {
    id: string;
    label: string;
    href: string;
    icon?: React.ReactNode;
    badge?: number;
    children?: MobileNavItem[];
}

interface MobileNavigationProps {
    items: MobileNavItem[];
    className?: string;
    onItemClick?: (item: MobileNavItem) => void;
    showOnScroll?: boolean;
    hideOnScroll?: boolean;
}

// 汉堡菜单图标
const MenuIcon = ({ isOpen, className }: { isOpen: boolean; className?: string }) => (
    <div className={`relative w-6 h-6 ${className}`}>
        <motion.span
            className="absolute left-0 block w-full h-0.5 bg-current transform transition-all duration-300"
            animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 4,
            }}
        />
        <motion.span
            className="absolute left-0 block w-full h-0.5 bg-current transform transition-all duration-300"
            animate={{
                opacity: isOpen ? 0 : 1,
                y: 8,
            }}
        />
        <motion.span
            className="absolute left-0 block w-full h-0.5 bg-current transform transition-all duration-300"
            animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 8 : 12,
            }}
        />
    </div>
);

// 返回图标
const BackIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

// 向右箭头图标
const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export function MobileNavigation({
    items,
    className = "",
    onItemClick,
    showOnScroll = false,
    hideOnScroll = true,
}: MobileNavigationProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const pathname = usePathname();
    const menuRef = useRef<HTMLDivElement>(null);

    // 滚动控制导航栏显示/隐藏
    useEffect(() => {
        if (!hideOnScroll && !showOnScroll) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (hideOnScroll) {
                // 向下滚动隐藏，向上滚动显示
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY) {
                    setIsVisible(true);
                }
            }

            if (showOnScroll) {
                // 滚动时显示
                setIsVisible(currentScrollY > 100);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY, hideOnScroll, showOnScroll]);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setActiveSubmenu(null);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // 路径变化时关闭菜单
    useEffect(() => {
        setIsOpen(false);
        setActiveSubmenu(null);
    }, [pathname]);

    const handleItemClick = (item: MobileNavItem) => {
        if (item.children && item.children.length > 0) {
            setActiveSubmenu(activeSubmenu === item.id ? null : item.id);
        } else {
            setIsOpen(false);
            setActiveSubmenu(null);
            onItemClick?.(item);
        }
    };

    const isActiveItem = (href: string) => {
        return pathname === href || (href !== '/' && pathname.startsWith(href));
    };

    return (
        <>
            {/* 移动端导航栏 */}
            <motion.div
                className={`fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 md:hidden ${className}`}
                initial={{ y: 0 }}
                animate={{ y: isVisible ? 0 : -100 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    {/* Logo/品牌 */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">T</span>
                        </div>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Tiny Room</span>
                    </Link>

                    {/* 汉堡菜单按钮 */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        aria-label="打开菜单"
                    >
                        <MenuIcon isOpen={isOpen} />
                    </button>
                </div>
            </motion.div>

            {/* 移动端菜单覆盖层 */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* 背景遮罩 */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* 菜单内容 */}
                        <motion.div
                            ref={menuRef}
                            className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 md:hidden"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                        >
                            {/* 菜单头部 */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {activeSubmenu ? '子菜单' : '导航菜单'}
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    aria-label="关闭菜单"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* 菜单内容 */}
                            <div className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {activeSubmenu ? (
                                        // 子菜单视图
                                        <motion.div
                                            key="submenu"
                                            initial={{ x: 300, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -300, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-4"
                                        >
                                            {/* 返回按钮 */}
                                            <button
                                                onClick={() => setActiveSubmenu(null)}
                                                className="flex items-center gap-2 p-3 w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
                                            >
                                                <BackIcon className="w-5 h-5" />
                                                返回
                                            </button>

                                            {/* 子菜单项 */}
                                            {items
                                                .find(item => item.id === activeSubmenu)
                                                ?.children?.map((subItem, index) => (
                                                    <motion.div
                                                        key={subItem.id}
                                                        initial={{ x: 50, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveItem(subItem.href)
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                }`}
                                                            onClick={() => handleItemClick(subItem)}
                                                        >
                                                            {subItem.icon && (
                                                                <span className="w-5 h-5 flex-shrink-0">
                                                                    {subItem.icon}
                                                                </span>
                                                            )}
                                                            <span className="flex-1">{subItem.label}</span>
                                                            {subItem.badge && (
                                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    {subItem.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                        </motion.div>
                                    ) : (
                                        // 主菜单视图
                                        <motion.div
                                            key="mainmenu"
                                            initial={{ x: -300, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 300, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-4"
                                        >
                                            {items.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    initial={{ x: 50, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="mb-2"
                                                >
                                                    {item.children && item.children.length > 0 ? (
                                                        // 有子菜单的项目
                                                        <button
                                                            onClick={() => handleItemClick(item)}
                                                            className="flex items-center gap-3 p-3 w-full text-left rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                                        >
                                                            {item.icon && (
                                                                <span className="w-5 h-5 flex-shrink-0">
                                                                    {item.icon}
                                                                </span>
                                                            )}
                                                            <span className="flex-1">{item.label}</span>
                                                            {item.badge && (
                                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                            <ChevronRightIcon className="w-5 h-5 flex-shrink-0" />
                                                        </button>
                                                    ) : (
                                                        // 普通链接项目
                                                        <Link
                                                            href={item.href}
                                                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActiveItem(item.href)
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                                }`}
                                                            onClick={() => handleItemClick(item)}
                                                        >
                                                            {item.icon && (
                                                                <span className="w-5 h-5 flex-shrink-0">
                                                                    {item.icon}
                                                                </span>
                                                            )}
                                                            <span className="flex-1">{item.label}</span>
                                                            {item.badge && (
                                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    {item.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* 菜单底部 */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    © 2024 Tiny Room. All rights reserved.
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}