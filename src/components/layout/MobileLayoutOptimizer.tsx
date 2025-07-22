"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

interface MobileLayoutOptimizerProps {
    children: React.ReactNode;
    /** 是否启用移动端导航优化 */
    enableMobileNav?: boolean;
    /** 是否启用触控优化 */
    enableTouchOptimization?: boolean;
    /** 是否启用性能优化 */
    enablePerformanceOptimization?: boolean;
    /** 是否启用安全区域适配 */
    enableSafeArea?: boolean;
    /** 自定义类名 */
    className?: string;
}

/**
 * 移动端布局优化器
 * 提供全面的移动端布局优化功能
 */
export function MobileLayoutOptimizer({
    children,
    enableMobileNav = true,
    enableTouchOptimization = true,
    enablePerformanceOptimization = true,
    enableSafeArea = true,
    className
}: MobileLayoutOptimizerProps) {
    const { isMobile, isTablet, isTouchDevice } = useMobileOptimization();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    // 监听键盘显示/隐藏
    useEffect(() => {
        if (!isMobile) return;

        const handleResize = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const windowHeight = window.screen.height;
            const keyboardThreshold = windowHeight * 0.75;

            setIsKeyboardVisible(viewportHeight < keyboardThreshold);
        };

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleResize);
            return () => window.visualViewport?.removeEventListener('resize', handleResize);
        } else {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isMobile]);

    const containerClasses = cn(
        "min-h-screen",

        // 移动端基础优化
        isMobile && [
            "mobile-optimized-container",
            enableSafeArea && "mobile-safe-area",
            enableTouchOptimization && "mobile-touch-optimized",
            enablePerformanceOptimization && "mobile-performance-optimized",
            isKeyboardVisible && "mobile-keyboard-aware"
        ],

        // 平板端优化
        isTablet && "tablet-optimized-container",

        className
    );

    return (
        <div className={containerClasses}>
            {/* 移动端导航栏 */}
            {enableMobileNav && isMobile && (
                <MobileNavigationBar isKeyboardVisible={isKeyboardVisible} />
            )}

            {/* 主要内容区域 */}
            <main className={cn(
                "relative",
                isMobile && enableMobileNav && "pb-20", // 为底部导航留出空间
                isKeyboardVisible && "pb-0" // 键盘显示时移除底部间距
            )}>
                {children}
            </main>

            {/* 移动端辅助功能 */}
            {isMobile && (
                <MobileAccessibilityHelper
                    enableTouchOptimization={enableTouchOptimization}
                />
            )}
        </div>
    );
}

/**
 * 移动端导航栏组件
 */
interface MobileNavigationBarProps {
    isKeyboardVisible: boolean;
}

function MobileNavigationBar({ isKeyboardVisible }: MobileNavigationBarProps) {
    const navItems = [
        { icon: "🏠", label: "首页", href: "/" },
        { icon: "📝", label: "博客", href: "/blog" },
        { icon: "💻", label: "项目", href: "/projects" },
        { icon: "📸", label: "画廊", href: "/gallery" },
        { icon: "👤", label: "关于", href: "/about" }
    ];

    return (
        <AnimatePresence>
            {!isKeyboardVisible && (
                <motion.nav
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="mobile-nav-optimized"
                >
                    <div className="mobile-nav-items">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={item.href}
                                href={item.href}
                                className="mobile-nav-item"
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span className="mobile-nav-icon text-lg">
                                    {item.icon}
                                </span>
                                <span className="mobile-nav-label">
                                    {item.label}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    );
}

/**
 * 移动端无障碍辅助组件
 */
interface MobileAccessibilityHelperProps {
    enableTouchOptimization: boolean;
}

function MobileAccessibilityHelper({ enableTouchOptimization }: MobileAccessibilityHelperProps) {
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <>
            {/* 回到顶部按钮 */}
            <AnimatePresence>
                {showScrollToTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={scrollToTop}
                        className={cn(
                            "fixed bottom-24 right-4 z-50",
                            "w-12 h-12 bg-primary text-primary-foreground",
                            "rounded-full shadow-lg",
                            "flex items-center justify-center",
                            "touch-target",
                            enableTouchOptimization && "mobile-touch-feedback"
                        )}
                        whileTap={{ scale: 0.9 }}
                        aria-label="回到顶部"
                    >
                        <span className="text-lg">↑</span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 触控反馈样式注入 */}
            {enableTouchOptimization && (
                <style jsx global>{`
                    .mobile-touch-feedback:active {
                        background-color: rgba(0, 0, 0, 0.05);
                        transform: scale(0.98);
                        transition: all 0.1s ease-out;
                    }
                `}</style>
            )}
        </>
    );
}

/**
 * 移动端响应式容器
 */
interface MobileResponsiveContainerProps {
    children: React.ReactNode;
    /** 容器最大宽度 */
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    /** 内边距大小 */
    padding?: "none" | "sm" | "md" | "lg" | "xl";
    /** 是否居中 */
    centered?: boolean;
    /** 自定义类名 */
    className?: string;
}

export function MobileResponsiveContainer({
    children,
    maxWidth = "lg",
    padding = "md",
    centered = true,
    className
}: MobileResponsiveContainerProps) {
    const { isMobile, isTablet } = useMobileOptimization();

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-full"
    };

    const paddingClasses = {
        none: "",
        sm: isMobile ? "px-3 py-2" : "px-4 py-3",
        md: isMobile ? "px-4 py-3" : "px-6 py-4",
        lg: isMobile ? "px-6 py-4" : "px-8 py-6",
        xl: isMobile ? "px-8 py-6" : "px-12 py-8"
    };

    const containerClasses = cn(
        "w-full",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        centered && "mx-auto",

        // 移动端特定优化
        isMobile && [
            "mobile-responsive-container",
            "mobile-text-optimized"
        ],

        // 平板端优化
        isTablet && "tablet-responsive-container",

        className
    );

    return (
        <div className={containerClasses}>
            {children}
        </div>
    );
}

/**
 * 移动端优化的文本组件
 */
interface MobileOptimizedTextProps {
    children: React.ReactNode;
    /** 文本大小 */
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    /** 文本权重 */
    weight?: "normal" | "medium" | "semibold" | "bold";
    /** 文本颜色 */
    color?: "primary" | "secondary" | "muted" | "accent";
    /** 是否启用移动端优化 */
    mobileOptimized?: boolean;
    /** 自定义类名 */
    className?: string;
}

export function MobileOptimizedText({
    children,
    size = "base",
    weight = "normal",
    color = "primary",
    mobileOptimized = true,
    className
}: MobileOptimizedTextProps) {
    const { isMobile } = useMobileOptimization();

    // 移动端字体大小映射
    const mobileSizeMap = {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-sm sm:text-base",
        lg: "text-base sm:text-lg",
        xl: "text-lg sm:text-xl",
        "2xl": "text-xl sm:text-2xl",
        "3xl": "text-2xl sm:text-3xl",
        "4xl": "text-3xl sm:text-4xl"
    };

    const desktopSizeMap = {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl"
    };

    const weightClasses = {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
    };

    const colorClasses = {
        primary: "text-foreground",
        secondary: "text-muted-foreground",
        muted: "text-muted-foreground/70",
        accent: "text-accent-foreground"
    };

    const textClasses = cn(
        // 基础样式
        weightClasses[weight],
        colorClasses[color],

        // 响应式字体大小
        mobileOptimized && isMobile ? mobileSizeMap[size] : desktopSizeMap[size],

        // 移动端文本优化
        mobileOptimized && isMobile && [
            "mobile-text-optimized",
            "leading-relaxed"
        ],

        className
    );

    return (
        <span className={textClasses}>
            {children}
        </span>
    );
}