"use client";

import React, { useMemo, useRef } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useResponsive } from "@/hooks/useResponsive";
import { getYearGroups } from "@/lib/data/content/timeline";

import { TimelineEmptyState } from "./TimelineEmptyState";
import { TimelineItem } from "./TimelineItem";
import { TimelineFooter } from "./TimelineFooter";
import type { TimelinePost } from "./types";
import type { getSortedPostsData } from "@/lib/data/content/posts";

type PostSummary = ReturnType<typeof getSortedPostsData>[number];

interface TimelineLayoutProps {
    posts: PostSummary[];
    disabled?: boolean;
}

/**
 * 现代化时间线布局组件
 * 重构后的简洁版本，职责分离清晰
 */
export const TimelineLayout: React.FC<TimelineLayoutProps> = ({
    posts,
    disabled = false,
}) => {
    const { isMobile } = useResponsive();
    const containerRef = useRef<HTMLDivElement>(null);

    // 滚动监听和视差效果
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // 视差变换效果
    const decorationY = useTransform(scrollYProgress, [0, 1], ["0%", "-150%"]);

    // 旋转效果
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const rotateReverse = useTransform(scrollYProgress, [0, 1], [0, -180]);

    // 获取按年份分组的数据
    const yearGroups = useMemo(() => getYearGroups(posts), [posts]);

    // 扁平化所有文章用于渲染
    const allPosts = useMemo(() => {
        const flatPosts: (TimelinePost & { showYearLabel?: boolean })[] = [];

        yearGroups.forEach((group) => {
            group.posts.forEach((post, postIndex) => {
                flatPosts.push({
                    ...post,
                    showYearLabel: postIndex === 0, // 每年第一篇文章显示年份标签
                });
            });
        });

        return flatPosts;
    }, [yearGroups]);

    // 空状态处理
    if (!posts.length) {
        return <TimelineEmptyState />;
    }

    return (
        <div ref={containerRef} className="relative w-full max-w-none py-12">

            {/* 主要内容网格 */}
            <div
                className={`
                    relative grid items-start mx-auto
                    ${isMobile
                        ? 'grid-cols-[32px_1fr] max-w-4xl px-4'
                        : 'grid-cols-[200px_48px_1fr] max-w-7xl px-24'
                    }
                `}
            >
                {allPosts.map((post, index) => (
                    <TimelineItem
                        key={post.slug}
                        post={post}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        disabled={disabled}
                        isMobile={isMobile}
                        isLastItem={index === allPosts.length - 1}
                        yearGroups={yearGroups}
                    />
                ))}
            </div>

            {/* 底部装饰 */}
            <TimelineFooter
                scrollYProgress={scrollYProgress}
                disabled={disabled}
                isMobile={isMobile}
                decorationY={decorationY}
                rotate={rotate}
                rotateReverse={rotateReverse}
                postsLength={allPosts.length}
            />
        </div>
    );
};

export default TimelineLayout;