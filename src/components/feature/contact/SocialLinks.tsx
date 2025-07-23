"use client";

import { motion } from "framer-motion";
import {
    Mail,
    Github,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    MessageCircle,
    Globe
} from "lucide-react";

interface SocialLinksProps {
    className?: string;
    layout?: "grid" | "horizontal" | "vertical";
    showLabels?: boolean;
    size?: "sm" | "md" | "lg";
}

// 社交媒体数据
const socialPlatforms = [
    {
        name: "邮箱",
        icon: Mail,
        url: "mailto:hello@tinyroom.dev",
        color: "text-red-500",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-500",
        animation: "bounce",
        description: "发送邮件"
    },
    {
        name: "GitHub",
        icon: Github,
        url: "https://github.com/tinyroom",
        color: "text-gray-800",
        bgColor: "bg-gray-50",
        hoverColor: "hover:bg-gray-800",
        animation: "rotate",
        description: "查看代码"
    },
    {
        name: "Twitter",
        icon: Twitter,
        url: "https://twitter.com/tinyroom",
        color: "text-blue-500",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-500",
        animation: "scale",
        description: "关注动态"
    },
    {
        name: "LinkedIn",
        icon: Linkedin,
        url: "https://linkedin.com/in/tinyroom",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        hoverColor: "hover:bg-blue-700",
        animation: "shake",
        description: "职业联系"
    },
    {
        name: "Instagram",
        icon: Instagram,
        url: "https://instagram.com/tinyroom",
        color: "text-pink-500",
        bgColor: "bg-pink-50",
        hoverColor: "hover:bg-pink-500",
        animation: "pulse",
        description: "生活分享"
    },
    {
        name: "YouTube",
        icon: Youtube,
        url: "https://youtube.com/@tinyroom",
        color: "text-red-600",
        bgColor: "bg-red-50",
        hoverColor: "hover:bg-red-600",
        animation: "swing",
        description: "视频内容"
    },
    {
        name: "微信",
        icon: MessageCircle,
        url: "#",
        color: "text-green-500",
        bgColor: "bg-green-50",
        hoverColor: "hover:bg-green-500",
        animation: "bounce",
        description: "扫码添加",
        isModal: true
    },
    {
        name: "个人网站",
        icon: Globe,
        url: "https://tinyroom.dev",
        color: "text-purple-500",
        bgColor: "bg-purple-50",
        hoverColor: "hover:bg-purple-500",
        animation: "rotate",
        description: "访问网站"
    }
];

// 动画变体
const animationVariants = {
    bounce: {
        hover: {
            y: [-2, -8, -2],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },
    rotate: {
        hover: {
            rotate: [0, 360],
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    },
    scale: {
        hover: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    },
    shake: {
        hover: {
            x: [-2, 2, -2, 2, 0],
            transition: {
                duration: 0.5,
                ease: "easeInOut"
            }
        }
    },
    pulse: {
        hover: {
            scale: [1, 1.1, 1, 1.1, 1],
            transition: {
                duration: 0.8,
                ease: "easeInOut"
            }
        }
    },
    swing: {
        hover: {
            rotate: [-5, 5, -5, 5, 0],
            transition: {
                duration: 0.6,
                ease: "easeInOut"
            }
        }
    }
};

export function SocialLinks({
    className = "",
    layout = "grid",
    showLabels = true,
    size = "md"
}: SocialLinksProps) {
    const sizeClasses = {
        sm: "w-10 h-10",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    };

    const iconSizes = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    const layoutClasses = {
        grid: "grid grid-cols-2 sm:grid-cols-4 gap-4",
        horizontal: "flex flex-wrap justify-center gap-4",
        vertical: "flex flex-col gap-4"
    };

    const handleSocialClick = (platform: typeof socialPlatforms[0]) => {
        if (platform.isModal) {
            // 显示微信二维码模态框
            alert("微信二维码功能待实现");
            return;
        }

        if (platform.url.startsWith('mailto:')) {
            window.location.href = platform.url;
        } else {
            window.open(platform.url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`${className}`}>
            <div className={layoutClasses[layout]}>
                {socialPlatforms.map((platform, index) => (
                    <motion.div
                        key={platform.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative"
                    >
                        <motion.button
                            onClick={() => handleSocialClick(platform)}
                            className={`
								${sizeClasses[size]} 
								${platform.bgColor} 
								${platform.hoverColor}
								rounded-xl flex items-center justify-center
								transition-all duration-300 ease-out
								hover:text-white hover:shadow-lg hover:shadow-current/25
								focus:outline-none focus:ring-2 focus:ring-current focus:ring-opacity-50
								relative overflow-hidden
							`}
                            variants={animationVariants[platform.animation as keyof typeof animationVariants]}
                            whileHover="hover"
                            whileTap={{ scale: 0.95 }}
                            aria-label={`${platform.description} - ${platform.name}`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleSocialClick(platform);
                                }
                            }}
                        >
                            {/* 背景渐变效果 */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />

                            {/* 图标 */}
                            <platform.icon className={`${iconSizes[size]} ${platform.color} group-hover:text-white transition-colors duration-300 relative z-10`} />

                            {/* 悬停时的光晕效果 */}
                            <motion.div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20"
                                style={{
                                    background: `radial-gradient(circle, ${platform.color.replace('text-', '').replace('-500', '').replace('-600', '').replace('-700', '').replace('-800', '')}, transparent 70%)`
                                }}
                                initial={{ scale: 0 }}
                                whileHover={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>

                        {/* 标签和描述 */}
                        {showLabels && (
                            <div className="text-center mt-2">
                                <div className="text-sm font-medium text-gray-700">
                                    {platform.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {platform.description}
                                </div>
                            </div>
                        )}

                        {/* 悬停提示 */}
                        <motion.div
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20"
                            initial={{ y: 10, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                        >
                            {platform.description}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            {/* 联系提示 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center mt-8"
            >
                <p className="text-gray-600 text-sm mb-2">
                    欢迎通过以上方式与我联系交流
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>通常在 24 小时内回复</span>
                </div>
            </motion.div>
        </div>
    );
}

// 默认导出
export default SocialLinks;