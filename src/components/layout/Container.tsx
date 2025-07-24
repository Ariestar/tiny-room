"use client";

import React from "react";
import { cn } from "@/lib/shared/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 容器尺寸变体 */
    size?: "sm" | "md" | "lg" | "xl" | "full";
    /** 是否居中对齐 */
    center?: boolean;
    /** 是否添加垂直内边距 */
    paddingY?: boolean;
    /** 是否添加水平内边距 */
    paddingX?: boolean;
    /** 自定义最大宽度 */
    maxWidth?: string;
    children: React.ReactNode;
}

/**
 * 响应式容器组件
 * 提供一致的内容宽度和间距管理
 */
export function Container({
    size = "lg",
    center = true,
    paddingY = true,
    paddingX = true,
    maxWidth,
    className,
    children,
    ...props
}: ContainerProps) {
    // 容器尺寸映射
    const sizeClasses = {
        sm: "max-w-2xl", // 672px
        md: "max-w-4xl", // 896px
        lg: "max-w-6xl", // 1152px
        xl: "max-w-7xl", // 1280px
        full: "max-w-none", // 无限制
    };

    const containerClasses = cn(
        "w-full",
        center && "mx-auto",
        paddingX && "px-4 sm:px-6 lg:px-8",
        paddingY && "py-8 sm:py-12 lg:py-16",
        maxWidth ? "" : sizeClasses[size],
        className
    );

    const style = maxWidth ? { maxWidth } : undefined;

    return (
        <div className={containerClasses} style={style} {...props}>
            {children}
        </div>
    );
}

/**
 * 网格容器组件
 * 提供响应式网格布局
 */
export interface GridContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 网格列数配置 */
    cols?: {
        default?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    /** 网格间距 */
    gap?: "sm" | "md" | "lg" | "xl";
    /** 是否自动填充 */
    autoFit?: boolean;
    /** 最小列宽（用于 auto-fit） */
    minColWidth?: string;
    children: React.ReactNode;
}

export function GridContainer({
    cols = { default: 1, md: 2, lg: 3 },
    gap = "md",
    autoFit = false,
    minColWidth = "300px",
    className,
    children,
    ...props
}: GridContainerProps) {
    // 间距映射
    const gapClasses = {
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12",
    };

    // 构建响应式网格类
    const buildGridCols = () => {
        if (autoFit) {
            return `grid-cols-[repeat(auto-fit,minmax(${minColWidth},1fr))]`;
        }

        const classes = [];
        if (cols.default) classes.push(`grid-cols-${cols.default}`);
        if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
        if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
        if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
        if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
        return classes.join(" ");
    };

    const gridClasses = cn("grid", buildGridCols(), gapClasses[gap], className);

    return (
        <div className={gridClasses} {...props}>
            {children}
        </div>
    );
}

/**
 * 弹性容器组件
 * 提供灵活的弹性布局
 */
export interface FlexContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 主轴方向 */
    direction?: "row" | "col" | "row-reverse" | "col-reverse";
    /** 主轴对齐 */
    justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
    /** 交叉轴对齐 */
    align?: "start" | "end" | "center" | "baseline" | "stretch";
    /** 是否换行 */
    wrap?: boolean;
    /** 间距 */
    gap?: "sm" | "md" | "lg" | "xl";
    /** 响应式配置 */
    responsive?: {
        sm?: Partial<Pick<FlexContainerProps, "direction" | "justify" | "align">>;
        md?: Partial<Pick<FlexContainerProps, "direction" | "justify" | "align">>;
        lg?: Partial<Pick<FlexContainerProps, "direction" | "justify" | "align">>;
    };
    children: React.ReactNode;
}

export function FlexContainer({
    direction = "row",
    justify = "start",
    align = "start",
    wrap = false,
    gap = "md",
    responsive,
    className,
    children,
    ...props
}: FlexContainerProps) {
    // 方向映射
    const directionClasses = {
        row: "flex-row",
        col: "flex-col",
        "row-reverse": "flex-row-reverse",
        "col-reverse": "flex-col-reverse",
    };

    // 主轴对齐映射
    const justifyClasses = {
        start: "justify-start",
        end: "justify-end",
        center: "justify-center",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
    };

    // 交叉轴对齐映射
    const alignClasses = {
        start: "items-start",
        end: "items-end",
        center: "items-center",
        baseline: "items-baseline",
        stretch: "items-stretch",
    };

    // 间距映射
    const gapClasses = {
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12",
    };

    // 构建响应式类
    const buildResponsiveClasses = () => {
        const classes = [];
        if (responsive?.sm) {
            if (responsive.sm.direction)
                classes.push(`sm:${directionClasses[responsive.sm.direction]}`);
            if (responsive.sm.justify)
                classes.push(`sm:${justifyClasses[responsive.sm.justify]}`);
            if (responsive.sm.align) classes.push(`sm:${alignClasses[responsive.sm.align]}`);
        }
        if (responsive?.md) {
            if (responsive.md.direction)
                classes.push(`md:${directionClasses[responsive.md.direction]}`);
            if (responsive.md.justify)
                classes.push(`md:${justifyClasses[responsive.md.justify]}`);
            if (responsive.md.align) classes.push(`md:${alignClasses[responsive.md.align]}`);
        }
        if (responsive?.lg) {
            if (responsive.lg.direction)
                classes.push(`lg:${directionClasses[responsive.lg.direction]}`);
            if (responsive.lg.justify)
                classes.push(`lg:${justifyClasses[responsive.lg.justify]}`);
            if (responsive.lg.align) classes.push(`lg:${alignClasses[responsive.lg.align]}`);
        }
        return classes.join(" ");
    };

    const flexClasses = cn(
        "flex",
        directionClasses[direction],
        justifyClasses[justify],
        alignClasses[align],
        wrap && "flex-wrap",
        gapClasses[gap],
        buildResponsiveClasses(),
        className
    );

    return (
        <div className={flexClasses} {...props}>
            {children}
        </div>
    );
}