"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
    /** 加载器变体 */
    variant?: "default" | "dots" | "pulse" | "bounce" | "creative" | "skeleton";
    /** 尺寸 */
    size?: "sm" | "md" | "lg" | "xl";
    /** 颜色主题 */
    color?: "primary" | "secondary" | "accent" | "muted";
    /** 自定义类名 */
    className?: string;
    /** 加载文本 */
    text?: string;
    /** 是否显示文本 */
    showText?: boolean;
}

/**
 * 有趣的加载动画组件
 */
export function LoadingSpinner({
    variant = "default",
    size = "md",
    color = "primary",
    className,
    text = "加载中...",
    showText = true,
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const colorClasses = {
        primary: "text-primary",
        secondary: "text-secondary",
        accent: "text-accent-blue",
        muted: "text-muted-foreground",
    };

    const renderSpinner = () => {
        switch (variant) {
            case "dots":
                return <DotsSpinner size={size} color={color} />;
            case "pulse":
                return <PulseSpinner size={size} color={color} />;
            case "bounce":
                return <BounceSpinner size={size} color={color} />;
            case "creative":
                return <CreativeSpinner size={size} color={color} />;
            case "skeleton":
                return <SkeletonLoader />;
            default:
                return <DefaultSpinner size={size} color={color} />;
        }
    };

    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
            {renderSpinner()}
            {showText && variant !== "skeleton" && (
                <motion.p
                    className={cn("text-sm font-medium", colorClasses[color])}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
}

/**
 * 默认旋转加载器
 */
function DefaultSpinner({ size, color }: { size: string; color: string }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const colorClasses = {
        primary: "border-primary",
        secondary: "border-secondary",
        accent: "border-accent-blue",
        muted: "border-muted-foreground",
    };

    return (
        <motion.div
            className={cn(
                sizeClasses[size as keyof typeof sizeClasses],
                "border-2 border-transparent rounded-full",
                colorClasses[color as keyof typeof colorClasses]
            )}
            style={{
                borderTopColor: "currentColor",
                borderRightColor: "currentColor",
            }}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

/**
 * 点状加载器
 */
function DotsSpinner({ size, color }: { size: string; color: string }) {
    const dotSizes = {
        sm: "w-1 h-1",
        md: "w-2 h-2",
        lg: "w-3 h-3",
        xl: "w-4 h-4",
    };

    const colorClasses = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent-blue",
        muted: "bg-muted-foreground",
    };

    return (
        <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className={cn(
                        dotSizes[size as keyof typeof dotSizes],
                        "rounded-full",
                        colorClasses[color as keyof typeof colorClasses]
                    )}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

/**
 * 脉冲加载器
 */
function PulseSpinner({ size, color }: { size: string; color: string }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    const colorClasses = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent-blue",
        muted: "bg-muted-foreground",
    };

    return (
        <motion.div
            className={cn(
                sizeClasses[size as keyof typeof sizeClasses],
                "rounded-full",
                colorClasses[color as keyof typeof colorClasses]
            )}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

/**
 * 弹跳加载器
 */
function BounceSpinner({ size, color }: { size: string; color: string }) {
    const dotSizes = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4",
        xl: "w-5 h-5",
    };

    const colorClasses = {
        primary: "bg-primary",
        secondary: "bg-secondary",
        accent: "bg-accent-blue",
        muted: "bg-muted-foreground",
    };

    return (
        <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className={cn(
                        dotSizes[size as keyof typeof dotSizes],
                        "rounded-full",
                        colorClasses[color as keyof typeof colorClasses]
                    )}
                    animate={{
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: index * 0.1,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}

/**
 * 创意加载器
 */
function CreativeSpinner({ size, color }: { size: string; color: string }) {
    const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-14 h-14",
        xl: "w-18 h-18",
    };

    return (
        <div className={cn("relative", sizeClasses[size as keyof typeof sizeClasses])}>
            {/* 外圈 */}
            <motion.div
                className="absolute inset-0 border-2 border-accent-blue/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />

            {/* 中圈 */}
            <motion.div
                className="absolute inset-1 border-2 border-accent-purple/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* 内圈 */}
            <motion.div
                className="absolute inset-2 border-2 border-accent-pink rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* 中心点 */}
            <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent-orange rounded-full transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
}

/**
 * 骨架屏加载器
 */
function SkeletonLoader() {
    return (
        <div className="w-full max-w-md space-y-4">
            {/* 标题骨架 */}
            <div className="space-y-2">
                <motion.div
                    className="h-4 bg-gray-200 rounded-md"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                    className="h-4 bg-gray-200 rounded-md w-3/4"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
            </div>

            {/* 内容骨架 */}
            <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="h-3 bg-gray-200 rounded-md"
                        style={{ width: `${100 - index * 10}%` }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.1,
                        }}
                    />
                ))}
            </div>

            {/* 按钮骨架 */}
            <motion.div
                className="h-8 bg-gray-200 rounded-md w-24"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
        </div>
    );
}

export default LoadingSpinner;