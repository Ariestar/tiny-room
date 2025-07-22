"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComprehensivePerformance } from '@/hooks/usePerformanceMonitoring';
import {
    Activity,
    Zap,
    Clock,
    HardDrive,
    Wifi,
    AlertTriangle,
    CheckCircle,
    XCircle,
    BarChart3,
    Settings,
    X,
    RefreshCw
} from 'lucide-react';

interface PerformanceMonitorProps {
    enabled?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * 性能监控开发工具
 * 显示 Core Web Vitals 和其他性能指标
 */
export function PerformanceMonitor({
    enabled = process.env.NODE_ENV === 'development',
    position = 'bottom-left'
}: PerformanceMonitorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'vitals' | 'resources' | 'system' | 'budget'>('vitals');

    const {
        webVitals,
        performance,
        resources,
        memory,
        network,
        budget,
        overallScore,
        overallRating,
        recommendations,
        isHealthy
    } = useComprehensivePerformance();

    if (!enabled) return null;

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 50) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getRatingIcon = (rating: string) => {
        switch (rating) {
            case 'good':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'needs-improvement':
                return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
            case 'poor':
                return <XCircle className="w-4 h-4 text-red-400" />;
            default:
                return <Activity className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700 w-96 mb-4"
                    >
                        {/* 头部 */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                <span className="font-medium text-sm">性能监控</span>
                                <div className={`text-lg font-mono ${getScoreColor(overallScore)}`}>
                                    {overallScore}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {getRatingIcon(overallRating)}
                                <button
                                    onClick={() => window.location.reload()}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="刷新页面"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-700 rounded"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* 标签页 */}
                        <div className="flex border-b border-gray-700">
                            {[
                                { id: 'vitals', label: 'Core', icon: Zap },
                                { id: 'resources', label: '资源', icon: BarChart3 },
                                { id: 'system', label: '系统', icon: HardDrive },
                                { id: 'budget', label: '预算', icon: Settings }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white'
                                            : 'hover:bg-gray-700'
                                        }`}
                                >
                                    <tab.icon className="w-3 h-3" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* 内容区域 */}
                        <div className="p-4 max-h-80 overflow-y-auto">
                            {activeTab === 'vitals' && (
                                <WebVitalsTab webVitals={webVitals} />
                            )}
                            {activeTab === 'resources' && (
                                <ResourcesTab resources={resources} />
                            )}
                            {activeTab === 'system' && (
                                <SystemTab memory={memory} network={network} />
                            )}
                            {activeTab === 'budget' && (
                                <BudgetTab budget={budget} />
                            )}
                        </div>

                        {/* 建议 */}
                        {recommendations.length > 0 && (
                            <div className="border-t border-gray-700 p-3">
                                <div className="text-xs text-gray-400 mb-2">优化建议</div>
                                <div className="space-y-1">
                                    {recommendations.slice(0, 3).map((rec, index) => (
                                        <div key={index} className="text-xs text-yellow-300 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" />
                                            {rec}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 触发按钮 */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`backdrop-blur-sm text-white p-3 rounded-full shadow-lg border transition-colors ${isHealthy
                        ? 'bg-green-600/80 border-green-500 hover:bg-green-600/90'
                        : 'bg-red-600/80 border-red-500 hover:bg-red-600/90'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Activity className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-mono">
                    {overallScore}
                </span>
            </motion.button>
        </div>
    );
}

/**
 * Core Web Vitals 标签页
 */
function WebVitalsTab({ webVitals }: { webVitals: any }) {
    const vitalsConfig = {
        LCP: { name: 'Largest Contentful Paint', unit: 'ms', good: 2500, poor: 4000 },
        FID: { name: 'First Input Delay', unit: 'ms', good: 100, poor: 300 },
        CLS: { name: 'Cumulative Layout Shift', unit: '', good: 0.1, poor: 0.25 },
        FCP: { name: 'First Contentful Paint', unit: 'ms', good: 1800, poor: 3000 },
        TTFB: { name: 'Time to First Byte', unit: 'ms', good: 800, poor: 1800 }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${webVitals.isInitialized ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                <span>{webVitals.isInitialized ? '监控中' : '初始化中'}</span>
                <div className="ml-auto text-lg font-mono">
                    评分: <span className={
                        webVitals.score.score >= 80 ? 'text-green-400' :
                            webVitals.score.score >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }>{webVitals.score.score}</span>
                </div>
            </div>

            <div className="space-y-2">
                {Object.entries(vitalsConfig).map(([key, config]) => {
                    const metric = webVitals.metrics.find((m: any) => m.name === key);
                    const value = metric?.value;
                    const rating = metric?.rating;

                    return (
                        <div key={key} className="bg-gray-800 rounded p-3">
                            <div className="flex items-center justify-between mb-1">
                                <div className="text-xs text-gray-400">{key}</div>
                                <div className="flex items-center gap-1">
                                    {rating && (
                                        <div className={`w-2 h-2 rounded-full ${rating === 'good' ? 'bg-green-500' :
                                                rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`} />
                                    )}
                                    <span className="text-xs font-mono">
                                        {value ? `${Math.round(value)}${config.unit}` : '-'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">{config.name}</div>

                            {/* 进度条 */}
                            {value && (
                                <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${rating === 'good' ? 'bg-green-500' :
                                                rating === 'needs-improvement' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                        style={{
                                            width: `${Math.min(100, (value / config.poor) * 100)}%`
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/**
 * 资源标签页
 */
function ResourcesTab({ resources }: { resources: any }) {
    return (
        <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">JS 加载时间</div>
                    <div className="text-lg font-mono">
                        {resources.jsLoadTime ? `${Math.round(resources.jsLoadTime)}ms` : '-'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">CSS 加载时间</div>
                    <div className="text-lg font-mono">
                        {resources.cssLoadTime ? `${Math.round(resources.cssLoadTime)}ms` : '-'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">图片加载时间</div>
                    <div className="text-lg font-mono">
                        {resources.imageLoadTime ? `${Math.round(resources.imageLoadTime)}ms` : '-'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">总资源数</div>
                    <div className="text-lg font-mono">{resources.totalResources}</div>
                </div>
            </div>

            {resources.failedResources > 0 && (
                <div className="bg-red-900/50 border border-red-600 rounded p-2">
                    <div className="text-red-400 font-medium">⚠️ 资源加载失败</div>
                    <div className="text-red-300 text-xs mt-1">
                        {resources.failedResources} 个资源加载失败
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * 系统标签页
 */
function SystemTab({ memory, network }: { memory: any; network: any }) {
    return (
        <div className="space-y-3 text-xs">
            <div>
                <div className="text-gray-400 mb-2">内存使用</div>
                <div className="bg-gray-800 rounded p-3">
                    <div className="flex justify-between mb-2">
                        <span>已使用</span>
                        <span className="font-mono">{(memory.used / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>总计</span>
                        <span className="font-mono">{(memory.total / 1024 / 1024).toFixed(1)}MB</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>使用率</span>
                        <span className={`font-mono ${memory.usagePercentage > 80 ? 'text-red-400' :
                                memory.usagePercentage > 60 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                            {memory.usagePercentage.toFixed(1)}%
                        </span>
                    </div>

                    {/* 内存使用进度条 */}
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ${memory.usagePercentage > 80 ? 'bg-red-500' :
                                    memory.usagePercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                            style={{ width: `${memory.usagePercentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div>
                <div className="text-gray-400 mb-2">网络状态</div>
                <div className="bg-gray-800 rounded p-3 space-y-2">
                    <div className="flex justify-between">
                        <span>连接类型</span>
                        <span className={`font-mono uppercase ${network.effectiveType === '4g' ? 'text-green-400' :
                                network.effectiveType === '3g' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                            {network.effectiveType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>下行速度</span>
                        <span className="font-mono">{network.downlink}Mbps</span>
                    </div>
                    <div className="flex justify-between">
                        <span>延迟</span>
                        <span className="font-mono">{network.rtt}ms</span>
                    </div>
                    <div className="flex justify-between">
                        <span>数据节省</span>
                        <span className={`font-mono ${network.saveData ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                            {network.saveData ? '开启' : '关闭'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>在线状态</span>
                        <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${network.isOnline ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                            <span className="font-mono">
                                {network.isOnline ? '在线' : '离线'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 预算标签页
 */
function BudgetTab({ budget }: { budget: any }) {
    return (
        <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${budget.hasViolations ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                <span>{budget.hasViolations ? '超出预算' : '符合预算'}</span>
                <div className="ml-auto">
                    <span className="text-red-400">{budget.errorCount} 错误</span>
                    <span className="text-yellow-400 ml-2">{budget.warningCount} 警告</span>
                </div>
            </div>

            {budget.violations.length > 0 ? (
                <div className="space-y-2">
                    {budget.violations.map((violation: any, index: number) => (
                        <div key={index} className={`rounded p-2 border ${violation.severity === 'error'
                                ? 'bg-red-900/50 border-red-600'
                                : 'bg-yellow-900/50 border-yellow-600'
                            }`}>
                            <div className={`font-medium ${violation.severity === 'error' ? 'text-red-400' : 'text-yellow-400'
                                }`}>
                                {violation.metric}
                            </div>
                            <div className="text-xs mt-1">
                                实际: {Math.round(violation.actual)} / 预算: {Math.round(violation.budget)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-green-900/50 border border-green-600 rounded p-3 text-center">
                    <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-green-400 font-medium">所有指标符合预算</div>
                </div>
            )}
        </div>
    );
}