"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * 时间线空状态组件
 * 当没有文章时显示的友好提示
 */
export const TimelineEmptyState: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <p className="text-muted-foreground text-lg font-medium">暂无文章</p>
                <p className="text-muted-foreground/70 text-sm mt-2">开始创作你的第一篇文章吧</p>
            </motion.div>
        </div>
    );
};

export default TimelineEmptyState;