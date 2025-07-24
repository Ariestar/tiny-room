"use client";

import React from "react";
import { cn } from "@/lib/shared/utils";

export interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 响应式列配置 */
    columns?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    /** 网格间距 */
    gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    /** 是否自动填充 */
    autoFit?: boolean;
    /** 最小列宽（用于 auto-fit） */
    minColumnWidth?: string;
    /** 最大列宽（用于 auto-fit） */
    maxColumnWidth?: string;
    /** 行间距（如果与列间距不同） */
    rowGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    /** 列间距（如果与行间距不同） */
    columnGap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
    children: React.ReactNode;
}

/**
 * 响应式网格组件
 * 基于 CSS Grid 实现，支持移动优先的响应式设计
 */
export function ResponsiveGrid({
    columns = { xs: 1, md: 2, lg: 3 },
    gap = "md",
    autoFit = false,
    minColumnWidth = "250px",
    maxColumnWidth = "1fr",
    rowGap,
    columnGap,
    className,
    children,
    ...props
}: ResponsiveGridProps) {
    // 间距映射
    const gapClasses = {
        none: "gap-0",
        xs: "gap-2",
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8",
        xl: "gap-12",
    };

    // 行间距映射
    const rowGapClasses = {
        none: "row-gap-0",
        xs: "row-gap-2",
        sm: "row-gap-4",
        md: "row-gap-6",
        lg: "row-gap-8",
        xl: "row-gap-12",
    };

    // 列间距映射
    const columnGapClasses = {
        none: "column-gap-0",
        xs: "column-gap-2",
        sm: "column-gap-4",
        md: "column-gap-6",
        lg: "column-gap-8",
        xl: "column-gap-12",
    };

    // 构建响应式网格列类
    const buildGridColumns = () => {
        if (autoFit) {
            return `grid-cols-[repeat(auto-fit,minmax(${minColumnWidth},${maxColumnWidth}))]`;
        }

        const classes = [];
        if (columns.xs) classes.push(`grid-cols-${columns.xs}`);
        if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
        if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
        if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
        if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
        if (columns["2xl"]) classes.push(`2xl:grid-cols-${columns["2xl"]}`);
        return classes.join(" ");
    };

    // 构建间距类
    const buildGapClasses = () => {
        const classes = [];

        // 如果指定了具体的行间距和列间距
        if (rowGap && columnGap) {
            classes.push(rowGapClasses[rowGap], columnGapClasses[columnGap]);
        } else if (rowGap || columnGap) {
            // 如果只指定了其中一个
            if (rowGap) classes.push(rowGapClasses[rowGap]);
            if (columnGap) classes.push(columnGapClasses[columnGap]);
            // 对于未指定的，使用默认间距
            if (!rowGap) classes.push(rowGapClasses[gap]);
            if (!columnGap) classes.push(columnGapClasses[gap]);
        } else {
            // 使用统一间距
            classes.push(gapClasses[gap]);
        }

        return classes.join(" ");
    };

    const gridClasses = cn(
        "grid",
        buildGridColumns(),
        buildGapClasses(),
        className
    );

    return (
        <div className={gridClasses} {...props}>
            {children}
        </div>
    );
}

/**
 * 响应式网格项组件
 * 用于控制单个网格项的跨列和跨行
 */
export interface ResponsiveGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 跨列配置 */
    colSpan?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    /** 跨行配置 */
    rowSpan?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    /** 列起始位置 */
    colStart?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    /** 行起始位置 */
    rowStart?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        "2xl"?: number;
    };
    children: React.ReactNode;
}

export function ResponsiveGridItem({
    colSpan,
    rowSpan,
    colStart,
    rowStart,
    className,
    children,
    ...props
}: ResponsiveGridItemProps) {
    // 构建跨列类
    const buildColSpanClasses = () => {
        if (!colSpan) return "";
        const classes = [];
        if (colSpan.xs) classes.push(`col-span-${colSpan.xs}`);
        if (colSpan.sm) classes.push(`sm:col-span-${colSpan.sm}`);
        if (colSpan.md) classes.push(`md:col-span-${colSpan.md}`);
        if (colSpan.lg) classes.push(`lg:col-span-${colSpan.lg}`);
        if (colSpan.xl) classes.push(`xl:col-span-${colSpan.xl}`);
        if (colSpan["2xl"]) classes.push(`2xl:col-span-${colSpan["2xl"]}`);
        return classes.join(" ");
    };

    // 构建跨行类
    const buildRowSpanClasses = () => {
        if (!rowSpan) return "";
        const classes = [];
        if (rowSpan.xs) classes.push(`row-span-${rowSpan.xs}`);
        if (rowSpan.sm) classes.push(`sm:row-span-${rowSpan.sm}`);
        if (rowSpan.md) classes.push(`md:row-span-${rowSpan.md}`);
        if (rowSpan.lg) classes.push(`lg:row-span-${rowSpan.lg}`);
        if (rowSpan.xl) classes.push(`xl:row-span-${rowSpan.xl}`);
        if (rowSpan["2xl"]) classes.push(`2xl:row-span-${rowSpan["2xl"]}`);
        return classes.join(" ");
    };

    // 构建列起始类
    const buildColStartClasses = () => {
        if (!colStart) return "";
        const classes = [];
        if (colStart.xs) classes.push(`col-start-${colStart.xs}`);
        if (colStart.sm) classes.push(`sm:col-start-${colStart.sm}`);
        if (colStart.md) classes.push(`md:col-start-${colStart.md}`);
        if (colStart.lg) classes.push(`lg:col-start-${colStart.lg}`);
        if (colStart.xl) classes.push(`xl:col-start-${colStart.xl}`);
        if (colStart["2xl"]) classes.push(`2xl:col-start-${colStart["2xl"]}`);
        return classes.join(" ");
    };

    // 构建行起始类
    const buildRowStartClasses = () => {
        if (!rowStart) return "";
        const classes = [];
        if (rowStart.xs) classes.push(`row-start-${rowStart.xs}`);
        if (rowStart.sm) classes.push(`sm:row-start-${rowStart.sm}`);
        if (rowStart.md) classes.push(`md:row-start-${rowStart.md}`);
        if (rowStart.lg) classes.push(`lg:row-start-${rowStart.lg}`);
        if (rowStart.xl) classes.push(`xl:row-start-${rowStart.xl}`);
        if (rowStart["2xl"]) classes.push(`2xl:row-start-${rowStart["2xl"]}`);
        return classes.join(" ");
    };

    const itemClasses = cn(
        buildColSpanClasses(),
        buildRowSpanClasses(),
        buildColStartClasses(),
        buildRowStartClasses(),
        className
    );

    return (
        <div className={itemClasses} {...props}>
            {children}
        </div>
    );
}

/**
 * 预设的响应式网格配置
 */
export const gridPresets = {
    // 博客文章网格
    blog: {
        columns: { xs: 1, md: 2, lg: 3 },
        gap: "lg" as const,
    },
    // 项目展示网格
    projects: {
        columns: { xs: 1, sm: 2, lg: 3, xl: 4 },
        gap: "md" as const,
    },
    // 图片画廊网格
    gallery: {
        autoFit: true,
        minColumnWidth: "250px",
        gap: "sm" as const,
    },
    // 特性展示网格
    features: {
        columns: { xs: 1, md: 2, lg: 3 },
        gap: "lg" as const,
    },
    // 统计卡片网格
    stats: {
        columns: { xs: 2, md: 4 },
        gap: "md" as const,
    },
    // 社交媒体网格
    social: {
        columns: { xs: 2, sm: 4, md: 6 },
        gap: "sm" as const,
    },
} as const;

/**
 * 使用预设的响应式网格组件
 */
export interface PresetGridProps extends Omit<ResponsiveGridProps, "columns" | "gap" | "autoFit" | "minColumnWidth"> {
    preset: keyof typeof gridPresets;
}

export function PresetGrid({ preset, ...props }: PresetGridProps) {
    const config = gridPresets[preset];
    return <ResponsiveGrid {...config} {...props} />;
}