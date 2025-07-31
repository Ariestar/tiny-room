"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Badge from "@/components/ui/Badge";
import { MagneticHover, BreathingAnimation } from "@/components/animation";
import type { TimelinePost } from "./types";
import type { getSortedPostsData } from "@/lib/data/content/posts";

// 支持两种类型的文章数据
type PostData = TimelinePost | ReturnType<typeof getSortedPostsData>[number];

interface TimelinePostCardProps {
    post: PostData;
    index: number;
    isLeft: boolean; // 是否在时间线左侧
    disabled?: boolean;
    yearColor?: string; // 年份颜色
}

/**
 * 时间线文章卡片组件
 * 专为时间线布局设计的文章卡片
 */
export const TimelinePostCard: React.FC<TimelinePostCardProps> = ({
    post,
    index,
    isLeft,
    disabled = false,
    yearColor,
}) => {
    // 获取年份颜色，如果没有提供则使用默认颜色
    const nodeColor = 'nodeColor' in post ? post.nodeColor : yearColor || '#3b82f6';

    const cardRef = useRef<HTMLDivElement>(null);

    // 卡片内部视差效果
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // 内部元素的微妙视差
    const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
    const tagsY = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
    const infoY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
    const decorationRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

    // 新增：基于滚动位置的缩放和透明度变换
    const scale = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [0.9, 1, 0.9]
    );
    const opacity = useTransform(
        scrollYProgress,
        [0, 0.5, 1],
        [0.7, 1, 0.7]
    );


    return (
        <motion.div
            ref={cardRef}
            className="relative w-full group/card"
            style={{
                scale: disabled ? 1 : scale,
                opacity: disabled ? 1 : opacity
            }}
            initial={{ opacity: 0, x: isLeft !== undefined ? (isLeft ? -50 : 50) : 0, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                delay: index * 0.05,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 25,
            }}
        >
            {/* 连接线到时间轴 - 从左侧连接到时间线 */}
            <motion.div
                className="absolute w-6 h-0.5 left-0 -translate-x-full top-8"
                style={{
                    background: `linear-gradient(to left, ${nodeColor}80, transparent)`,
                }}
                initial={{ scaleX: 0, originX: 1 }}
                animate={{ scaleX: 1 }}
                transition={{
                    delay: index * 0.05 + 0.3,
                    duration: 0.4,
                    ease: "easeOut"
                }}
            />

            <MagneticHover
                strength={0.3}
                scaleOnHover={1.01}
                showHalo={false}
                disabled={disabled}
                className="block w-full"
            >
                <BreathingAnimation
                    contentType="article"
                    delay={index * 0.1}
                    pauseOnHover={false}
                    duration={1}
                    scaleRange={[1, 1.01]}
                    disabled={disabled}
                    className="relative w-full"
                >
                    <Link href={`/blog/${post.slug}`} className="block group">
                        {/* 卡片主体 */}
                        <div className="relative m-4 bg-card/80 backdrop-blur-sm border border-border/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:border-border/50">
                            {/* 背景装饰渐变 */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `linear-gradient(135deg, ${nodeColor}08, ${nodeColor}03, transparent)`,
                                }}
                            />

                            {/* 顶部装饰条 */}
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                style={{
                                    background: `linear-gradient(90deg, ${nodeColor}, ${nodeColor}80, transparent)`,
                                    rotate: disabled ? 0 : decorationRotate,
                                    transformOrigin: "center",
                                }}
                            />

                            <div className="relative p-6">
                                {/* 文章标题 */}
                                <motion.h3
                                    className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight"
                                    style={{ y: disabled ? 0 : titleY }}
                                >
                                    {post.title}
                                </motion.h3>

                                {/* 标签 */}
                                <motion.div
                                    className="flex flex-wrap gap-2 mb-4"
                                    style={{ y: disabled ? 0 : tagsY }}
                                >
                                    {post.tags.map((tag, tagIndex) => (
                                        <motion.div
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                delay: index * 0.05 + tagIndex * 0.1,
                                                duration: 0.3
                                            }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary/60 hover:bg-secondary/80 transition-colors duration-200"
                                            >
                                                {tag}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* 文章信息 */}
                                <motion.div
                                    className="flex items-center justify-between text-sm text-muted-foreground"
                                    style={{ y: disabled ? 0 : infoY }}
                                >
                                    <time
                                        dateTime={post.date}
                                        className="flex items-center gap-1.5 font-medium"
                                    >
                                        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(post.date).toLocaleDateString("zh-CN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </time>
                                    <span className="flex items-center gap-1.5 font-medium">
                                        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {post.readingTime}
                                    </span>
                                </motion.div>
                            </div>
                        </div>

                    </Link>
                </BreathingAnimation>
            </MagneticHover>
        </motion.div>
    );
};

export default TimelinePostCard;