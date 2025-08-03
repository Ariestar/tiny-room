"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { initWebVitalsMonitoring, getAllWebVitals, getPerformanceScore } from "@/lib/analytics/webVitals";

interface PerformanceMetrics {
    cls: number;
    fid: number;
    fcp: number;
    lcp: number;
    ttfb: number;
    score: number;
}

interface PerformanceMonitorProps {
    className?: string;
    showDetails?: boolean;
    enableAutoReport?: boolean;
    reportInterval?: number;
}

// 性能评级颜色
const getRatingColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 50) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
};

// 指标阈值和颜色
const getMetricColor = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 },
        fcp: { good: 1800, poor: 3000 },
        ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return "text-gray-600";

    if (value <= threshold.good) return "text-green-600";
    if (value <= threshold.poor) return "text-yellow-600";
    return "text-red-600";
};

// 格式化指标值
const formatMetricValue = (metric: string, value: number) => {
    switch (metric) {
        case 'cls':
            return value.toFixed(3);
        case 'fid':
        case 'fcp':
        case 'lcp':
        case 'ttfb':
            return `${Math.round(value)}ms`;
        default:
            return value.toString();
    }
};

export function PerformanceMonitor({
    className = "",
    showDetails = true,
    enableAutoReport = true,
    reportInterval = 30000,
}: PerformanceMonitorProps) {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 初始化Web Vitals监控
        const monitor = initWebVitalsMonitoring({
            enableAutoReport,
            reportInterval,
            enableConsoleLog: process.env.NODE_ENV === 'development',
        });

        // 获取初始指标
        const loadMetrics = async () => {
            try {
                const vitals = await getAllWebVitals();
                const score = getPerformanceScore(vitals);
                setMetrics({
                    ...vitals,
                    score,
                });
            } catch (error) {
                console.error('Failed to load performance metrics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // 延迟加载以避免影响页面性能
        const timer = setTimeout(loadMetrics, 2000);

        return () => {
            clearTimeout(timer);
            monitor?.destroy();
        };
    }, [enableAutoReport, reportInterval]);

    // 切换显示状态
    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    if (isLoading) {
        return (
            <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="animate-pulse flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!metrics) return null;

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                {/* 性能评分显示 */}
                <button
                    onClick={toggleVisibility}
                    className={`flex items-center gap-2 p-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${getRatingColor(metrics.score)}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${metrics.score >= 90 ? 'bg-green-500' :
                                metrics.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                        <span className="text-sm font-medium">
                            性能评分: {metrics.score}
                        </span>
                    </div>
                    <svg
                        className={`w-4 h-4 transition-transform ${isVisible ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* 详细指标 */}
                {isVisible && showDetails && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                    >
                        <div className="p-3 space-y-2">
                            {Object.entries(metrics).map(([key, value]) => {
                                if (key === 'score') return null;

                                return (
                                    <div key={key} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600 dark:text-gray-400 uppercase">
                                            {key}
                                        </span>
                                        <span className={getMetricColor(key, value)}>
                                            {formatMetricValue(key, value)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 性能建议 */}
                        <div className="px-3 pb-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {metrics.score >= 90 && "🎉 性能表现优秀！"}
                                {metrics.score >= 50 && metrics.score < 90 && "⚠️ 性能有待优化"}
                                {metrics.score < 50 && "🚨 性能需要改进"}
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

// 简化版性能指示器
export function PerformanceIndicator({ className = "" }: { className?: string }) {
    return (
        <PerformanceMonitor
            className={className}
            showDetails={false}
            enableAutoReport={true}
            reportInterval={60000}
        />
    );
}