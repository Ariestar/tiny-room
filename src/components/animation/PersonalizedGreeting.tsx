"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/shared/utils";

export interface PersonalizedGreetingProps {
    /** 是否启用打字机效果 */
    typewriter?: boolean;
    /** 打字机速度 */
    typewriterSpeed?: number;
    /** 是否显示彩虹渐变 */
    rainbowGradient?: boolean;
    /** 是否显示 emoji 装饰 */
    showEmoji?: boolean;
    /** 自定义类名 */
    className?: string;
    /** 自定义问候语 */
    customGreetings?: string[];
}

// 问候语数据库
const greetingDatabase = {
    morning: [
        "早上好！新的一天开始了 ☀️",
        "晨光正好，愿你今天充满活力 🌅",
        "早安！希望你今天有个美好的开始 🌸",
        "清晨的阳光为你而来 ✨",
        "新的一天，新的可能性 🚀",
    ],
    afternoon: [
        "下午好！希望你今天过得愉快 🌞",
        "午后时光，正是创造的好时候 💡",
        "下午好！记得给自己一个小憩 ☕",
        "阳光正好，微风不燥 🍃",
        "下午的时光总是格外温暖 🌻",
    ],
    evening: [
        "晚上好！今天辛苦了 🌙",
        "夜幕降临，是时候放松一下了 🌃",
        "晚安时光，愿你有个好梦 ⭐",
        "夜色温柔，就像此刻的你 🌌",
        "晚上好！感谢你今天的努力 💫",
    ],
    night: [
        "深夜了，记得早点休息哦 🌙",
        "夜深人静，正是思考的好时候 🤔",
        "夜猫子你好！注意保护眼睛 👀",
        "深夜的代码最有灵魂 💻",
        "夜深了，但创意永不眠 🎨",
    ],
    random: [
        "欢迎来到我的小天地 🏠",
        "很高兴遇见你 👋",
        "今天想聊点什么呢？ 💬",
        "希望你在这里找到有趣的内容 📚",
        "让我们一起探索有趣的世界 🌍",
        "感谢你的到访 🙏",
        "愿你今天心情愉快 😊",
        "生活总是充满惊喜 🎉",
    ],
};

// emoji 装饰数据
const emojiDecorations = [
    "✨", "🌟", "💫", "⭐", "🌈", "🎨", "🚀", "💡",
    "🌸", "🌺", "🌻", "🍃", "🦋", "🐝", "🌙", "☀️"
];

// 特殊日期问候
const specialGreetings = {
    newYear: "新年快乐！愿新的一年充满可能 🎊",
    christmas: "圣诞快乐！愿你的节日充满温暖 🎄",
    valentine: "情人节快乐！爱意满满的一天 💕",
    halloween: "万圣节快乐！今晚有什么有趣的计划吗？ 🎃",
};

/**
 * 个性化问候组件
 */
export function PersonalizedGreeting({
    typewriter = true,
    typewriterSpeed = 50,
    rainbowGradient = true,
    showEmoji = true,
    className,
    customGreetings,
}: PersonalizedGreetingProps) {
    const [currentGreeting, setCurrentGreeting] = useState("");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [decorativeEmojis, setDecorativeEmojis] = useState<string[]>([]);
    const [hasCompletedFirstAnimation, setHasCompletedFirstAnimation] = useState(false);

    // 获取当前时间段
    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "morning";
        if (hour >= 12 && hour < 17) return "afternoon";
        if (hour >= 17 && hour < 22) return "evening";
        return "night";
    };

    // 检查特殊日期
    const getSpecialGreeting = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        if (month === 1 && day === 1) return specialGreetings.newYear;
        if (month === 12 && day === 25) return specialGreetings.christmas;
        if (month === 2 && day === 14) return specialGreetings.valentine;
        if (month === 10 && day === 31) return specialGreetings.halloween;

        return null;
    };

    // 获取问候语
    const getGreeting = () => {
        // 优先检查特殊日期
        const specialGreeting = getSpecialGreeting();
        if (specialGreeting) return specialGreeting;

        // 使用自定义问候语
        if (customGreetings && customGreetings.length > 0) {
            return customGreetings[Math.floor(Math.random() * customGreetings.length)];
        }

        // 根据时间段选择问候语
        const timeOfDay = getTimeOfDay();
        const greetings = greetingDatabase[timeOfDay];

        // 偶尔使用随机问候语增加趣味性
        if (Math.random() < 0.3) {
            const randomGreetings = greetingDatabase.random;
            return randomGreetings[Math.floor(Math.random() * randomGreetings.length)];
        }

        return greetings[Math.floor(Math.random() * greetings.length)];
    };

    // 生成装饰性 emoji
    const generateDecorativeEmojis = () => {
        const count = 3 + Math.floor(Math.random() * 3); // 3-5个emoji
        const selected = [];
        for (let i = 0; i < count; i++) {
            const randomEmoji = emojiDecorations[Math.floor(Math.random() * emojiDecorations.length)];
            selected.push(randomEmoji);
        }
        return selected;
    };

    // 初始化问候语
    useEffect(() => {
        const greeting = getGreeting();
        setCurrentGreeting(greeting);

        if (showEmoji) {
            setDecorativeEmojis(generateDecorativeEmojis());
        }
    }, [customGreetings, showEmoji]);

    // 打字机效果
    useEffect(() => {
        if (!typewriter || !currentGreeting) {
            setDisplayedText(currentGreeting);
            // 如果没有打字机效果，立即标记为完成
            if (!hasCompletedFirstAnimation) {
                setHasCompletedFirstAnimation(true);
            }
            return;
        }

        setIsTyping(true);
        setDisplayedText("");

        let index = 0;
        const timer = setInterval(() => {
            if (index < currentGreeting.length) {
                setDisplayedText(currentGreeting.slice(0, index + 1));
                index++;
            } else {
                setIsTyping(false);
                // 标记第一次动画完成
                if (!hasCompletedFirstAnimation) {
                    setHasCompletedFirstAnimation(true);
                }
                clearInterval(timer);
            }
        }, typewriterSpeed);

        return () => clearInterval(timer);
    }, [currentGreeting, typewriter, typewriterSpeed, hasCompletedFirstAnimation]);

    // 刷新问候语
    const refreshGreeting = () => {
        const newGreeting = getGreeting();
        setCurrentGreeting(newGreeting);

        if (showEmoji) {
            setDecorativeEmojis(generateDecorativeEmojis());
        }
    };

    const textToDisplay = typewriter ? displayedText : currentGreeting;

    return (
        <div className={cn("relative", className)}>
            {/* 装饰性 emoji */}
            {showEmoji && (
                <div className="absolute -inset-4 pointer-events-none">
                    <AnimatePresence>
                        {decorativeEmojis.map((emoji, index) => (
                            <motion.div
                                key={`${emoji}-${index}`}
                                className="absolute text-2xl"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                }}
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{
                                    opacity: 0.6,
                                    scale: 1,
                                    rotate: 0,
                                    y: [0, -10, 0],
                                }}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                    y: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                {emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* 主要问候文本 */}
            <motion.div
                className="relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1
                    className={cn(
                        "text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight",
                        rainbowGradient
                            ? "bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent animate-gradient-shift"
                            : "text-foreground"
                    )}
                >
                    {textToDisplay}
                    {/* 打字机光标 */}
                    {typewriter && isTyping && (
                        <motion.span
                            className="inline-block w-1 h-[1em] bg-current ml-1"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </h1>
            </motion.div>

            {/* 刷新按钮 - 只在第一次动画完成后显示，之后一直显示 */}
            <AnimatePresence>
                {hasCompletedFirstAnimation && (
                    <motion.button
                        onClick={refreshGreeting}
                        className="mt-4 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        换个问候 🔄
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * 简化版个性化问候
 * 用于性能敏感的场景
 */
export function SimpleGreeting({
    className,
    showTime = true
}: {
    className?: string;
    showTime?: boolean;
}) {
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const getSimpleGreeting = () => {
            const hour = new Date().getHours();
            const timeGreetings = {
                morning: "早上好",
                afternoon: "下午好",
                evening: "晚上好",
                night: "夜深了"
            };

            if (hour >= 5 && hour < 12) return timeGreetings.morning;
            if (hour >= 12 && hour < 17) return timeGreetings.afternoon;
            if (hour >= 17 && hour < 22) return timeGreetings.evening;
            return timeGreetings.night;
        };

        setGreeting(getSimpleGreeting());
    }, []);

    return (
        <div className={cn("text-center", className)}>
            <motion.h2
                className="text-2xl font-semibold text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {greeting}
                {showTime && (
                    <span className="ml-2 text-lg">
                        {new Date().toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                )}
            </motion.h2>
        </div>
    );
}