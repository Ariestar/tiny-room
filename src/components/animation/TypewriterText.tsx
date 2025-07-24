"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/shared/utils";

export interface TypewriterTextProps {
    /** 要显示的文本 */
    text: string;
    /** 打字速度（毫秒） */
    speed?: number;
    /** 是否显示光标 */
    showCursor?: boolean;
    /** 光标字符 */
    cursor?: string;
    /** 是否循环播放 */
    loop?: boolean;
    /** 循环间隔（毫秒） */
    loopDelay?: number;
    /** 是否自动开始 */
    autoStart?: boolean;
    /** 完成回调 */
    onComplete?: () => void;
    /** 自定义类名 */
    className?: string;
    /** 文本数组（用于循环显示多个文本） */
    texts?: string[];
    /** 删除速度（用于循环模式） */
    deleteSpeed?: number;
}

/**
 * 打字机文本动画组件
 */
export function TypewriterText({
    text,
    speed = 100,
    showCursor = true,
    cursor = "|",
    loop = false,
    loopDelay = 2000,
    autoStart = true,
    onComplete,
    className,
    texts,
    deleteSpeed = 50,
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // 获取当前要显示的文本
    const getCurrentText = () => {
        if (texts && texts.length > 0) {
            return texts[currentTextIndex];
        }
        return text;
    };

    // 打字机效果逻辑
    useEffect(() => {
        if (!autoStart) return;

        const currentText = getCurrentText();
        if (!currentText) return;

        let timeoutId: NodeJS.Timeout;

        const typeText = () => {
            if (!isDeleting) {
                // 打字阶段
                if (displayedText.length < currentText.length) {
                    setIsTyping(true);
                    timeoutId = setTimeout(() => {
                        setDisplayedText(currentText.slice(0, displayedText.length + 1));
                    }, speed);
                } else {
                    // 打字完成
                    setIsTyping(false);
                    setIsCompleted(true);
                    onComplete?.();

                    // 如果是循环模式且有多个文本
                    if (loop && texts && texts.length > 1) {
                        timeoutId = setTimeout(() => {
                            setIsDeleting(true);
                            setIsCompleted(false);
                        }, loopDelay);
                    } else if (loop && !texts) {
                        // 单个文本的循环
                        timeoutId = setTimeout(() => {
                            setIsDeleting(true);
                            setIsCompleted(false);
                        }, loopDelay);
                    }
                }
            } else {
                // 删除阶段
                if (displayedText.length > 0) {
                    setIsTyping(true);
                    timeoutId = setTimeout(() => {
                        setDisplayedText(displayedText.slice(0, -1));
                    }, deleteSpeed);
                } else {
                    // 删除完成，切换到下一个文本
                    setIsDeleting(false);
                    setIsTyping(false);

                    if (texts && texts.length > 1) {
                        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                    }
                }
            }
        };

        typeText();

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [
        displayedText,
        isDeleting,
        currentTextIndex,
        speed,
        deleteSpeed,
        loop,
        loopDelay,
        autoStart,
        onComplete,
        texts,
        text,
    ]);

    // 重置函数
    const reset = () => {
        setDisplayedText("");
        setIsTyping(false);
        setIsDeleting(false);
        setCurrentTextIndex(0);
        setIsCompleted(false);
    };

    // 开始打字
    const start = () => {
        reset();
    };

    return (
        <span className={cn("inline-block", className)}>
            {displayedText}
            {showCursor && (
                <motion.span
                    className="inline-block"
                    animate={{ opacity: [1, 0] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {cursor}
                </motion.span>
            )}
        </span>
    );
}

/**
 * 多行打字机文本组件
 */
export function MultilineTypewriter({
    lines,
    speed = 100,
    lineDelay = 500,
    showCursor = true,
    className,
}: {
    lines: string[];
    speed?: number;
    lineDelay?: number;
    showCursor?: boolean;
    className?: string;
}) {
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [completedLines, setCompletedLines] = useState<string[]>([]);

    const handleLineComplete = () => {
        const currentLine = lines[currentLineIndex];
        setCompletedLines((prev) => [...prev, currentLine]);

        setTimeout(() => {
            if (currentLineIndex < lines.length - 1) {
                setCurrentLineIndex((prev) => prev + 1);
            }
        }, lineDelay);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {/* 已完成的行 */}
            {completedLines.map((line, index) => (
                <div key={index} className="opacity-80">
                    {line}
                </div>
            ))}

            {/* 当前正在打字的行 */}
            {currentLineIndex < lines.length && (
                <TypewriterText
                    text={lines[currentLineIndex]}
                    speed={speed}
                    showCursor={showCursor && currentLineIndex === lines.length - 1}
                    onComplete={handleLineComplete}
                />
            )}
        </div>
    );
}

/**
 * 彩虹渐变打字机文本
 */
export function RainbowTypewriter({
    text,
    speed = 100,
    className,
    ...props
}: Omit<TypewriterTextProps, "text"> & { text: string }) {
    return (
        <TypewriterText
            text={text}
            speed={speed}
            className={cn(
                "bg-gradient-to-r from-accent-blue via-accent-purple to-accent-pink bg-clip-text text-transparent",
                className
            )}
            {...props}
        />
    );
}

/**
 * 代码风格打字机
 */
export function CodeTypewriter({
    code,
    language = "javascript",
    speed = 80,
    className,
}: {
    code: string;
    language?: string;
    speed?: number;
    className?: string;
}) {
    return (
        <div className={cn("font-mono text-sm bg-muted/50 rounded-lg p-4", className)}>
            <div className="text-muted-foreground mb-2">{language}</div>
            <TypewriterText
                text={code}
                speed={speed}
                cursor="_"
                className="text-foreground"
            />
        </div>
    );
}