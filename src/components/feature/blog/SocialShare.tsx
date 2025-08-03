"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
    hashtags?: string[];
    className?: string;
    showLabels?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "minimal" | "floating";
    onShare?: (platform: string) => void;
}

interface SharePlatform {
    name: string;
    icon: React.ReactNode;
    shareUrl: (url: string, title: string, description?: string, hashtags?: string[]) => string;
    color: string;
    hoverColor: string;
}

// 社交平台图标组件
const TwitterIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const WeiboIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9.31 8.17c-.04.2-.12.4-.25.56-.13.16-.3.28-.5.36-.2.08-.42.12-.64.12-.22 0-.44-.04-.64-.12-.2-.08-.37-.2-.5-.36-.13-.16-.21-.36-.25-.56-.04-.2-.04-.4 0-.6.04-.2.12-.4.25-.56.13-.16.3-.28.5-.36.2-.08.42-.12.64-.12.22 0 .44.04.64.12.2.08.37.2.5.36.13.16.21.36.25.56.04.2.04.4 0 .6zm11.48 7.92c-.48 2.84-2.18 5.4-4.64 7.04-2.46 1.64-5.46 2.32-8.46 1.88-3-.44-5.76-2.04-7.64-4.44-1.88-2.4-2.76-5.44-2.44-8.48.32-3.04 1.8-5.84 4.08-7.72 2.28-1.88 5.16-2.72 8.16-2.32 3 .4 5.8 1.96 7.72 4.32 1.92 2.36 2.84 5.36 2.64 8.36-.2 3-.96 5.88-2.42 8.36z" />
    </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
);// 社交平
台配置
const SHARE_PLATFORMS: SharePlatform[] = [
    {
        name: "Twitter",
        icon: <TwitterIcon className="w-full h-full" />,
        shareUrl: (url, title, description, hashtags) => {
            const text = `${title}${description ? ` - ${description}` : ''}`;
            const hashtagsStr = hashtags?.length ? ` ${hashtags.map(tag => `#${tag}`).join(' ')}` : '';
            return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + hashtagsStr)}&url=${encodeURIComponent(url)}`;
        },
        color: "#1DA1F2",
        hoverColor: "#0d8bd9",
    },
    {
        name: "微博",
        icon: <WeiboIcon className="w-full h-full" />,
        shareUrl: (url, title, description) => {
            const text = `${title}${description ? ` - ${description}` : ''}`;
            return `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        },
        color: "#E6162D",
        hoverColor: "#c41230",
    },
    {
        name: "LinkedIn",
        icon: <LinkedInIcon className="w-full h-full" />,
        shareUrl: (url, title, description) => {
            return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description || '')}`;
        },
        color: "#0077B5",
        hoverColor: "#005885",
    },
    {
        name: "Facebook",
        icon: <FacebookIcon className="w-full h-full" />,
        shareUrl: (url, title) => {
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
        },
        color: "#1877F2",
        hoverColor: "#166fe5",
    },
];

export function SocialShare({
    url,
    title,
    description,
    hashtags = [],
    className = "",
    showLabels = false,
    size = "md",
    variant = "default",
    onShare,
}: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [shareCount, setShareCount] = useState<Record<string, number>>({});

    // 获取完整URL
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

    // 复制链接到剪贴板
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            onShare?.('copy');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    // 处理社交分享
    const handleShare = (platform: SharePlatform) => {
        const shareUrl = platform.shareUrl(fullUrl, title, description, hashtags);
        window.open(shareUrl, '_blank', 'width=600,height=400');
        onShare?.(platform.name.toLowerCase());

        // 更新分享计数（模拟）
        setShareCount(prev => ({
            ...prev,
            [platform.name]: (prev[platform.name] || 0) + 1
        }));
    };

    // 获取按钮尺寸
    const getButtonSize = () => {
        switch (size) {
            case "sm": return "w-8 h-8";
            case "lg": return "w-12 h-12";
            default: return "w-10 h-10";
        }
    };

    // 获取图标尺寸
    const getIconSize = () => {
        switch (size) {
            case "sm": return "w-4 h-4";
            case "lg": return "w-6 h-6";
            default: return "w-5 h-5";
        }
    };

    const buttonSize = getButtonSize();
    const iconSize = getIconSize();

    if (variant === "floating") {
        return (
            <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
                <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 space-y-2">
                    {SHARE_PLATFORMS.map((platform, index) => (
                        <motion.button
                            key={platform.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleShare(platform)}
                            className={`${buttonSize} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110`}
                            style={{
                                backgroundColor: platform.color,
                                color: 'white'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = platform.hoverColor;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = platform.color;
                            }}
                            title={`分享到${platform.name}`}
                        >
                            <div className={iconSize}>
                                {platform.icon}
                            </div>
                        </motion.button>
                    ))}

                    {/* 复制链接按钮 */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: SHARE_PLATFORMS.length * 0.1 }}
                        onClick={copyToClipboard}
                        className={`${buttonSize} rounded-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200 hover:scale-110`}
                        title="复制链接"
                    >
                        <div className={iconSize}>
                            {copied ? <CheckIcon /> : <CopyIcon />}
                        </div>
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {variant === "default" && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    分享到：
                </span>
            )}

            <div className="flex items-center gap-2">
                {SHARE_PLATFORMS.map((platform, index) => (
                    <motion.button
                        key={platform.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleShare(platform)}
                        className={`${buttonSize} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${variant === "minimal"
                            ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                            : ""
                            }`}
                        style={variant === "minimal" ? {} : {
                            backgroundColor: platform.color,
                            color: 'white'
                        }}
                        onMouseEnter={(e) => {
                            if (variant !== "minimal") {
                                e.currentTarget.style.backgroundColor = platform.hoverColor;
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (variant !== "minimal") {
                                e.currentTarget.style.backgroundColor = platform.color;
                            }
                        }}
                        title={`分享到${platform.name}`}
                    >
                        <div className={`${iconSize} ${variant === "minimal" ? "text-gray-600 dark:text-gray-300" : ""}`}>
                            {platform.icon}
                        </div>
                    </motion.button>
                ))}

                {/* 复制链接按钮 */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: SHARE_PLATFORMS.length * 0.1 }}
                    onClick={copyToClipboard}
                    className={`${buttonSize} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 ${variant === "minimal"
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                        : "bg-gray-600 hover:bg-gray-700 text-white"
                        }`}
                    title="复制链接"
                >
                    <div className={`${iconSize} ${variant === "minimal" ? "text-gray-600 dark:text-gray-300" : ""}`}>
                        {copied ? <CheckIcon /> : <CopyIcon />}
                    </div>
                </motion.button>
            </div>

            {showLabels && (
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {Object.entries(shareCount).map(([platform, count]) => (
                        <span key={platform}>
                            {platform}: {count}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}// 便捷
的预设组件
export function BlogPostShare({
    slug,
    title,
    description,
    tags = [],
    className = "",
}: {
    slug: string;
    title: string;
    description?: string;
    tags?: string[];
    className?: string;
}) {
    const url = `/blog/${slug}`;
    const hashtags = tags.slice(0, 3); // 限制标签数量

    return (
        <SocialShare
            url={url}
            title={title}
            description={description}
            hashtags={hashtags}
            className={className}
            showLabels={false}
            size="md"
            variant="default"
            onShare={(platform) => {
                // 发送分享事件到分析API
                if (typeof window !== 'undefined') {
                    fetch('/api/analytics/share', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            slug,
                            platform,
                            title,
                            timestamp: new Date().toISOString(),
                        }),
                    }).catch(console.error);
                }
            }}
        />
    );
}

export function FloatingSocialShare({
    url,
    title,
    description,
    hashtags,
    className = "",
}: {
    url: string;
    title: string;
    description?: string;
    hashtags?: string[];
    className?: string;
}) {
    return (
        <SocialShare
            url={url}
            title={title}
            description={description}
            hashtags={hashtags}
            className={className}
            variant="floating"
            size="md"
            onShare={(platform) => {
                // 发送分享事件到分析API
                if (typeof window !== 'undefined') {
                    fetch('/api/analytics/share', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url,
                            platform,
                            title,
                            timestamp: new Date().toISOString(),
                        }),
                    }).catch(console.error);
                }
            }}
        />
    );
}

export function MinimalSocialShare({
    url,
    title,
    description,
    className = "",
}: {
    url: string;
    title: string;
    description?: string;
    className?: string;
}) {
    return (
        <SocialShare
            url={url}
            title={title}
            description={description}
            className={className}
            variant="minimal"
            size="sm"
            showLabels={false}
        />
    );
}

// 分享统计Hook
export function useShareTracking(slug: string) {
    const [shareStats, setShareStats] = useState<Record<string, number>>({});

    useEffect(() => {
        // 获取分享统计数据
        fetch(`/api/analytics/share?slug=${slug}`)
            .then(res => res.json())
            .then(data => setShareStats(data.stats || {}))
            .catch(console.error);
    }, [slug]);

    const trackShare = (platform: string) => {
        fetch('/api/analytics/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slug,
                platform,
                timestamp: new Date().toISOString(),
            }),
        }).catch(console.error);

        // 更新本地统计
        setShareStats(prev => ({
            ...prev,
            [platform]: (prev[platform] || 0) + 1
        }));
    };

    return { shareStats, trackShare };
}