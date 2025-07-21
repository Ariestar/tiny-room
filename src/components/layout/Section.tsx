"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Container, ContainerProps } from "./Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    /** 区域变体 */
    variant?: "default" | "primary" | "secondary" | "accent" | "muted";
    /** 区域尺寸 */
    size?: "sm" | "md" | "lg" | "xl";
    /** 是否全宽 */
    fullWidth?: boolean;
    /** 容器配置 */
    container?: Omit<ContainerProps, "children">;
    /** 背景图案 */
    pattern?: "none" | "dots" | "grid" | "gradient";
    /** 是否有边框 */
    bordered?: boolean;
    children: React.ReactNode;
}

/**
 * 页面区域组件
 * 提供一致的区域样式和布局
 */
export function Section({
    variant = "default",
    size = "lg",
    fullWidth = false,
    container,
    pattern = "none",
    bordered = false,
    className,
    children,
    ...props
}: SectionProps) {
    // 变体样式映射
    const variantClasses = {
        default: "bg-background text-foreground",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        accent: "bg-accent text-accent-foreground",
        muted: "bg-muted text-muted-foreground",
    };

    // 尺寸映射（影响内边距）
    const sizeClasses = {
        sm: "py-12 sm:py-16",
        md: "py-16 sm:py-20 lg:py-24",
        lg: "py-20 sm:py-24 lg:py-32",
        xl: "py-24 sm:py-32 lg:py-40",
    };

    // 背景图案映射
    const patternClasses = {
        none: "",
        dots: "bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]",
        grid: "bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]",
        gradient:
            "bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden",
    };

    const sectionClasses = cn(
        "relative",
        variantClasses[variant],
        !fullWidth && sizeClasses[size],
        patternClasses[pattern],
        bordered && "border-t border-b border-border",
        className
    );

    // 如果是全宽模式，不使用 Container 包装
    if (fullWidth) {
        return (
            <section className={sectionClasses} {...props}>
                {children}
            </section>
        );
    }

    // 默认使用 Container 包装
    return (
        <section className={sectionClasses} {...props}>
            <Container size={size === "xl" ? "xl" : "lg"} {...container}>
                {children}
            </Container>
        </section>
    );
}

/**
 * Hero 区域组件
 * 专门用于首页顶部的主要展示区域
 */
export interface HeroSectionProps extends Omit<SectionProps, "size" | "variant"> {
    /** Hero 高度 */
    height?: "sm" | "md" | "lg" | "xl" | "screen";
    /** 背景覆盖层 */
    overlay?: boolean;
    /** 背景图片 */
    backgroundImage?: string;
    /** 背景视频 */
    backgroundVideo?: string;
}

export function HeroSection({
    height = "lg",
    overlay = false,
    backgroundImage,
    backgroundVideo,
    pattern = "gradient",
    className,
    children,
    ...props
}: HeroSectionProps) {
    // 高度映射
    const heightClasses = {
        sm: "min-h-[50vh] py-20",
        md: "min-h-[60vh] py-24",
        lg: "min-h-[70vh] py-32",
        xl: "min-h-[80vh] py-40",
        screen: "min-h-screen py-32",
    };

    const heroClasses = cn(
        "relative flex items-center justify-center",
        heightClasses[height],
        className
    );

    return (
        <Section
            variant="default"
            fullWidth
            pattern={pattern}
            className={heroClasses}
            {...props}
        >
            {/* 背景图片 */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* 背景视频 */}
            {backgroundVideo && (
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={backgroundVideo} type="video/mp4" />
                </video>
            )}

            {/* 覆盖层 */}
            {overlay && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
            )}

            {/* 内容 */}
            <Container size="lg" className="relative z-10">
                {children}
            </Container>
        </Section>
    );
}

/**
 * 内容区域组件
 * 用于组织页面的主要内容区域
 */
export interface ContentSectionProps extends SectionProps {
    /** 标题 */
    title?: string;
    /** 副标题 */
    subtitle?: string;
    /** 描述 */
    description?: string;
    /** 标题对齐方式 */
    titleAlign?: "left" | "center" | "right";
    /** 是否显示分隔线 */
    divider?: boolean;
}

export function ContentSection({
    title,
    subtitle,
    description,
    titleAlign = "center",
    divider = false,
    children,
    ...props
}: ContentSectionProps) {
    const titleAlignClasses = {
        left: "text-left",
        center: "text-center",
        right: "text-right",
    };

    return (
        <Section {...props}>
            {(title || subtitle || description) && (
                <div className={cn("mb-12 lg:mb-16", titleAlignClasses[titleAlign])}>
                    {subtitle && (
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                            {subtitle}
                        </p>
                    )}
                    {title && (
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            {description}
                        </p>
                    )}
                    {divider && (
                        <div className="mt-8 flex justify-center">
                            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent rounded-full" />
                        </div>
                    )}
                </div>
            )}
            {children}
        </Section>
    );
}