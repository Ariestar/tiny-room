"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
        message: "恭喜你发现了彩蛋！",
        effect: "confetti",
    },
    {
        id: "rainbow",
        trigger: "🌈",
        message: "彩虹出现了！",
        effect: "rainbow",
    },
    {
        id: "sparkles",
        trigger: "✨",
        message: "闪闪发光！",
        effect: "sparkles",
    },
    {
        id: "rocket",
        trigger: "🚀",
        message: "准备起飞！",
        effect: "rocket",
    },
    {
        id: "magic",
        trigger: "🎭",
        message: "魔法时刻！",
        effect: "magic",
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
    const [showEasterEggHint, setShowEasterEggHint] = useState(false);
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

    // 显示彩蛋提示
    useEffect(() => {
        if (!enableEasterEggs) return;

        const timer = setTimeout(() => {
            setShowEasterEggHint(true);
        }, 5000); // 5秒后显示提示

        return () => clearTimeout(timer);
    }, [enableEasterEggs]);

    // 处理点击事件
    const handleClick = (event: React.MouseEvent) => {
        if (!enableEasterEggs) return;

        setClickCount((prev) => prev + 1);

        // 连续点击触发彩蛋
        if (clickCount >= 4) {
            const randomEasterEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
            triggerEasterEgg(randomEasterEgg.id, event);
            setClickCount(0);
        }
    };

    // 触发彩蛋效果
    const triggerEasterEgg = (eggId: string, event?: React.MouseEvent) => {
        setActiveEasterEgg(eggId);

        // 创建特效
        if (event && containerRef.current) {
            createEffect(eggId, event.clientX, event.clientY);
        }

        // 3秒后清除彩蛋状态
        setTimeout(() => {
            setActiveEasterEgg(null);
        }, 3000);
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
            case "rocket":
                createRocket(relativeX, relativeY);
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
        for (let i = 0; i < 10; i++) {
            const sparkle = document.createElement("div");
            sparkle.innerHTML = "✨";
            sparkle.style.position = "absolute";
            sparkle.style.left = `${x + (Math.random() - 0.5) * 100}px`;
            sparkle.style.top = `${y + (Math.random() - 0.5) * 100}px`;
            sparkle.style.fontSize = `${12 + Math.random() * 8}px`;
            sparkle.style.pointerEvents = "none";
            sparkle.style.zIndex = "1000";

            containerRef.current?.appendChild(sparkle);

            // 动画
            let scale = 0;
            let opacity = 1;

            const animate = () => {
                scale += 0.05;
                opacity -= 0.02;

                sparkle.style.transform = `scale(${scale})`;
                sparkle.style.opacity = opacity.toString();

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    sparkle.remove();
                }
            };

            setTimeout(() => requestAnimationFrame(animate), i * 100);
        }
    };

    // 创建火箭效果
    const createRocket = (x: number, y: number) => {
        const rocket = document.createElement("div");
        rocket.innerHTML = "🚀";
        rocket.style.position = "absolute";
        rocket.style.left = `${x}px`;
        rocket.style.top = `${y}px`;
        rocket.style.fontSize = "24px";
        rocket.style.pointerEvents = "none";
        rocket.style.zIndex = "1000";

        containerRef.current?.appendChild(rocket);

        // 火箭飞行动画
        let posY = y;
        let scale = 1;

        const animate = () => {
            posY -= 5;
            scale += 0.02;

            rocket.style.top = `${posY}px`;
            rocket.style.transform = `scale(${scale}) rotate(-45deg)`;

            if (posY > -50) {
                requestAnimationFrame(animate);
            } else {
                rocket.remove();
            }
        };

        requestAnimationFrame(animate);
    };

    return (
        <div
            ref={containerRef}
            className={cn("relative", className)}
            onClick={handleClick}
        >
            {/* 彩蛋提示 */}
            {enableEasterEggs && showEasterEggHint && !activeEasterEgg && (
                <motion.div
                    className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setShowEasterEggHint(false)}
                >
                    💡 试试连续点击5次
                </motion.div>
            )}

            {/* 活动状态显示 */}
            {showActivityStatus && (
                <motion.div
                    className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
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

            {/* 彩蛋消息显示 */}
            <AnimatePresence>
                {activeEasterEgg && (
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-xl font-bold shadow-lg"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 10 }}
                            transition={{ type: "spring", damping: 15 }}
                        >
                            {easterEggs.find(egg => egg.id === activeEasterEgg)?.message}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 微交互触发区域 */}
            {enableMicroInteractions && (
                <div className="absolute inset-0 pointer-events-none">
                    {/* 隐藏的交互热点 */}
                    {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-8 h-8 rounded-full pointer-events-auto cursor-pointer"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + (i % 2) * 40}%`,
                            }}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                const randomEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
                                triggerEasterEgg(randomEgg.id, e as any);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

/**
 * 简单的点击彩蛋组件
 */
export function ClickEasterEgg({
    children,
    easterEggText = "🎉 惊喜！",
    className,
}: {
    children: React.ReactNode;
    easterEggText?: string;
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
                        {easterEggText}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 默认导出
export default InteractiveElements;