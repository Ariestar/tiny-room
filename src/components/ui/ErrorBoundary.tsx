"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle, Bug, Coffee } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    showDetails?: boolean;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * 带有幽默元素的错误边界组件
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // 在开发环境中记录错误
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return <ErrorFallback
                error={this.state.error}
                errorInfo={this.state.errorInfo}
                onRetry={this.handleRetry}
                onGoHome={this.handleGoHome}
                showDetails={this.props.showDetails}
            />;
        }

        return this.props.children;
    }
}

/**
 * 错误回退组件
 */
function ErrorFallback({
    error,
    errorInfo,
    onRetry,
    onGoHome,
    showDetails = false,
}: {
    error?: Error;
    errorInfo?: ErrorInfo;
    onRetry: () => void;
    onGoHome: () => void;
    showDetails?: boolean;
}) {
    const errorMessages = [
        "哎呀！代码出了点小状况 🐛",
        "看起来我们遇到了一个调皮的 Bug 🎭",
        "系统正在闹脾气，请稍等片刻 😅",
        "代码君暂时罢工了 🛠️",
        "出现了一个意想不到的情况 🤔",
    ];

    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];

    const funnyTips = [
        "试试刷新页面，有时候这样就能解决问题",
        "如果问题持续存在，可能是我的咖啡喝完了 ☕",
        "这个错误比我预期的更有创意",
        "别担心，这不是你的错，是我的代码太调皮了",
        "让我们重新开始，就像什么都没发生过一样",
    ];

    const randomTip = funnyTips[Math.floor(Math.random() * funnyTips.length)];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
            >
                {/* 错误图标动画 */}
                <motion.div
                    className="mb-6"
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                        <Bug className="w-10 h-10 text-white" />
                    </div>
                </motion.div>

                {/* 错误标题 */}
                <motion.h1
                    className="text-2xl font-bold text-gray-800 mb-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {randomMessage}
                </motion.h1>

                {/* 错误描述 */}
                <motion.p
                    className="text-gray-600 mb-6 leading-relaxed"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {randomTip}
                </motion.p>

                {/* 操作按钮 */}
                <motion.div
                    className="space-y-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <button
                        onClick={onRetry}
                        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>重试一下</span>
                    </button>

                    <button
                        onClick={onGoHome}
                        className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                    >
                        <Home className="w-4 h-4" />
                        <span>回到首页</span>
                    </button>
                </motion.div>

                {/* 错误详情（开发环境） */}
                {showDetails && error && (
                    <motion.details
                        className="mt-6 text-left"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>查看错误详情</span>
                        </summary>
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 overflow-auto max-h-40">
                            <div className="mb-2">
                                <strong>错误信息:</strong>
                                <div className="text-red-600">{error.message}</div>
                            </div>
                            {error.stack && (
                                <div>
                                    <strong>错误堆栈:</strong>
                                    <pre className="whitespace-pre-wrap text-xs mt-1">
                                        {error.stack}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </motion.details>
                )}

                {/* 装饰性元素 */}
                <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <Coffee className="w-4 h-4 text-white" />
                </motion.div>
            </motion.div>
        </div>
    );
}

/**
 * 简单的错误边界 Hook
 */
export function useErrorBoundary() {
    const [error, setError] = React.useState<Error | null>(null);

    const resetError = React.useCallback(() => {
        setError(null);
    }, []);

    const captureError = React.useCallback((error: Error) => {
        setError(error);
    }, []);

    React.useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return { captureError, resetError };
}

/**
 * 网络错误组件
 */
export function NetworkError({ onRetry }: { onRetry: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200"
        >
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                网络连接出现问题
            </h3>
            <p className="text-gray-600 mb-4">
                请检查您的网络连接，然后重试
            </p>
            <button
                onClick={onRetry}
                className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors mx-auto"
            >
                <RefreshCw className="w-4 h-4" />
                <span>重新加载</span>
            </button>
        </motion.div>
    );
}

export default ErrorBoundary;