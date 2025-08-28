"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/shared/utils";

export interface InteractiveElementsProps {
    /** 是否启用彩蛋 */
    enableEasterEggs?: boolean;
    /** 是否启用微交互 */
    enableMicroInteractions?: boolean;
    /** 是否显示活动状态 */
    showActivityStatus?: boolean;
    /** 自定义类名 */
    className?: string;
}

// 彩蛋数据
const easterEggs = [
    {
        id: "confetti",
        trigger: "🎉",
        effect: "confetti",
    },
    {
        id: "sparkles",
        trigger: "✨",
        effect: "sparkles",
    },
];

// 活动状态数据
const activityStatuses = [
    { status: "coding", emoji: "💻", text: "正在编码中", color: "text-accent-blue" },
    { status: "designing", emoji: "🎨", text: "设计灵感爆发", color: "text-accent-purple" },
    { status: "learning", emoji: "📚", text: "学习新技术", color: "text-accent-green" },
    { status: "coffee", emoji: "☕", text: "咖啡续命中", color: "text-accent-orange" },
    { status: "music", emoji: "🎵", text: "音乐陪伴", color: "text-accent-pink" },
    { status: "thinking", emoji: "🤔", text: "深度思考", color: "text-muted-foreground" },
];

/**
 * 互动元素和彩蛋组件
 */
export function InteractiveElements({
    enableEasterEggs = true,
    enableMicroInteractions = true,
    showActivityStatus = true,
    className,
}: InteractiveElementsProps) {
    const [clickCount, setClickCount] = useState(0);
    const [activeEasterEgg, setActiveEasterEgg] = useState<string | null>(null);
    const [currentActivity, setCurrentActivity] = useState(activityStatuses[0]);
    const containerRef = useRef<HTMLDivElement>(null);

    // 随机切换活动状态
    useEffect(() => {
        if (!showActivityStatus) return;

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * activityStatuses.length);
            setCurrentActivity(activityStatuses[randomIndex]);
        }, 30000); // 每30秒切换一次

        return () => clearInterval(interval);
    }, [showActivityStatus]);

    // 处理点击事件
    const handleClick = (event: React.MouseEvent) => {
        if (!enableEasterEggs) return;

        setClickCount((prev) => prev + 1);
        console.log(clickCount);

        // 连续点击触发彩蛋
        if (clickCount >= 4) {
            const randomEasterEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
            triggerEasterEgg(randomEasterEgg.id, event);
            setClickCount(0);
        }
    };

    // 触发彩蛋效果
    const triggerEasterEgg = (eggId: string, event?: React.MouseEvent) => {
        // 创建特效
        if (event && containerRef.current) {
            createEffect(eggId, event.clientX, event.clientY);
        }
    };

    // 创建特效
    const createEffect = (effectType: string, x: number, y: number) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        switch (effectType) {
            case "confetti":
                createConfetti(relativeX, relativeY);
                break;
            case "sparkles":
                createSparkles(relativeX, relativeY);
                break;
            default:
                break;
        }
    };

    // 创建五彩纸屑效果
    const createConfetti = (x: number, y: number) => {
        const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"];

        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement("div");
            confetti.style.position = "absolute";
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.width = "8px";
            confetti.style.height = "8px";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.pointerEvents = "none";
            confetti.style.zIndex = "1000";

            containerRef.current?.appendChild(confetti);

            // 动画
            const angle = (Math.PI * 2 * i) / 20;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let posX = x;
            let posY = y;
            let opacity = 1;

            const animate = () => {
                posX += vx * 0.02;
                posY += vy * 0.02 + 2; // 重力效果
                opacity -= 0.02;

                confetti.style.left = `${posX}px`;
                confetti.style.top = `${posY}px`;
                confetti.style.opacity = opacity.toString();

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };

            requestAnimationFrame(animate);
        }
    };

    // 创建闪光效果
    const createSparkles = (x: number, y: number) => {
        const sparkleCount = 5;
        const sparkleTypes = ["✨", "⭐", "🌟"];

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement("div");
            const sparkleType = sparkleTypes[Math.floor(Math.random() * sparkleTypes.length)];
            sparkle.innerHTML = sparkleType;

            // 随机分布在点击位置周围
            const angle = (Math.PI * 2 * i) / sparkleCount;
            const radius = 30 + Math.random() * 60;
            const startX = x + Math.cos(angle) * radius;
            const startY = y + Math.sin(angle) * radius;

            sparkle.style.position = "absolute";
            sparkle.style.left = `${startX - 20}px`; // 居中偏移
            sparkle.style.top = `${startY - 20}px`; // 居中偏移
            sparkle.style.fontSize = `${12 + Math.random() * 12}px`;
            sparkle.style.pointerEvents = "none";
            sparkle.style.zIndex = "1000";
            sparkle.style.filter = "drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))";
            sparkle.style.transform = "scale(0)";
            sparkle.style.transition = "none";

            containerRef.current?.appendChild(sparkle);

            // 简洁优雅的动画
            let scale = 0;
            let opacity = 1;
            const maxScale = 0.8 + Math.random() * 0.4;

            const animate = () => {
                // 缩放动画 - 先放大再缩小
                if (scale < maxScale) {
                    scale += 0.1;
                } else {
                    scale -= 0.03;
                    opacity -= 0.03;
                }

                sparkle.style.transform = `scale(${scale})`;
                sparkle.style.opacity = opacity.toString();

                if (opacity > 0 && scale > 0) {
                    requestAnimationFrame(animate);
                } else {
                    sparkle.remove();
                }
            };

            // 随机开始时间，创造自然效果
            setTimeout(() => requestAnimationFrame(animate), Math.random() * 300);
        }
    };



    return (
        <div
            ref={containerRef}
            className={cn("relative", className)}
            onClick={handleClick}
        >
            {/* 活动状态显示 */}
            {showActivityStatus && (
                <motion.div
                    className="absolute -bottom-14 left-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 user-select-none pointer-events-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={(e) => e.stopPropagation()} // 阻止活动状态区域的点击事件冒泡
                >
                    <motion.span
                        className="text-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {currentActivity.emoji}
                    </motion.span>
                    <span className={cn("text-sm font-medium", currentActivity.color)}>
                        {currentActivity.text}
                    </span>
                    <motion.div
                        className="w-2 h-2 bg-accent-green rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            )}

            {/* 微交互触发区域 */}
            {/* {enableMicroInteractions && (
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-8 h-8 rounded-full pointer-events-auto cursor-pointer"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                                zIndex: 2,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={handleClick}
                        />
                    ))}
                </div>
            )} */}
        </div>
    );
}

/**
 * 简单的点击彩蛋组件
 */
export function ClickEasterEgg({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const [showEasterEgg, setShowEasterEgg] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const handleClick = () => {
        setClickCount(prev => prev + 1);

        if (clickCount >= 2) {
            setShowEasterEgg(true);
            setClickCount(0);

            setTimeout(() => {
                setShowEasterEgg(false);
            }, 2000);
        }
    };

    return (
        <div className={cn("relative", className)} onClick={handleClick}>
            {children}

            <AnimatePresence>
                {showEasterEgg && (
                    <motion.div
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    >
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 默认导出
export default InteractiveElements;