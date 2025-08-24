"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface PersonalizedLoadingProps {
    variant?: "skeleton" | "spinner" | "dots" | "wave" | "pulse";
    size?: "sm" | "md" | "lg";
    message?: string;
    showProgress?: boolean;
    className?: string;
}

const loadingMessages = [
    "正在准备精彩内容... 🎨",
    "马上就好，请稍等片刻... ⏰",
    "正在加载创意灵感... ✨",
    "内容正在路上... 🚀",
    "准备展示美好事物... 🌟",
    "正在整理思绪... 💭",
    "马上为您呈现... 🎭",
    "正在调试人生... 🐛"
];

export function PersonalizedLoading({
    variant = "dots",
    size = "md",
    message,
    showProgress = false,
    className = ""
}: PersonalizedLoadingProps) {
    // 使用固定的初始消息，避免水合错误
    const [currentMessage, setCurrentMessage] = useState(
        message || loadingMessages[0] // 使用固定的第一条消息
    );
    const [progress, setProgress] = useState(0);

    // 随机切换加载消息 - 只在客户端渲染后开始
    useEffect(() => {
        if (!message) {
            // 延迟一下再开始随机切换，确保水合完成
            const timer = setTimeout(() => {
                setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            }, 100);

            const interval = setInterval(() => {
                setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            }, 2000);

            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }
    }, [message]);

    // 模拟进度条
    useEffect(() => {
        if (showProgress) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const increment = Math.random() * 15;
                    const newProgress = Math.min(prev + increment, 95);
                    return newProgress;
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [showProgress]);

    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    const containerSizes = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
    };

    return (
        <div className={`flex flex-col items-center justify-center ${containerSizes[size]} ${className}`}>
            {/* 加载动画 */}
            <div className="mb-4">
                {variant === "skeleton" && <SkeletonLoader size={size} />}
                {variant === "spinner" && <SpinnerLoader size={size} />}
                {variant === "dots" && <DotsLoader size={size} />}
                {variant === "wave" && <WaveLoader size={size} />}
                {variant === "pulse" && <PulseLoader size={size} />}
            </div>

            {/* 加载消息 */}
            <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
            >
                <p className="text-gray-600 text-sm font-medium mb-2">
                    {currentMessage}
                </p>
            </motion.div>

            {/* 进度条 */}
            {showProgress && (
                <div className="w-full max-w-xs">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">
                        {Math.round(progress)}%
                    </p>
                </div>
            )}
        </div>
    );
}

// 骨架屏加载器
function SkeletonLoader({ size }: { size: string }) {
    return (
        <div className="space-y-3 w-full max-w-sm">
            {/* 头像骨架 */}
            <div className="flex items-center space-x-3">
                <motion.div
                    className="rounded-full bg-gray-200"
                    style={{ width: size === 'lg' ? '60px' : size === 'md' ? '48px' : '36px', height: size === 'lg' ? '60px' : size === 'md' ? '48px' : '36px' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="space-y-2 flex-1">
                    <motion.div
                        className="h-4 bg-gray-200 rounded"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                        className="h-3 bg-gray-200 rounded w-3/4"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    />
                </div>
            </div>

            {/* 内容骨架 */}
            <div className="space-y-2">
                <motion.div
                    className="h-3 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
                <motion.div
                    className="h-3 bg-gray-200 rounded w-5/6"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                />
                <motion.div
                    className="h-3 bg-gray-200 rounded w-4/6"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }}
                />
            </div>
        </div>
    );
}

// 旋转加载器
function SpinnerLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    return (
        <motion.div
            className={`border-4 border-gray-200 border-t-blue-500 rounded-full ${sizeClasses[size]}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    );
}

// 点点加载器
function DotsLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const dotSize: Record<'sm' | 'md' | 'lg', string> = {
        sm: "w-2 h-2",
        md: "w-3 h-3",
        lg: "w-4 h-4"
    };

    return (
        <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className={`bg-blue-500 rounded-full ${dotSize[size]}`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: index * 0.2
                    }}
                />
            ))}
        </div>
    );
}

// 波浪加载器
function WaveLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const barHeight: Record<'sm' | 'md' | 'lg', string> = {
        sm: "h-4",
        md: "h-6",
        lg: "h-8"
    };

    return (
        <div className="flex items-end space-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
                <motion.div
                    key={index}
                    className={`w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full ${barHeight[size]}`}
                    animate={{
                        scaleY: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.1
                    }}
                />
            ))}
        </div>
    );
}

// 脉冲加载器
function PulseLoader({ size }: { size: 'sm' | 'md' | 'lg' }) {
    const pulseSize = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    return (
        <div className="relative">
            <motion.div
                className={`bg-blue-500 rounded-full ${pulseSize[size]}`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 0.3, 0.7]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity
                }}
            />
            <motion.div
                className={`absolute inset-0 bg-purple-500 rounded-full ${pulseSize[size]}`}
                animate={{
                    scale: [1.2, 1.4, 1.2],
                    opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.3
                }}
            />
        </div>
    );
}

export default PersonalizedLoading;