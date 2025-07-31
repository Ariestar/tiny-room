"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";

interface TimelineBackgroundProps {
    scrollYProgress: any;
    disabled: boolean;
    isMobile: boolean;
    backgroundY: any;
    timelineY: any;
    decorationY: any;
    floatingY: any;
    rotate: any;
    rotateReverse: any;
}

/**
 * 时间线背景装饰组件
 * 包含所有背景视差装饰元素
 */
export const TimelineBackground: React.FC<TimelineBackgroundProps> = ({
    scrollYProgress,
    disabled,
    isMobile,
    backgroundY,
    timelineY,
    decorationY,
    floatingY,
    rotate,
    rotateReverse,
}) => {
    // 创建一个从上到下贯穿整个页面的曲线视差
    // 这里保持了曲线的逻辑，如果你不需要可以删除
    const curveY = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
    const curveOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.1, 0]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 主时间线 */}
            <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-border/30 to-transparent"
                style={{ y: disabled ? 0 : timelineY }}
            />


            {/* 浮动装饰元素 - 重新设计位置和大小 */}
            {!disabled && !isMobile && (
                <>
                    {/* 左侧区域 */}
                    <motion.div
                        className="absolute top-[5%] left-[5%] w-52 h-52 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-xl"
                        style={{ y: floatingY, rotate }}
                    />
                    <motion.div
                        className="absolute top-[55%] left-[2%] w-24 h-24 rounded-full bg-gradient-to-br from-pink-400/10 to-rose-400/10 blur-lg"
                        style={{ y: backgroundY, rotate: rotateReverse }}
                    />
                    <motion.div
                        className="absolute top-[80%] left-[25%] w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-2xl"
                        style={{ y: decorationY, rotate }}
                    />

                    {/* 右侧区域 */}
                    <motion.div
                        className="absolute top-[35%] right-[5%] w-80 h-80 rounded-full bg-gradient-to-br from-green-400/10 to-teal-400/10 blur-2xl"
                        style={{ y: backgroundY, rotate: rotateReverse }}
                    />
                    <motion.div
                        className="absolute top-[70%] right-[15%] w-28 h-28 rounded-full bg-gradient-to-br from-orange-400/10 to-yellow-400/10 blur-xl"
                        style={{ y: floatingY, rotate }}
                    />
                    <motion.div
                        className="absolute top-[10%] right-[25%] w-16 h-16 rounded-full bg-gradient-to-br from-rose-400/10 to-red-400/10 blur-md"
                        style={{ y: decorationY, rotate: rotateReverse }}
                    />
                </>
            )}
        </div>
    );
};

export default TimelineBackground;