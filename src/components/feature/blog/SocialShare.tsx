"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    SiTencentqq,
    SiWechat,
    SiX,
    SiSinaweibo,
    SiLinkedin,
    SiFacebook
} from "react-icons/si";
import { Copy, Check } from "lucide-react";

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
    hashtags?: string[];
    className?: string;
    showLabels?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "minimal" | "floating" | "compact" | "mobile";
    onShare?: (platform: string) => void;
}

interface SharePlatform {
    name: string;
    icon: React.ReactNode;
    shareUrl: (url: string, title: string, description?: string, hashtags?: string[]) => string;
    color: string;
    hoverColor: string;
}

// 社交平台配置
const SHARE_PLATFORMS: SharePlatform[] = [
    {
        name: "微博",
        icon: <SiSinaweibo className="w-full h-full" />,
        shareUrl: (url, title, description) => {
            const text = `${title}${description ? ` - ${description}` : ''}`;
            return `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        },
        color: "#E6162D",
        hoverColor: "#c41230",
    },
    {
        name: "QQ",
        icon: <SiTencentqq className="w-full h-full" />,
        shareUrl: (url, title, description) => {
            const text = `${title}${description ? ` - ${description}` : ''}`;
            return `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}&source=blog`;
        },
        color: "#12B7F5",
        hoverColor: "#0ea5e9",
    },
    {
        name: "微信",
        icon: <SiWechat className="w-full h-full" />,
        shareUrl: (url, title, description) => {
            return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        },
        color: "#07C160",
        hoverColor: "#06ad56",
    },
];

// 尺寸配置
const SIZE_CONFIG = {
    sm: { button: "w-8 h-8", icon: "w-4 h-4" },
    md: { button: "w-10 h-10", icon: "w-5 h-5" },
    lg: { button: "w-12 h-12", icon: "w-6 h-6" },
};

// 共享按钮组件
interface ShareButtonProps {
    platform: SharePlatform;
    size: keyof typeof SIZE_CONFIG;
    variant: string;
    onClick: () => void;
    index?: number;
    className?: string;
}

function ShareButton({ platform, size, variant, onClick, index = 0, className = "" }: ShareButtonProps) {
    const { button: buttonSize, icon: iconSize } = SIZE_CONFIG[size];

    const baseClasses = `${buttonSize} flex items-center justify-center transition-all duration-300 ${className}`;

    if (variant === "floating") {
        return (
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`${baseClasses} rounded-full`}
                style={{ backgroundColor: platform.color, color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = platform.hoverColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = platform.color}
                title={`分享到${platform.name}`}
            >
                <div className={iconSize}>{platform.icon}</div>
            </motion.button>
        );
    }

    if (variant === "compact") {
        return (
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                    scale: 1.03,
                    y: -1,
                    transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`${baseClasses} rounded-lg shadow-sm hover:shadow-md`}
                style={{ backgroundColor: platform.color, color: 'white' }}
                title={`分享到${platform.name}`}
            >
                <div className={iconSize}>{platform.icon}</div>
            </motion.button>
        );
    }

    if (variant === "mobile") {
        return (
            <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    delay: index * 0.04,
                    duration: 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="flex flex-col items-center p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: platform.color }}
                >
                    <div className="w-5 h-5 text-white">{platform.icon}</div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                    {platform.name}
                </span>
            </motion.button>
        );
    }

    // default 和 minimal 变体
    const isMinimal = variant === "minimal";
    return (
        <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.03,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
                scale: 1.03,
                y: -1,
                transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseClasses} rounded-xl shadow-lg hover:shadow-xl ${isMinimal
                ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                : "border-2 border-white/20"
                }`}
            style={isMinimal ? {} : {
                backgroundColor: platform.color,
                color: 'white',
                boxShadow: `0 4px 15px ${platform.color}30`
            }}
            onMouseEnter={(e) => {
                if (!isMinimal) {
                    e.currentTarget.style.backgroundColor = platform.hoverColor;
                    e.currentTarget.style.boxShadow = `0 8px 25px ${platform.color}40`;
                }
            }}
            onMouseLeave={(e) => {
                if (!isMinimal) {
                    e.currentTarget.style.backgroundColor = platform.color;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${platform.color}30`;
                }
            }}
            title={`分享到${platform.name}`}
        >
            <div className={`${iconSize} ${isMinimal ? "text-gray-600 dark:text-gray-300" : ""}`}>
                {platform.icon}
            </div>
        </motion.button>
    );
}

// 复制按钮组件
interface CopyButtonProps {
    copied: boolean;
    size: keyof typeof SIZE_CONFIG;
    variant: string;
    onClick: () => void;
    index?: number;
    className?: string;
}

function CopyButton({ copied, size, variant, onClick, index = 0, className = "" }: CopyButtonProps) {
    const { button: buttonSize, icon: iconSize } = SIZE_CONFIG[size];
    const baseClasses = `${buttonSize} flex items-center justify-center transition-all duration-300 ${className}`;

    if (variant === "floating") {
        return (
            <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: index * 0.05,
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`${baseClasses} rounded-full bg-gray-600 hover:bg-gray-700 text-white`}
                title="复制链接"
            >
                <div className={`${iconSize} flex items-center justify-center`}>
                    {copied ? <Check /> : <Copy />}
                </div>
            </motion.button>
        );
    }

    if (variant === "compact") {
        return (
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{
                    scale: 1.03,
                    y: -1,
                    transition: { duration: 0.15, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className={`${baseClasses} rounded-lg shadow-sm hover:shadow-md ${copied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"
                    }`}
                title={copied ? "已复制！" : "复制链接"}
            >
                <div className={`${iconSize} flex items-center justify-center`}>
                    {copied ? <Check /> : <Copy />}
                </div>
            </motion.button>
        );
    }

    if (variant === "mobile") {
        return (
            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.6,
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClick}
                className="w-full flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                <div className="w-5 h-5 flex items-center justify-center">
                    {copied ? <Check /> : <Copy />}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {copied ? '已复制链接' : '复制链接'}
                </span>
            </motion.button>
        );
    }

    // default 和 minimal 变体
    const isMinimal = variant === "minimal";
    return (
        <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: index * 0.03,
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            whileHover={{
                scale: 1.03,
                y: -1,
                transition: { duration: 0.15, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${baseClasses} rounded-xl shadow-lg hover:shadow-xl ${isMinimal
                ? "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                : `border-2 border-white/20 ${copied ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-600 hover:bg-gray-700 text-white"
                }`
                }`}
            style={isMinimal ? {} : {
                boxShadow: copied
                    ? "0 4px 15px rgba(34, 197, 94, 0.3)"
                    : "0 4px 15px rgba(75, 85, 99, 0.3)"
            }}
            title={copied ? "已复制！" : "复制链接"}
        >
            <div className={`${iconSize} ${isMinimal ? "text-gray-600 dark:text-gray-300" : ""} flex items-center justify-center`}>
                {copied ? <Check /> : <Copy />}
            </div>
        </motion.button>
    );
}

// 加载占位符组件
function LoadingPlaceholder({ variant, size, className }: { variant: string; size: keyof typeof SIZE_CONFIG; className: string }) {
    const { button: buttonSize } = SIZE_CONFIG[size];

    if (variant === "mobile") {
        return (
            <div className={`w-full ${className}`}>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-blue-100 dark:border-gray-600">
                    <div className="text-center mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分享这篇文章</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col items-center p-3 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse">
                                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mb-2" />
                                <div className="w-8 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className={`flex items-center justify-center gap-2 ${className}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
            {variant === "default" && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    分享到：
                </span>
            )}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className={`${buttonSize} rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse`} />
                ))}
            </div>
        </div>
    );
}

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
    const [isMounted, setIsMounted] = useState(false);
    const [fullUrl, setFullUrl] = useState(url);

    // 从URL中提取slug用于统计
    const slug = url.startsWith('/blog/') ? url.replace('/blog/', '') : url;
    const { shareStats, trackShare, loading } = useShareTracking(slug);

    useEffect(() => {
        setIsMounted(true);
        if (!url.startsWith('http')) {
            setFullUrl(`${window.location.origin}${url}`);
        }
    }, [url]);

    const copyToClipboard = async () => {
        if (!isMounted) return;
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            await trackShare('copy', title, description);
            onShare?.('copy');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleShare = async (platform: SharePlatform) => {
        if (!isMounted) return;
        const platformKey = platform.name.toLowerCase();

        // 微信分享特殊处理
        if (platform.name === "微信") {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && navigator.share) {
                try {
                    await navigator.share({ title, text: description, url: fullUrl });
                    await trackShare(platformKey, title, description);
                    onShare?.(platformKey);
                } catch (error: any) {
                    if (error.name !== 'AbortError') {
                        console.error('微信分享失败:', error);
                        copyToClipboard();
                    }
                }
                return;
            } else {
                showWeChatQRCode(fullUrl, title);
                await trackShare(platformKey, title, description);
                onShare?.(platformKey);
                return;
            }
        }

        // QQ分享在移动端尝试原生分享
        if (platform.name === "QQ") {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            if (isMobile && navigator.share) {
                try {
                    await navigator.share({ title, text: description, url: fullUrl });
                    await trackShare(platformKey, title, description);
                    onShare?.(platformKey);
                    return;
                } catch (error: any) {
                    if (error.name === 'AbortError') return;
                }
            }
        }

        // 其他平台正常分享
        const shareUrl = platform.shareUrl(fullUrl, title, description, hashtags);
        window.open(shareUrl, '_blank', 'width=600,height=400');
        await trackShare(platformKey, title, description);
        onShare?.(platformKey);
    };

    const showWeChatQRCode = (url: string, title: string) => {
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-auto text-center shadow-2xl">
                <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">微信扫码分享</h3>
                <div class="bg-white p-4 rounded-xl mb-4 inline-block">
                    <img src="${qrCodeUrl}" alt="二维码" class="w-48 h-48 mx-auto" />
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-6">使用微信扫描二维码分享到朋友圈</p>
                <button class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">关闭</button>
            </div>
        `;
        const closeBtn = modal.querySelector('button');
        const closeModal = () => document.body.removeChild(modal);
        closeBtn?.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.body.appendChild(modal);
        setTimeout(closeModal, 10000);
    };

    if (!isMounted) {
        return <LoadingPlaceholder variant={variant} size={size} className={className} />;
    }

    // 浮动变体
    if (variant === "floating") {
        return (
            <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
                <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 space-y-2">
                    {SHARE_PLATFORMS.map((platform, index) => (
                        <ShareButton
                            key={platform.name}
                            platform={platform}
                            size={size}
                            variant={variant}
                            onClick={() => handleShare(platform)}
                            index={index}
                        />
                    ))}
                    <CopyButton
                        copied={copied}
                        size={size}
                        variant={variant}
                        onClick={copyToClipboard}
                        index={SHARE_PLATFORMS.length}
                    />
                </div>
            </div>
        );
    }

    // 移动端变体
    if (variant === "mobile") {
        return (
            <motion.div
                className={`w-full ${className}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 border border-blue-100 dark:border-gray-600">
                    <div className="text-center mb-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分享这篇文章</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {SHARE_PLATFORMS.map((platform, index) => (
                            <ShareButton
                                key={platform.name}
                                platform={platform}
                                size={size}
                                variant={variant}
                                onClick={() => handleShare(platform)}
                                index={index}
                            />
                        ))}
                    </div>
                    <CopyButton copied={copied} size={size} variant={variant} onClick={copyToClipboard} />
                    {showLabels && !loading && shareStats.total > 0 && (
                        <motion.div
                            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                已被分享 {shareStats.total} 次
                            </span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        );
    }

    // 紧凑变体
    if (variant === "compact") {
        return (
            <motion.div
                className={`flex items-center justify-center gap-2 ${className}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {SHARE_PLATFORMS.map((platform, index) => (
                    <ShareButton
                        key={platform.name}
                        platform={platform}
                        size="sm"
                        variant={variant}
                        onClick={() => handleShare(platform)}
                        index={index}
                    />
                ))}
                <CopyButton
                    copied={copied}
                    size="sm"
                    variant={variant}
                    onClick={copyToClipboard}
                    index={SHARE_PLATFORMS.length}
                />
                {showLabels && !loading && shareStats.total > 0 && (
                    <motion.div
                        className="ml-2 text-xs text-gray-500 dark:text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        {shareStats.total}
                    </motion.div>
                )}
            </motion.div>
        );
    }

    // 默认和最小变体
    return (
        <motion.div
            className={`flex items-center gap-3 ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {variant === "default" && (
                <motion.span
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    分享到：
                </motion.span>
            )}
            <div className="flex items-center gap-3">
                {SHARE_PLATFORMS.map((platform, index) => (
                    <ShareButton
                        key={platform.name}
                        platform={platform}
                        size={size}
                        variant={variant}
                        onClick={() => handleShare(platform)}
                        index={index}
                    />
                ))}
                <CopyButton
                    copied={copied}
                    size={size}
                    variant={variant}
                    onClick={copyToClipboard}
                    index={SHARE_PLATFORMS.length}
                />
            </div>
            {showLabels && !loading && shareStats.total > 0 && (
                <motion.div
                    className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <span className="font-medium">{shareStats.total}</span>
                </motion.div>
            )}
            {loading && showLabels && (
                <motion.div
                    className="flex items-center gap-2 text-xs text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span>...</span>
                </motion.div>
            )}
        </motion.div>
    );
}

// 分享统计Hook
export function useShareTracking(slug: string) {
    const [shareStats, setShareStats] = useState<{
        total: number;
        platforms: Record<string, number>;
        topPlatforms: Array<{ platform: string; count: number }>;
    }>({
        total: 0,
        platforms: {},
        topPlatforms: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/analytics/share?slug=${encodeURIComponent(slug)}`);
                const data = await response.json();
                if (data.success && data.stats) {
                    setShareStats({
                        total: data.stats.total || 0,
                        platforms: data.stats.platforms || {},
                        topPlatforms: data.stats.topPlatforms || [],
                    });
                }
            } catch (error) {
                console.error('Error fetching share stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [slug]);

    const trackShare = async (platform: string, title?: string, description?: string) => {
        try {
            const response = await fetch('/api/analytics/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    slug,
                    platform,
                    title,
                    description,
                    timestamp: new Date().toISOString(),
                }),
            });
            const data = await response.json();
            if (data.success && data.stats) {
                setShareStats({
                    total: data.stats.total || 0,
                    platforms: data.stats.platforms || {},
                    topPlatforms: data.stats.topPlatforms || [],
                });
            }
            return data.isNewShare;
        } catch (error) {
            console.error('Error tracking share:', error);
            return false;
        }
    };

    return { shareStats, trackShare, loading };
}

// 便捷的预设组件
export function BlogPostShare({
    slug,
    title,
    description,
    tags = [],
    className = "",
    showStats = false,
}: {
    slug: string;
    title: string;
    description?: string;
    tags?: string[];
    className?: string;
    showStats?: boolean;
}) {
    return (
        <SocialShare
            url={`/blog/${slug}`}
            title={title}
            description={description}
            hashtags={tags}
            className={className}
            showLabels={showStats}
            size="md"
            variant="default"
        />
    );
}