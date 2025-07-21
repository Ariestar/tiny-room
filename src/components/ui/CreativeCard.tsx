"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CreativeCardProps {
    /** 卡片变体 */
    variant?: "default" | "tilted" | "floating" | "morphing" | "glass" | "neon";
    /** 卡片尺寸 */
    size?: "sm" | "md" | "lg" | "xl";
    /** 是否启用3D效果 */
    enable3D?: boolean;
    /** 是否启用悬停动画 */
    enableHover?: boolean;
    /** 倾斜角度 */
    tiltAngle?: number;
    /** 背景渐变 */
    gradient?: string;
    /** 自定义类名 */
    className?: string;
    /** 点击事件 */
    onClick?: () => void;
    children: React.ReactNode;
}

/**
 * 创意卡片组件
 * 提供多种视觉效果和交互动画
 */
export function CreativeCard({
    variant = "default",
    size = "md",
    enable3D = true,
    enableHover = true,
    tiltAngle = 0,
    gradient,
    className,
    onClick,
    children,
}: CreativeCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // 3D倾斜效果
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

    // 弹簧动画配置
    const springConfig = { stiffness: 300, damping: 30 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // 尺寸配置
    const sizeClasses = {
        sm: "p-4 min-h-[200px]",
        md: "p-6 min-h-[250px]",
        lg: "p-8 min-h-[300px]",
        xl: "p-10 min-h-[350px]",
    };

    // 处理鼠标移动
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enable3D) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;

        x.set(deltaX);
        y.set(deltaY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // 根据变体返回不同的卡片样式
    const getCardVariant = () => {
        switch (variant) {
            case "tilted":
                return <TiltedCard {...props} />;
            case "floating":
                return <FloatingCard {...props} />;
            case "morphing":
                return <MorphingCard {...props} />;
            case "glass":
                return <GlassCard {...props} />;
            case "neon":
                return <NeonCard {...props} />;
            default:
                return <DefaultCard {...props} />;
        }
    };

    const props = {
        size,
        enable3D,
        enableHover,
        tiltAngle,
        gradient,
        className,
        onClick,
        children,
        isHovered,
        handleMouseMove,
        handleMouseEnter,
        handleMouseLeave,
        rotateX,
        rotateY,
        sizeClasses,
    };

    return getCardVariant();
}

/**
 * 默认卡片样式
 */
function DefaultCard({
    size,
    enable3D,
    enableHover,
    gradient,
    className,
    onClick,
    children,
    isHovered,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    rotateX,
    rotateY,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl bg-card border border-border cursor-pointer overflow-hidden",
                sizeClasses[size],
                className
            )}
            style={{
                rotateX: enable3D ? rotateX : 0,
                rotateY: enable3D ? rotateY : 0,
                transformStyle: "preserve-3d",
                background: gradient || undefined,
            }}
            whileHover={enableHover ? {
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            } : undefined}
            whileTap={{ scale: 0.98 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* 光晕效果 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-accent-purple/20 to-accent-pink/20 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            />

            {/* 内容 */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 倾斜卡片样式
 */
function TiltedCard({
    size,
    tiltAngle,
    gradient,
    className,
    onClick,
    children,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl bg-card border border-border cursor-pointer overflow-hidden shadow-soft",
                sizeClasses[size],
                className
            )}
            style={{
                background: gradient || undefined,
                transform: `rotate(${tiltAngle}deg)`,
            }}
            whileHover={{
                scale: 1.1,
                rotate: tiltAngle + 5,
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            {/* 装饰性边框 */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink p-[2px]">
                <div className="rounded-2xl bg-card h-full w-full" />
            </div>

            {/* 内容 */}
            <div className="relative z-10 p-6">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 漂浮卡片样式
 */
function FloatingCard({
    size,
    gradient,
    className,
    onClick,
    children,
    handleMouseEnter,
    handleMouseLeave,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative rounded-3xl bg-card border border-border cursor-pointer overflow-hidden",
                sizeClasses[size],
                className
            )}
            style={{
                background: gradient || undefined,
            }}
            animate={{
                y: [0, -10, 0],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{
                scale: 1.08,
                y: -15,
                boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* 浮动阴影 */}
            <motion.div
                className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-md"
                animate={{
                    scaleX: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* 内容 */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 变形卡片样式
 */
function MorphingCard({
    size,
    gradient,
    className,
    onClick,
    children,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative bg-card border border-border cursor-pointer overflow-hidden",
                sizeClasses[size],
                className
            )}
            style={{
                background: gradient || undefined,
            }}
            animate={{
                borderRadius: ["1rem", "2rem", "1.5rem", "1rem"],
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            whileHover={{
                scale: 1.05,
                borderRadius: "2.5rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {/* 变形背景 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 via-accent-purple/10 to-accent-pink/10"
                animate={{
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* 内容 */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 玻璃卡片样式
 */
function GlassCard({
    size,
    className,
    onClick,
    children,
    handleMouseEnter,
    handleMouseLeave,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative cursor-pointer overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20",
                sizeClasses[size],
                className
            )}
            style={{
                borderRadius: "1.5rem",
            }}
            whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.15)",
                boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* 玻璃反光效果 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent" />

            {/* 内容 */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 霓虹卡片样式
 */
function NeonCard({
    size,
    className,
    onClick,
    children,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    sizeClasses,
}: any) {
    return (
        <motion.div
            className={cn(
                "relative rounded-2xl bg-gray-900 border-2 cursor-pointer overflow-hidden",
                sizeClasses[size],
                className
            )}
            style={{
                borderColor: isHovered ? "#00ffff" : "#333",
                boxShadow: isHovered ? "0 0 30px #00ffff40" : "none",
            }}
            whileHover={{
                scale: 1.05,
            }}
            whileTap={{ scale: 0.98 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* 霓虹光效 */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            {/* 扫描线效果 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent h-full"
                animate={{
                    y: ["-100%", "100%"],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />

            {/* 内容 */}
            <div className="relative z-10 text-white">
                {children}
            </div>
        </motion.div>
    );
}

/**
 * 卡片内容组件
 */
export function CardContent({
    icon,
    title,
    description,
    badge,
    action,
    className,
}: {
    icon?: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    action?: string;
    className?: string;
}) {
    return (
        <div className={cn("space-y-4", className)}>
            {/* 图标和徽章 */}
            <div className="flex items-start justify-between">
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white text-xl">
                        {icon}
                    </div>
                )}
                {badge && (
                    <span className="px-2 py-1 bg-accent-green/10 text-accent-green text-xs rounded-full font-medium">
                        {badge}
                    </span>
                )}
            </div>

            {/* 标题和描述 */}
            <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </div>

            {/* 操作按钮 */}
            {action && (
                <div className="pt-2">
                    <span className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        {action} →
                    </span>
                </div>
            )}
        </div>
    );
}