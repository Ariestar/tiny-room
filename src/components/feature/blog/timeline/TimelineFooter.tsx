"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";

interface TimelineFooterProps {
    scrollYProgress: any;
    disabled: boolean;
    isMobile: boolean;
    decorationY: any;
    rotate: any;
    rotateReverse: any;
    postsLength: number;
}

/**
 * 时间线底部装饰组件
 * 包含结尾装饰和视差效果
 */
export const TimelineFooter: React.FC<TimelineFooterProps> = ({
    scrollYProgress,
    disabled,
    isMobile,
    decorationY,
    rotate,
    rotateReverse,
    postsLength,
}) => {
    // 底部装饰的缩放效果
    const bottomScale = useTransform(scrollYProgress, [0.8, 1], [1, 1.2]);

    return (
        <motion.div
            className="flex items-center justify-center mt-16 pt-8 border-t border-border/20 relative"
            style={{ y: disabled ? 0 : decorationY }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: postsLength * 0.03 + 0.5, duration: 0.6 }}
        >
            {/* 背景光晕效果 */}
            {!disabled && !isMobile && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-xl"
                    style={{ scale: bottomScale }}
                />
            )}

            <div className="flex items-center gap-3 text-muted-foreground/60 relative z-10">
                <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                    style={{ rotate: disabled ? 0 : rotate }}
                />
                <span className="text-sm font-medium">时光荏苒，文字永恒</span>
                <motion.div
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                    style={{ rotate: disabled ? 0 : rotateReverse }}
                />
            </div>
        </motion.div>
    );
};

export default TimelineFooter;