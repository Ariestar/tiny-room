"use client";

import React, { useState } from "react";
import { motion, useTransform } from "framer-motion";
import { TimelinePostCard } from "./TimelinePostCard";
import { TimelineYearLabel } from "./TimelineYearLabel";
import { TimelineNode } from "./TimelineNode";
import type { TimelinePost } from "./types";

interface TimelineItemProps {
    post: TimelinePost & { showYearLabel?: boolean };
    index: number;
    scrollYProgress: any;
    disabled: boolean;
    isMobile: boolean;
    isLastItem: boolean;
    yearGroups: any[];
}



/**
 * 时间线项目组件
 * 包含年份标签、节点和文章卡片的完整组合
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({
    post,
    index,
    scrollYProgress,
    disabled,
    isMobile,
    isLastItem,
    yearGroups,
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <React.Fragment key={post.slug}>
            {/* 年份标签 */}
            <TimelineYearLabel
                post={post}
                index={index}
                scrollYProgress={scrollYProgress}
                disabled={disabled}
                isMobile={isMobile}
                yearGroups={yearGroups}
                className={`
                    relative
                    ${isMobile
                        ? 'hidden'
                        : 'col-start-1 flex items-center justify-end pr-6'
                    }
                `}
                style={{ gridRow: index + 1 }}
            />

            {/* 时间线节点和卡片的容器，用于统一处理Hover事件 */}
            <div
                className={`contents`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* 时间线节点 */}
                <TimelineNode
                    post={post}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    disabled={disabled}
                    isMobile={isMobile}
                    isLastItem={isLastItem}
                    isHovered={isHovered}
                    className={`
                        flex h-full items-start justify-center mt-20
                        ${isMobile ? 'col-start-1' : 'col-start-2'}
                    `}
                    style={{ gridRow: index + 1 }}
                />

                {/* 文章卡片 */}
                <TimelinePostCard
                    post={post}
                    index={index}
                    isLeft={false}
                    disabled={disabled}
                    yearColor={post.nodeColor}
                    isHovered={isHovered}
                    className={` 
                        min-w-0
                        ${isMobile ? 'col-start-2 p-4' : 'col-start-3 py-6 px-12'}
                    `}
                    style={{ gridRow: index + 1 }}
                />
            </div>
        </React.Fragment>
    );
};

export default TimelineItem;