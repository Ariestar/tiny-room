"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/shared/utils";
import {
    prefersReducedMotion,
    createResponsiveAnimationConfig,
    createThrottledAnimationTrigger
} from "@/lib/ui/animations";

export interface DynamicBackgroundProps {
    /** 背景变体 */
    variant?: "gradient" | "grid" | "particles" | "geometric";
    /** 动画强度 */
    intensity?: "low" | "medium" | "high";
    /** 是否启用鼠标跟随效果 */
    mouseFollow?: boolean;
    /** 是否启用粒子系统 */
    particles?: boolean;
    /** 自定义类名 */
    className?: string;
    children?: React.ReactNode;
}

/**
 * 动态背景组件
 * 提供多种动画背景效果
 */
export function DynamicBackground({
    variant = "gradient",
    intensity = "medium",
    mouseFollow = true,
    particles = true,
    className,
    children,
}: DynamicBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const isReducedMotion = prefersReducedMotion();

    // 优化的鼠标跟随效果 - 使用节流
    const throttledMouseMove = useCallback(
        createThrottledAnimationTrigger((e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                });
            }
        }, 16), // ~60fps
        []
    );

    useEffect(() => {
        if (!mouseFollow || isReducedMotion) return;

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", throttledMouseMove);
            return () => container.removeEventListener("mousemove", throttledMouseMove);
        }
    }, [mouseFollow, throttledMouseMove, isReducedMotion]);

    // 如果用户偏好减少动画，返回简化版本
    if (isReducedMotion) {
        return (
            <div className={cn("relative overflow-hidden", className)}>
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/10" />
                <div className="relative">{children}</div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden", className)}
        >
            {/* 渐变网格背景 */}
            {variant === "gradient" && (
                <GradientGridBackground intensity={intensity} mousePosition={mousePosition} />
            )}

            {/* 网格背景 */}
            {variant === "grid" && (
                <GridBackground intensity={intensity} />
            )}

            {/* 几何图形背景 */}
            {variant === "geometric" && (
                <GeometricBackground intensity={intensity} />
            )}

            {/* 粒子系统 */}
            {particles && variant === "particles" && (
                <ParticleSystem intensity={intensity} mousePosition={mousePosition} />
            )}

            {/* 漂浮几何图形 */}
            <FloatingShapes intensity={intensity} />

            {/* 内容 */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
}

/**
 * 渐变网格背景组件 - 性能优化版本
 */
function GradientGridBackground({
    intensity,
    mousePosition
}: {
    intensity: string;
    mousePosition: { x: number; y: number };
}) {
    const animationConfig = createResponsiveAnimationConfig({
        duration: intensity === "high" ? 20 : intensity === "medium" ? 30 : 40
    });


    return (
        <div className="absolute inset-0">
            {/* 基础渐变 - 优化版本 */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"
                style={{ willChange: "transform" }}
                animate={{
                    background: [
                        "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, hsl(var(--muted))/0.2 100%)",
                        "linear-gradient(225deg, hsl(var(--background)) 0%, hsl(var(--muted))/0.1 50%, hsl(var(--background)) 100%)",
                        "linear-gradient(315deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, hsl(var(--muted))/0.2 100%)",
                        "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, hsl(var(--muted))/0.2 100%)",
                    ],
                }}
                transition={{
                    ...animationConfig,
                    repeat: Infinity,
                    ease: "linear",
                }}
                onAnimationComplete={() => {
                    // 动画完成后清理 will-change
                    const element = document.querySelector('[data-animation="gradient"]') as HTMLElement;
                    if (element) element.style.willChange = 'auto';
                }}
                data-animation="gradient"
            />

            {/* 动态网格 - 以hero为中心，超出内容区域 */}
            <motion.div
                className="absolute opacity-40"
                style={{
                    // 网格尺寸超出hero区域，居中定位
                    left: '-25vw',
                    top: '-25vh',
                    width: '150vw',
                    height: '150vh',
                    backgroundImage: `
						linear-gradient(hsl(var(--border)) 1px, transparent 2px),
						linear-gradient(90deg, hsl(var(--border)) 1px, transparent 2px)
					`,
                    backgroundSize: "50px 50px",
                    willChange: "transform"
                }}
                animate={{
                    // 四方向复杂随机移动模式
                    x: [0, 35, -20, -35, 40, -15, 25, 0],
                    y: [0, 20, 35, -25, -10, 30, -35, 0],
                }}
                transition={{
                    ...animationConfig,
                    repeat: Infinity,
                    ease: "easeInOut",
                    // times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1], // 8个关键帧的时间分配
                }}
                onAnimationComplete={() => {
                    const element = document.querySelector('[data-animation="grid"]') as HTMLElement;
                    if (element) element.style.willChange = 'auto';
                }}
                data-animation="grid"
            />

            {/* 鼠标跟随光晕 - 优化版本 */}
            <motion.div
                className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, hsl(var(--primary))/0.3 0%, transparent 70%)",
                    willChange: "transform",
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`,
                    transform: "translate(-50%, -50%)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    scale: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }
                }}
            />
        </div>
    );
}

/**
 * 网格背景组件 - 性能优化版本
 */
function GridBackground({ intensity }: { intensity: string }) {
    const animationConfig = createResponsiveAnimationConfig({
        duration: intensity === "high" ? 15 : intensity === "medium" ? 25 : 35
    });

    return (
        <motion.div
            className="absolute inset-0 opacity-20"
            style={{
                backgroundImage: `
					linear-gradient(hsl(var(--border)) 1px, transparent 1px),
					linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
				`,
                backgroundSize: "40px 40px",
                willChange: "transform"
            }}
            animate={{
                x: [0, 40],
                y: [0, 40],
            }}
            transition={{
                ...animationConfig,
                repeat: Infinity,
                ease: "linear",
            }}
            onAnimationComplete={() => {
                const element = document.querySelector('[data-animation="grid-bg"]') as HTMLElement;
                if (element) element.style.willChange = 'auto';
            }}
            data-animation="grid-bg"
        />
    );
}

/**
 * 几何图形背景组件 - 性能优化版本，增强随机移动
 */
function GeometricBackground({ intensity }: { intensity: string }) {
    const shapeCount = intensity === "high" ? 8 : intensity === "medium" ? 6 : 4;
    const shapes = Array.from({ length: shapeCount }, (_, i) => i);

    return (
        <div className="absolute inset-0">
            {shapes.map((i) => {
                // 使用固定种子确保服务端和客户端一致，但增加更多随机变化
                const leftPos = seededRandom(i * 500) * 100;
                const topPos = seededRandom(i * 600) * 100;

                // 创建随机路径点 - 8个关键帧形成不规则路径
                const pathPoints = Array.from({ length: 8 }, (_, idx) => ({
                    x: (seededRandom(i * 700 + idx * 100) - 0.5) * 60, // -30到30的随机移动
                    y: (seededRandom(i * 800 + idx * 100) - 0.5) * 60,
                }));

                // 随机旋转方向和角度
                const rotationDir = seededRandom(i * 900) > 0.5 ? 1 : -1;
                const maxRotation = 180 + seededRandom(i * 950) * 180; // 180-360度随机

                const animationConfig = createResponsiveAnimationConfig({
                    duration: 20 + seededRandom(i * 1000) * 15, // 20-35秒随机时长
                    delay: i * 1.5
                });

                return (
                    <motion.div
                        key={i}
                        className="absolute w-24 h-24 opacity-10 pointer-events-none"
                        style={{
                            left: `${leftPos}%`,
                            top: `${topPos}%`,
                            background: `linear-gradient(45deg, hsl(var(--primary))/0.3, hsl(var(--accent))/0.3)`,
                            borderRadius: i % 2 === 0 ? "50%" : "20%",
                            willChange: "transform"
                        }}
                        animate={{
                            // 随机路径移动
                            x: [0, ...pathPoints.map(p => p.x), 0],
                            y: [0, ...pathPoints.map(p => p.y), 0],
                            // 随机旋转
                            rotate: [0, maxRotation * rotationDir * 0.3, maxRotation * rotationDir * 0.7, maxRotation * rotationDir],
                            // 随机缩放变化
                            scale: [
                                1,
                                1 + seededRandom(i * 1100) * 0.3,
                                1 - seededRandom(i * 1200) * 0.2,
                                1 + seededRandom(i * 1300) * 0.2,
                                1
                            ],
                        }}
                        transition={{
                            ...animationConfig,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.2, 0.4, 0.6, 0.8, 1], // 控制动画时序
                        }}
                        onAnimationComplete={() => {
                            const element = document.querySelector(`[data-animation="shape-${i}"]`) as HTMLElement;
                            if (element) element.style.willChange = 'auto';
                        }}
                        data-animation={`shape-${i}`}
                    />
                );
            })}
        </div>
    );
}

/**
 * 粒子系统组件
 */
function ParticleSystem({
    intensity,
    mousePosition
}: {
    intensity: string;
    mousePosition: { x: number; y: number };
}) {
    const particleCount = intensity === "high" ? 50 : intensity === "medium" ? 30 : 20;
    const particles = Array.from({ length: particleCount }, (_, i) => i);

    return (
        <div className="absolute inset-0">
            {particles.map((i) => {
                // 使用固定种子确保服务端和客户端一致
                const leftPos = seededRandom(i * 1000) * 100;
                const topPos = seededRandom(i * 1100) * 100;
                const duration = 3 + seededRandom(i * 1200) * 2;

                return (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary/30 rounded-full"
                        style={{
                            left: `${leftPos}%`,
                            top: `${topPos}%`,
                        }}
                        animate={{
                            x: [0, (mousePosition.x - 50) * 0.1],
                            y: [0, (mousePosition.y - 50) * 0.1],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1,
                        }}
                    />
                );
            })}
        </div>
    );
}

/**
 * 简单的伪随机数生成器（使用固定种子）
 * 确保服务端和客户端生成相同的随机值
 */
function seededRandom(seed: number) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * 漂浮几何图形组件
 */
function FloatingShapes({ intensity }: { intensity: string }) {
    const shapeCount = intensity === "high" ? 12 : intensity === "medium" ? 8 : 6;
    const shapes = Array.from({ length: shapeCount }, (_, i) => i);

    const shapeVariants = [
        "rounded-full",
        "rounded-lg",
        "rounded-none rotate-45",
        "rounded-full",
        "rounded-2xl",
    ];

    return (
        <div className="absolute inset-0 pointer-events-none">
            {shapes.map((i) => {
                // 使用索引作为种子，确保每次渲染都生成相同的值
                const size = 20 + seededRandom(i * 100) * 40;
                const leftPos = seededRandom(i * 200) * 100;
                const topPos = seededRandom(i * 300) * 100;
                const duration = 8 + seededRandom(i * 400) * 4;
                const shapeClass = shapeVariants[i % shapeVariants.length];

                return (
                    <motion.div
                        key={i}
                        className={cn(
                            "absolute opacity-20",
                            shapeClass
                        )}
                        style={{
                            width: size,
                            height: size,
                            left: `${leftPos}%`,
                            top: `${topPos}%`,
                            background: `linear-gradient(45deg, hsl(var(--accent-blue))/0.3, hsl(var(--accent-purple))/0.3)`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.sin(i) * 20, 0],
                            rotate: [0, 180, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5,
                        }}
                    />
                );
            })}
        </div>
    );
}