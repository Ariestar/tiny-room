"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { RefreshCw, Home, AlertTriangle, Coffee, Bug, Zap } from "lucide-react";

interface FunErrorPageProps {
    error?: Error;
    reset?: () => void;
    title?: string;
    message?: string;
    showRetry?: boolean;
    showHome?: boolean;
    variant?: "404" | "500" | "network" | "generic";
    className?: string;
}

const errorMessages = {
    "404": [
        "哎呀，这个页面好像去度假了... 🏖️",
        "404：页面不见了，可能被外星人带走了 👽",
        "这里什么都没有，就像我的钱包一样空 💸",
        "页面走丢了，正在寻找中... 🔍"
    ],
    "500": [
        "服务器罢工了，可能需要更多咖啡 ☕",
        "代码出了点小问题，程序员正在修复 🔧",
        "系统需要重启，就像周一的我一样 😴",
        "服务器累了，让它休息一下 💤"
    ],
    "network": [
        "网络连接有问题，检查一下网线吧 🌐",
        "信号不好，可能需要爬到屋顶 📡",
        "网络走神了，稍后再试 🔄",
        "连接中断，就像断了的耳机线 🎧"
    ],
    "generic": [
        "出了点小状况，但别担心 😊",
        "系统打了个嗝，马上就好 🤗",
        "遇到了意外情况，正在处理 ⚡",
        "有点小问题，但我们会解决的 💪"
    ]
};

const errorTips = [
    "试试刷新页面，有时候这样就好了",
    "检查网络连接是否正常",
    "清除浏览器缓存可能有帮助",
    "如果问题持续，请联系我们",
    "也许是时候喝杯咖啡休息一下了",
    "重启电脑，万能的解决方案"
];

export function FunErrorPage({
    error,
    reset,
    title,
    message,
    showRetry = true,
    showHome = true,
    variant = "generic",
    className = ""
}: FunErrorPageProps) {
    const [currentMessage, setCurrentMessage] = useState("");
    const [currentTip, setCurrentTip] = useState("");
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        // 随机选择错误消息
        const messages = errorMessages[variant];
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);

        // 随机选择提示
        setCurrentTip(errorTips[Math.floor(Math.random() * errorTips.length)]);
    }, [variant]);

    const handleRetry = () => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        if (reset) {
            reset();
        } else {
            window.location.reload();
        }
    };

    const getErrorIcon = () => {
        switch (variant) {
            case "404":
                return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
            case "500":
                return <Bug className="w-16 h-16 text-red-500" />;
            case "network":
                return <Zap className="w-16 h-16 text-blue-500" />;
            default:
                return <Coffee className="w-16 h-16 text-purple-500" />;
        }
    };

    const getErrorCode = () => {
        switch (variant) {
            case "404":
                return "404";
            case "500":
                return "500";
            case "network":
                return "网络错误";
            default:
                return "出错了";
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 ${className}`}>
            <div className="max-w-md w-full text-center">
                {/* 错误图标动画 */}
                <motion.div
                    className="mb-8"
                    animate={isShaking ? {
                        x: [-10, 10, -10, 10, 0],
                        rotate: [-5, 5, -5, 5, 0]
                    } : {
                        y: [0, -10, 0]
                    }}
                    transition={isShaking ? {
                        duration: 0.5
                    } : {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {getErrorIcon()}
                </motion.div>

                {/* 错误代码 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <h1 className="text-6xl font-bold text-gray-800 mb-2">
                        {getErrorCode()}
                    </h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {title || currentMessage}
                    </h2>
                </motion.div>

                {/* 错误描述 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8"
                >
                    <p className="text-gray-600 mb-4">
                        {message || "不用担心，这种事情偶尔会发生。"}
                    </p>

                    {/* 随机提示 */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-2">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">💡</span>
                            </div>
                            <p className="text-blue-700 text-sm">
                                <strong>小贴士：</strong> {currentTip}
                            </p>
                        </div>
                    </div>

                    {/* 错误详情（开发环境） */}
                    {process.env.NODE_ENV === 'development' && error && (
                        <details className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                            <summary className="cursor-pointer text-red-700 font-medium mb-2">
                                错误详情 (开发模式)
                            </summary>
                            <pre className="text-xs text-red-600 overflow-auto">
                                {error.message}
                                {error.stack && (
                                    <>
                                        <br />
                                        <br />
                                        {error.stack}
                                    </>
                                )}
                            </pre>
                        </details>
                    )}
                </motion.div>

                {/* 操作按钮 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-4"
                >
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {showRetry && (
                            <motion.button
                                onClick={handleRetry}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>重试</span>
                            </motion.button>
                        )}

                        {showHome && (
                            <motion.button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Home className="w-4 h-4" />
                                <span>回到首页</span>
                            </motion.button>
                        )}
                    </div>

                    {/* 联系信息 */}
                    <p className="text-sm text-gray-500">
                        如果问题持续存在，请{" "}
                        <a
                            href="mailto:hello@tinyroom.dev"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            联系我们
                        </a>
                    </p>
                </motion.div>

                {/* 装饰性元素 */}
                <motion.div
                    className="mt-12 flex justify-center space-x-4 opacity-30"
                    animate={{
                        y: [0, -5, 0]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <div className="w-2 h-2 bg-pink-400 rounded-full" />
                </motion.div>
            </div>
        </div>
    );
}

export default FunErrorPage;