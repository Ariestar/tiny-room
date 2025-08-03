"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { baseSEOConfig } from "@/lib/system/seo/seo";

interface RSSSubscribeProps {
    className?: string;
    variant?: "default" | "minimal" | "floating";
    showDescription?: boolean;
    showStats?: boolean;
}

// RSS图标组件
const RSSIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248S0 22.546 0 20.752s1.456-3.248 3.252-3.248 3.251 1.454 3.251 3.248zM1.677 6.082v4.15c6.988 0 12.65 5.662 12.65 12.65h4.15c0-9.271-7.529-16.8-16.8-16.8zM1.677.014v4.15C14.44 4.164 24.986 14.71 25 27.473h4.15C29.136 12.232 16.918.014 1.677.014z" />
    </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export function RSSSubscribe({
    className = "",
    variant = "default",
    showDescription = true,
    showStats = false,
}: RSSSubscribeProps) {
    const [copied, setCopied] = useState(false);
    const [subscriberCount, setSubscriberCount] = useState(0);

    const rssUrl = `${baseSEOConfig.siteUrl}/api/rss`;

    // 复制RSS链接
    const copyRSSUrl = async () => {
        try {
            await navigator.clipboard.writeText(rssUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy RSS URL:', err);
        }
    };

    // 在新窗口打开RSS
    const openRSSFeed = () => {
        window.open(rssUrl, '_blank');
    };

    if (variant === "floating") {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`fixed bottom-4 right-4 z-50 ${className}`}
            >
                <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={openRSSFeed}
                        className="flex items-center justify-center w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors duration-200"
                        title="订阅RSS"
                    >
                        <RSSIcon className="w-6 h-6" />
                    </button>
                </div>
            </motion.div>
        );
    }

    if (variant === "minimal") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <button
                    onClick={openRSSFeed}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                    title="订阅RSS"
                >
                    <RSSIcon className="w-4 h-4" />
                    RSS
                </button>
                <button
                    onClick={copyRSSUrl}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                    title="复制RSS链接"
                >
                    {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800 ${className}`}
        >
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                        <RSSIcon className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        订阅RSS更新
                    </h3>

                    {showDescription && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            通过RSS订阅获取最新的技术文章和博客更新，支持所有主流RSS阅读器。
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={openRSSFeed}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200"
                        >
                            <RSSIcon className="w-4 h-4" />
                            订阅RSS
                        </button>

                        <button
                            onClick={copyRSSUrl}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                        >
                            {copied ? (
                                <>
                                    <CheckIcon className="w-4 h-4" />
                                    已复制
                                </>
                            ) : (
                                <>
                                    <CopyIcon className="w-4 h-4" />
                                    复制链接
                                </>
                            )}
                        </button>
                    </div>

                    {showStats && subscriberCount > 0 && (
                        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                            已有 {subscriberCount} 人订阅
                        </div>
                    )}
                </div>
            </div>

            {/* RSS URL显示 */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <code className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1 mr-2">
                        {rssUrl}
                    </code>
                    <button
                        onClick={copyRSSUrl}
                        className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                        title="复制链接"
                    >
                        {copied ? <CheckIcon className="w-4 h-4" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* 推荐的RSS阅读器 */}
            <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    推荐的RSS阅读器：
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                    {[
                        { name: "Feedly", url: "https://feedly.com" },
                        { name: "Inoreader", url: "https://inoreader.com" },
                        { name: "NewsBlur", url: "https://newsblur.com" },
                        { name: "The Old Reader", url: "https://theoldreader.com" },
                    ].map((reader) => (
                        <a
                            key={reader.name}
                            href={reader.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors"
                        >
                            {reader.name}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

// 便捷的预设组件
export function BlogRSSSubscribe({ className = "" }: { className?: string }) {
    return (
        <RSSSubscribe
            className={className}
            variant="default"
            showDescription={true}
            showStats={false}
        />
    );
}

export function MinimalRSSSubscribe({ className = "" }: { className?: string }) {
    return (
        <RSSSubscribe
            className={className}
            variant="minimal"
            showDescription={false}
            showStats={false}
        />
    );
}

export function FloatingRSSSubscribe({ className = "" }: { className?: string }) {
    return (
        <RSSSubscribe
            className={className}
            variant="floating"
            showDescription={false}
            showStats={false}
        />
    );
}