"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMobileOptimization, useMobileLayoutOptimization } from "@/hooks/useMobileOptimization";

interface MobileOptimizedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 容器变体 */
    variant?: "default" | "hero" | "content" | "card";
    /** 是否启用移动端优化 */
    enableMobileOptimization?: boolean;
    /** 是否启用触控优化 */
    enableTouchOptimization?: boolean;
    /** 是否启用性能优化 */
    enablePerformanceOptimization?: boolean;
    /** 自定义移动端类名 */
    mobileClassName?: string;
    /** 自定义平板端类名 */
    tabletClassName?: string;
    /** 自定义桌面端类名 */
    desktopClassName?: string;
    children: React.ReactNode;
}

/**
 * 移动端优化容器组件
 * 根据设备类型自动应用优化样式
 */
export function MobileOptimizedContainer({
    variant = "default",
    enableMobileOptimization = true,
    enableTouchOptimization = true,
    enablePerformanceOptimization = true,
    mobileClassName,
    tabletClassName,
    desktopClassName,
    className,
    children,
    ...props
}: MobileOptimizedContainerProps) {
    const { isMobile, isTablet, isDesktop, isTouchDevice } = useMobileOptimization();
    const { layoutClasses, spacing } = useMobileLayoutOptimization();

    // 根据设备类型选择类名
    const getDeviceClassName = () => {
        if (isMobile && mobileClassName) return mobileClassName;
        if (isTablet && tabletClassName) return tabletClassName;
        if (isDesktop && desktopClassName) return desktopClassName;
        return "";
    };

    // 根据变体获取基础样式
    const getVariantStyles = () => {
        switch (variant) {
            case "hero":
                return {
                    padding: isMobile ? spacing.lg : spacing.xl,
                    minHeight: isMobile ? "60vh" : "70vh",
                };
            case "content":
                return {
                    padding: isMobile ? spacing.md : spacing.lg,
                    maxWidth: isMobile ? "100%" : "1200px",
                    margin: "0 auto",
                };
            case "card":
                return {
                    padding: isMobile ? spacing.sm : spacing.md,
                    borderRadius: isMobile ? "0.75rem" : "1rem",
                };
            default:
                return {
                    padding: isMobile ? spacing.md : spacing.lg,
                };
        }
    };

    const containerClasses = cn(
        // 基础样式
        "relative",

        // 移动端优化样式
        enableMobileOptimization && [
            isMobile && "mobile-optimized",
            isMobile && layoutClasses.container,
            isMobile && layoutClasses.spacing,
        ],

        // 触控优化样式
        enableTouchOptimization && [
            isTouchDevice && "touch-optimized",
            isMobile && "mobile-touch-feedback",
        ],

        // 性能优化样式
        enablePerformanceOptimization && [
            isMobile && "mobile-performance-optimized",
        ],

        // 设备特定类名
        getDeviceClassName(),

        // 自定义类名
        className
    );

    const containerStyles = {
        ...getVariantStyles(),
    };

    return (
        <div
            className={containerClasses}
            style={containerStyles}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * 移动端优化网格容器
 */
interface MobileOptimizedGridProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 网格列配置 */
    columns?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    /** 网格间距 */
    gap?: "xs" | "sm" | "md" | "lg" | "xl";
    /** 是否自适应 */
    autoFit?: boolean;
    /** 最小列宽 */
    minColumnWidth?: string;
    children: React.ReactNode;
}

export function MobileOptimizedGrid({
    columns = { mobile: 1, tablet: 2, desktop: 3 },
    gap = "md",
    autoFit = false,
    minColumnWidth = "250px",
    className,
    children,
    ...props
}: MobileOptimizedGridProps) {
    const { isMobile, isTablet, isDesktop } = useMobileOptimization();
    const { spacing } = useMobileLayoutOptimization();

    // 获取当前设备的列数
    const getCurrentColumns = () => {
        if (isMobile) return columns.mobile || 1;
        if (isTablet) return columns.tablet || 2;
        return columns.desktop || 3;
    };

    // 获取间距值
    const getGapValue = () => {
        return spacing[gap] || spacing.md;
    };

    const gridClasses = cn(
        "grid",
        autoFit ? `grid-cols-[repeat(auto-fit,minmax(${minColumnWidth},1fr))]` : `grid-cols-${getCurrentColumns()}`,
        isMobile && "mobile-grid-optimized",
        className
    );

    const gridStyles = {
        gap: getGapValue(),
    };

    return (
        <div
            className={gridClasses}
            style={gridStyles}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * 移动端优化文本容器
 */
interface MobileOptimizedTextProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 文本大小 */
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    /** 文本对齐 */
    align?: "left" | "center" | "right";
    /** 是否启用移动端文本优化 */
    enableMobileTextOptimization?: boolean;
    children: React.ReactNode;
}

export function MobileOptimizedText({
    size = "base",
    align = "left",
    enableMobileTextOptimization = true,
    className,
    children,
    ...props
}: MobileOptimizedTextProps) {
    const { isMobile } = useMobileOptimization();
    const { fontSize } = useMobileLayoutOptimization();

    const textClasses = cn(
        // 基础对齐
        `text-${align}`,

        // 移动端文本优化
        enableMobileTextOptimization && [
            isMobile && "mobile-text-optimized",
            isMobile && align === "center" && "mobile-text-center",
        ],

        className
    );

    const textStyles = {
        fontSize: fontSize[size],
        lineHeight: isMobile ? "1.5" : "1.6",
    };

    return (
        <div
            className={textClasses}
            style={textStyles}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * 移动端优化按钮容器
 */
interface MobileOptimizedButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 按钮排列方向 */
    direction?: "row" | "column" | "auto";
    /** 按钮间距 */
    spacing?: "xs" | "sm" | "md" | "lg";
    /** 是否全宽 */
    fullWidth?: boolean;
    children: React.ReactNode;
}

export function MobileOptimizedButtonGroup({
    direction = "auto",
    spacing = "md",
    fullWidth = false,
    className,
    children,
    ...props
}: MobileOptimizedButtonGroupProps) {
    const { isMobile } = useMobileOptimization();
    const { spacing: spacingValues } = useMobileLayoutOptimization();

    // 自动方向：移动端垂直，桌面端水平
    const getDirection = () => {
        if (direction === "auto") {
            return isMobile ? "column" : "row";
        }
        return direction;
    };

    const buttonGroupClasses = cn(
        "flex",
        getDirection() === "column" ? "flex-col" : "flex-row",
        getDirection() === "row" ? "items-center justify-center" : "items-stretch",
        fullWidth && "w-full",
        isMobile && "mobile-button-group",
        className
    );

    const buttonGroupStyles = {
        gap: spacingValues[spacing],
    };

    return (
        <div
            className={buttonGroupClasses}
            style={buttonGroupStyles}
            {...props}
        >
            {children}
        </div>
    );
}

/**
 * 移动端优化卡片容器
 */
interface MobileOptimizedCardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 卡片变体 */
    variant?: "default" | "compact" | "elevated";
    /** 是否启用触控反馈 */
    enableTouchFeedback?: boolean;
    /** 点击事件 */
    onClick?: () => void;
    children: React.ReactNode;
}

export function MobileOptimizedCard({
    variant = "default",
    enableTouchFeedback = true,
    onClick,
    className,
    children,
    ...props
}: MobileOptimizedCardProps) {
    const { isMobile, isTouchDevice } = useMobileOptimization();
    const { spacing } = useMobileLayoutOptimization();

    // 根据变体获取样式
    const getVariantStyles = () => {
        switch (variant) {
            case "compact":
                return {
                    padding: isMobile ? spacing.sm : spacing.md,
                    borderRadius: "0.75rem",
                };
            case "elevated":
                return {
                    padding: isMobile ? spacing.md : spacing.lg,
                    borderRadius: "1rem",
                    boxShadow: isMobile
                        ? "0 2px 8px rgba(0, 0, 0, 0.1)"
                        : "0 4px 16px rgba(0, 0, 0, 0.1)",
                };
            default:
                return {
                    padding: isMobile ? spacing.md : spacing.lg,
                    borderRadius: "0.75rem",
                };
        }
    };

    const cardClasses = cn(
        "bg-card border border-border",
        onClick && "cursor-pointer",
        enableTouchFeedback && isTouchDevice && "mobile-touch-feedback",
        isMobile && "mobile-card-optimized",
        className
    );

    const cardStyles = {
        ...getVariantStyles(),
    };

    if (onClick) {
        return (
            <motion.div
                className={cardClasses}
                style={cardStyles}
                onClick={onClick}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                {...(props as any)}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div
            className={cardClasses}
            style={cardStyles}
            {...props}
        >
            {children}
        </div>
    );
}