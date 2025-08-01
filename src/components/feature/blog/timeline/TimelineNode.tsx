"use client";

import React from "react";
import { motion, useTransform } from "framer-motion";
import type { TimelinePost } from "./types";

interface TimelineNodeProps {
    post: TimelinePost & { showYearLabel?: boolean };
    index: number;
    scrollYProgress: any;
    disabled: boolean;
    isMobile: boolean;
    isLastItem: boolean;
    isHovered: boolean;
    className?: string;
    style?: React.CSSProperties;
}

/**
 * 时间线节点组件
 */
export const TimelineNode: React.FC<TimelineNodeProps> = ({
    post,
    index,
    isMobile,
    isLastItem,
    isHovered,
    className,
}) => {

    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                delay: index * 0.03 + 0.5,
                duration: 0.4,
                type: "tween",
                stiffness: 400,
                damping: 25,
            }}
        >

            {/* 时间线节点 */}
            <div
                className="relative group cursor-pointer h-full"

                title={`${post.title} (${new Date(post.date).toLocaleDateString('zh-CN')})`}
            >
                {/* 节点光晕 */}
                <div
                    className={`
                        absolute inset-0 rounded-full blur-sm
                        transition-opacity duration-fast top-2
                        ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}
                        ${isHovered ? 'opacity-60' : 'opacity-0'}
                    `}
                    style={{
                        backgroundColor: post.nodeColor,
                        transform: 'scale(2)',
                    }}
                />
                {/* 新增: 连接卡片的短线 */}
                {!isMobile && (
                    <motion.div
                        className="absolute left-1/2 top-[1.1rem] h-0.5 -translate-y-1/2"
                        style={{
                            backgroundColor: post.nodeColor,
                            width: 'calc(100% + 1rem)'
                        }}
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            delay: index * 0.03 + 0.5,
                            duration: 0.4,
                            ease: "easeOut",
                        }}
                    />
                )}
                {/* 连接线 */}
                <div className="absolute left-1/2 top-8 w-0.5 h-full -translate-x-1/2"
                    style={{
                        background: post.nodeColor,
                    }}
                />
                {/* 节点主体 */}
                <motion.div
                    className={`
                        relative rounded-full border-4 border-background shadow-lg 
                       top-2
                        ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}
                    `}
                    style={{
                        backgroundColor: post.nodeColor,
                        boxShadow: `0 0 0 2px ${post.nodeColor}20, 0 4px 12px ${post.nodeColor}30`,
                    }}
                    animate={{ scale: isHovered ? 1.3 : 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
            </div>
        </motion.div>
    );
};

export default TimelineNode;