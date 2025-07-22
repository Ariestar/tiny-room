"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedGradientProps {
    /** 渐变变体 */
    variant?: "aurora" | "wave" | "mesh" | "rainbow" | "cosmic";
    /** 动画速度 */
    speed?: "slow" | "normal" | "fast";
    /** 渐变强度 */
    intensity?: "subtle" | "medium" | "vibrant";
    /** 是否启用 */
    enabled?: boolean;
    /** 自定义类名 */
    className?: string;
    children?: React.ReactNode;
}

/**
 * 动画渐变背景组件
 * 提供多种动态渐变效果
 */
export function AnimatedGradient({
    variant = "aurora",
    speed = "normal",
    intensity = "medium",
    enabled = true,
    className,
    children,
}: AnimatedGradientProps) {
    if (!enabled) {
        return <div className={className}>{children}</div>;
    }

    const speedMap = {
        slow: 30,
        normal: 20,
        fast: 10,
    };

    const duration = speedMap[speed];

    const renderGradient = () => {
        switch (variant) {
            case "aurora":
                return <AuroraGradient duration={duration} intensity={intensity} />;
            case "wave":
                return <WaveGradient duration={duration} intensity={intensity} />;
            case "mesh":
                return <MeshGradient duration={duration} intensity={intensity} />;
            case "rainbow":
                return <RainbowGradient duration={duration} intensity={intensity} />;
            case "cosmic":
                return <CosmicGradient duration={duration} intensity={intensity} />;
            default:
                return <AuroraGradient duration={duration} intensity={intensity} />;
        }
    };

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {renderGradient()}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/**
 * 极光渐变效果
 */
function AuroraGradient({ duration, intensity }: { duration: number; intensity: string }) {
    const opacityMap = {
        subtle: 0.3,
        medium: 0.5,
        vibrant: 0.7,
    };

    const opacity = opacityMap[intensity as keyof typeof opacityMap];

    return (
        <motion.div
            className="absolute inset-0"
            style={{
                background: `
					radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%),
					radial-gradient(ellipse 80% 50% at 80% 50%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%),
					radial-gradient(ellipse 80% 50% at 40% 80%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%)
				`,
            }}
            animate={{
                background: [
                    `radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 80% 50%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 40% 80%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%)`,
                    `radial-gradient(ellipse 80% 50% at 60% 20%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 40% 70%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 80% 40%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%)`,
                    `radial-gradient(ellipse 80% 50% at 80% 60%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 20% 30%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 60% 90%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%)`,
                    `radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 80% 50%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%),
					 radial-gradient(ellipse 80% 50% at 40% 80%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%)`,
                ],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    );
}

/**
 * 波浪渐变效果
 */
function WaveGradient({ duration, intensity }: { duration: number; intensity: string }) {
    const opacityMap = {
        subtle: 0.2,
        medium: 0.4,
        vibrant: 0.6,
    };

    const opacity = opacityMap[intensity as keyof typeof opacityMap];

    return (
        <motion.div
            className="absolute inset-0"
            style={{
                background: `linear-gradient(45deg, 
					hsl(var(--accent-blue)/${opacity}) 0%, 
					hsl(var(--accent-purple)/${opacity}) 50%, 
					hsl(var(--accent-pink)/${opacity}) 100%)`,
            }}
            animate={{
                background: [
                    `linear-gradient(45deg, hsl(var(--accent-blue)/${opacity}) 0%, hsl(var(--accent-purple)/${opacity}) 50%, hsl(var(--accent-pink)/${opacity}) 100%)`,
                    `linear-gradient(135deg, hsl(var(--accent-purple)/${opacity}) 0%, hsl(var(--accent-pink)/${opacity}) 50%, hsl(var(--accent-blue)/${opacity}) 100%)`,
                    `linear-gradient(225deg, hsl(var(--accent-pink)/${opacity}) 0%, hsl(var(--accent-blue)/${opacity}) 50%, hsl(var(--accent-purple)/${opacity}) 100%)`,
                    `linear-gradient(315deg, hsl(var(--accent-blue)/${opacity}) 0%, hsl(var(--accent-purple)/${opacity}) 50%, hsl(var(--accent-pink)/${opacity}) 100%)`,
                ],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

/**
 * 网格渐变效果
 */
function MeshGradient({ duration, intensity }: { duration: number; intensity: string }) {
    const opacityMap = {
        subtle: 0.15,
        medium: 0.25,
        vibrant: 0.4,
    };

    const opacity = opacityMap[intensity as keyof typeof opacityMap];

    return (
        <div className="absolute inset-0">
            {/* 多层渐变网格 */}
            {[0, 1, 2].map((layer) => (
                <motion.div
                    key={layer}
                    className="absolute inset-0"
                    style={{
                        background: `
							radial-gradient(circle at ${20 + layer * 30}% ${30 + layer * 20}%, hsl(var(--accent-blue)/${opacity}) 0%, transparent 50%),
							radial-gradient(circle at ${70 - layer * 20}% ${60 + layer * 15}%, hsl(var(--accent-purple)/${opacity}) 0%, transparent 50%),
							radial-gradient(circle at ${50 + layer * 10}% ${20 + layer * 30}%, hsl(var(--accent-pink)/${opacity}) 0%, transparent 50%)
						`,
                    }}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: duration + layer * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: layer * 2,
                    }}
                />
            ))}
        </div>
    );
}

/**
 * 彩虹渐变效果
 */
function RainbowGradient({ duration, intensity }: { duration: number; intensity: string }) {
    const opacityMap = {
        subtle: 0.2,
        medium: 0.3,
        vibrant: 0.5,
    };

    const opacity = opacityMap[intensity as keyof typeof opacityMap];

    return (
        <motion.div
            className="absolute inset-0"
            style={{
                background: `conic-gradient(from 0deg, 
					hsl(0, 70%, 60%/${opacity}), 
					hsl(60, 70%, 60%/${opacity}), 
					hsl(120, 70%, 60%/${opacity}), 
					hsl(180, 70%, 60%/${opacity}), 
					hsl(240, 70%, 60%/${opacity}), 
					hsl(300, 70%, 60%/${opacity}), 
					hsl(360, 70%, 60%/${opacity}))`,
            }}
            animate={{
                rotate: [0, 360],
            }}
            transition={{
                duration: duration * 2,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
}

/**
 * 宇宙渐变效果
 */
function CosmicGradient({ duration, intensity }: { duration: number; intensity: string }) {
    const opacityMap = {
        subtle: 0.2,
        medium: 0.35,
        vibrant: 0.5,
    };

    const opacity = opacityMap[intensity as keyof typeof opacityMap];

    return (
        <div className="absolute inset-0">
            {/* 星云效果 */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: `
						radial-gradient(ellipse 200% 100% at 50% 0%, hsl(240, 100%, 20%/${opacity}) 0%, transparent 50%),
						radial-gradient(ellipse 150% 80% at 80% 50%, hsl(280, 100%, 30%/${opacity}) 0%, transparent 50%),
						radial-gradient(ellipse 120% 60% at 20% 80%, hsl(320, 100%, 25%/${opacity}) 0%, transparent 50%)
					`,
                }}
                animate={{
                    background: [
                        `radial-gradient(ellipse 200% 100% at 50% 0%, hsl(240, 100%, 20%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 150% 80% at 80% 50%, hsl(280, 100%, 30%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 120% 60% at 20% 80%, hsl(320, 100%, 25%/${opacity}) 0%, transparent 50%)`,
                        `radial-gradient(ellipse 180% 120% at 30% 20%, hsl(260, 100%, 25%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 140% 90% at 70% 70%, hsl(300, 100%, 20%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 160% 70% at 90% 30%, hsl(340, 100%, 30%/${opacity}) 0%, transparent 50%)`,
                        `radial-gradient(ellipse 220% 80% at 70% 10%, hsl(220, 100%, 30%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 130% 100% at 20% 60%, hsl(260, 100%, 25%/${opacity}) 0%, transparent 50%),
						 radial-gradient(ellipse 100% 80% at 60% 90%, hsl(300, 100%, 20%/${opacity}) 0%, transparent 50%)`,
                    ],
                }}
                transition={{
                    duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* 星点效果 */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
// 默认导出
export default AnimatedGradient;