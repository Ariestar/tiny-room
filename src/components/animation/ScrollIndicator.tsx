"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollIndicatorProps {
    /** 是否显示滚动指示器 */
    visible?: boolean;
    /** 指示器文本 */
    text?: string;
    /** 位置样式 */
    position?: "bottom-center" | "bottom-left" | "bottom-right";
    /** 自定义样式类名 */
    className?: string;
    /** 点击回调 */
    onClick?: () => void;
    /** 自动隐藏延迟（毫秒），0 表示不自动隐藏 */
    autoHideDelay?: number;
}

/**
 * 滚动指示器组件
 * 用于提示用户可以滚动查看更多内容，带有动画效果的向下箭头和文字提示
 */
export function ScrollIndicator({
    visible = true,
    text = "向下滚动查看详情",
    position = "bottom-center",
    className = "",
    onClick,
    autoHideDelay = 5000, // 5秒后自动隐藏
}: ScrollIndicatorProps) {
    const [isVisible, setIsVisible] = useState(visible);

    // 自动隐藏逻辑
    useEffect(() => {
        if (visible && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
        setIsVisible(visible);
    }, [visible, autoHideDelay]);

    // 位置样式映射
    const positionClasses = {
        "bottom-center": "bottom-8 left-1/2 -translate-x-1/2",
        "bottom-left": "bottom-8 left-8",
        "bottom-right": "bottom-8 right-8",
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                        duration: 0.6,
                        ease: "easeOut",
                    }}
                    className={`
            fixed ${positionClasses[position]} z-50
            flex flex-col items-center gap-2
            text-white/80 cursor-pointer
            ${className}
          `}
                    onClick={onClick}
                >
                    {/* 文字提示 */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-sm font-medium tracking-wide select-none"
                    >
                        {text}
                    </motion.p>

                    {/* 动画箭头 */}
                    <motion.div
                        animate={{
                            y: [0, 8, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="flex items-center justify-center"
                    >
                        <ChevronDown
                            size={24}
                            className="drop-shadow-lg"
                        />
                    </motion.div>

                    {/* 装饰性光点 */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="absolute -bottom-2 w-2 h-2 bg-white/40 rounded-full"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default ScrollIndicator;