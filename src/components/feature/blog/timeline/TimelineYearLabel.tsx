"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import type { TimelinePost } from "./types";

interface TimelineYearLabelProps {
    post: TimelinePost & { showYearLabel?: boolean };
    index: number;
    scrollYProgress: any;
    disabled: boolean;
    isMobile: boolean;
    yearGroups: any[];
    className?: string;
    style?: React.CSSProperties;
}

/**
 * 时间线年份标签组件
 * 带有视差效果的年份标签
 */
export const TimelineYearLabel: React.FC<TimelineYearLabelProps> = ({
    post,
    index,
    scrollYProgress,
    disabled,
    isMobile,
    yearGroups,
    className,
    style
}) => {
    const labelY = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `${-25 + index * 5}%`]
    );

    if (!post.showYearLabel) {
        return null;
    }

    return (
        <motion.div
            className={className}
            style={{
                ...style,
                y: disabled || isMobile ? 0 : labelY,
            }}
            initial={{ opacity: 0, x: -30, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
                delay: index * 0.03,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
        >
            <div className="relative group">
                {/* 年份标签背景光晕 */}
                <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${post.nodeColor}, ${post.nodeColor}80)`,
                    }}
                />

                {/* 年份标签主体 */}
                <div
                    className={`
                        relative whitespace-nowrap bg-background/80 backdrop-blur-md rounded-2xl 
                        shadow-lg border font-bold transition-all duration-300
                        group-hover:shadow-xl group-hover:scale-105
                        px-5 py-3 text-base
                    `}
                    style={{
                        borderColor: `${post.nodeColor}40`,
                        color: post.nodeColor,
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black">{post.year}</span>
                        <div className="flex flex-col items-start">
                            <span className="text-xs opacity-70 font-normal">
                                {yearGroups.find(g => g.year === post.year)?.posts.length || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TimelineYearLabel;