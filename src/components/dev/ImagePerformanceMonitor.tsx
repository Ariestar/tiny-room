"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useImagePerformance, useAdaptiveImageQuality, useImageFormatSupport } from '@/hooks/useImagePerformance';
import {
    BarChart3,
    Image as ImageIcon,
    Clock,
    HardDrive,
    Wifi,
    Settings,
    X,
    RefreshCw,
    Trash2
} from 'lucide-react';

interface ImagePerformanceMonitorProps {
    enabled?: boolean;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

/**
 * 图片性能监控开发工具
 * 仅在开发环境下显示
 */
export function ImagePerformanceMonitor({
    enabled = process.env.NODE_ENV === 'development',
    position = 'bottom-right'
}: ImagePerformanceMonitorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'stats' | 'network' | 'formats'>('stats');

    const {
        stats,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        clearStats,
        updateStats
    } = useImagePerformance();

    const {
        networkQuality,
        dataSaver,
        getOptimalQuality,
        shouldOptimize
    } = useAdaptiveImageQuality();

    const {
        supportedFormats,
        supportsWebP,
        supportsAVIF
    } = useImageFormatSupport();

    // 自动开始监控
    useEffect(() => {
        if (enabled) {
            startMonitoring();
        }
        return () => {
            if (enabled) {
                stopMonitoring();
            }
        };
    }, [enabled, startMonitoring, stopMonitoring]);

    if (!enabled) return null;

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50`}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-black/90 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700 w-80 mb-4"
                    >
                        {/* 头部 */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                <span className="font-medium text-sm">图片性能监控</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={updateStats}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="刷新数据"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={clearStats}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="清理数据"
                                >
                                    <Trash2 className="w-3 h-3" />
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
                                { id: 'stats', label: '统计', icon: BarChart3 },
                                { id: 'network', label: '网络', icon: Wifi },
                                { id: 'formats', label: '格式', icon: Settings }
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
                        <div className="p-4 max-h-64 overflow-y-auto">
                            {activeTab === 'stats' && (
                                <StatsTab stats={stats} isMonitoring={isMonitoring} />
                            )}
                            {activeTab === 'network' && (
                                <NetworkTab
                                    networkQuality={networkQuality}
                                    dataSaver={dataSaver}
                                    shouldOptimize={shouldOptimize}
                                    getOptimalQuality={getOptimalQuality}
                                />
                            )}
                            {activeTab === 'formats' && (
                                <FormatsTab
                                    supportedFormats={supportedFormats}
                                    supportsWebP={supportsWebP}
                                    supportsAVIF={supportsAVIF}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 触发按钮 */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={`bg-black/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg border border-gray-700 hover:bg-black/90 transition-colors ${isMonitoring ? 'ring-2 ring-green-500' : ''
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ImageIcon className="w-4 h-4" />
                {stats.totalImages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {stats.totalImages}
                    </span>
                )}
            </motion.button>
        </div>
    );
}

/**
 * 统计标签页
 */
function StatsTab({ stats, isMonitoring }: {
    stats: any;
    isMonitoring: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span>{isMonitoring ? '监控中' : '已停止'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">总图片数</div>
                    <div className="text-lg font-mono">{stats.totalImages}</div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">平均加载时间</div>
                    <div className="text-lg font-mono">
                        {stats.averageLoadTime ? `${stats.averageLoadTime.toFixed(0)}ms` : '-'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">总大小</div>
                    <div className="text-lg font-mono">
                        {stats.totalSize ? `${(stats.totalSize / 1024).toFixed(1)}KB` : '-'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">缓存命中率</div>
                    <div className="text-lg font-mono">
                        {stats.cacheHitRate ? `${(stats.cacheHitRate * 100).toFixed(0)}%` : '-'}
                    </div>
                </div>
            </div>

            {Object.keys(stats.formatDistribution).length > 0 && (
                <div>
                    <div className="text-xs text-gray-400 mb-2">格式分布</div>
                    <div className="space-y-1">
                        {Object.entries(stats.formatDistribution).map(([format, count]) => (
                            <div key={format} className="flex justify-between text-xs">
                                <span className="uppercase">{format}</span>
                                <span className="font-mono">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * 网络标签页
 */
function NetworkTab({
    networkQuality,
    dataSaver,
    shouldOptimize,
    getOptimalQuality
}: {
    networkQuality: 'slow' | 'fast';
    dataSaver: boolean;
    shouldOptimize: boolean;
    getOptimalQuality: (quality: number) => number;
}) {
    return (
        <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">网络质量</div>
                    <div className={`text-lg font-mono ${networkQuality === 'fast' ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                        {networkQuality === 'fast' ? '快速' : '慢速'}
                    </div>
                </div>

                <div className="bg-gray-800 rounded p-2">
                    <div className="text-gray-400">数据节省</div>
                    <div className={`text-lg font-mono ${dataSaver ? 'text-yellow-400' : 'text-green-400'
                        }`}>
                        {dataSaver ? '开启' : '关闭'}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 rounded p-3">
                <div className="text-gray-400 mb-2">质量优化</div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>基础质量 (85)</span>
                        <span className="font-mono">{getOptimalQuality(85)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>高质量 (95)</span>
                        <span className="font-mono">{getOptimalQuality(95)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>缩略图 (70)</span>
                        <span className="font-mono">{getOptimalQuality(70)}</span>
                    </div>
                </div>
            </div>

            {shouldOptimize && (
                <div className="bg-yellow-900/50 border border-yellow-600 rounded p-2">
                    <div className="text-yellow-400 font-medium">⚡ 性能优化已启用</div>
                    <div className="text-yellow-300 text-xs mt-1">
                        图片质量和尺寸已自动调整以适应当前网络条件
                    </div>
                </div>
            )}
        </div>
    );
}

/**
 * 格式标签页
 */
function FormatsTab({
    supportedFormats,
    supportsWebP,
    supportsAVIF
}: {
    supportedFormats: string[];
    supportsWebP: boolean;
    supportsAVIF: boolean;
}) {
    return (
        <div className="space-y-3 text-xs">
            <div>
                <div className="text-gray-400 mb-2">支持的格式</div>
                <div className="grid grid-cols-2 gap-2">
                    {supportedFormats.map(format => (
                        <div key={format} className="bg-gray-800 rounded p-2 text-center">
                            <div className="uppercase font-mono">{format}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-gray-400 mb-2">现代格式支持</div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span>WebP</span>
                        <div className={`w-2 h-2 rounded-full ${supportsWebP ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span>AVIF</span>
                        <div className={`w-2 h-2 rounded-full ${supportsAVIF ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                    </div>
                </div>
            </div>

            <div className="bg-blue-900/50 border border-blue-600 rounded p-2">
                <div className="text-blue-400 font-medium">💡 优化建议</div>
                <div className="text-blue-300 text-xs mt-1">
                    {supportsAVIF
                        ? 'AVIF 格式可提供最佳压缩效果'
                        : supportsWebP
                            ? 'WebP 格式可减少 25-35% 文件大小'
                            : '考虑升级浏览器以支持现代图片格式'
                    }
                </div>
            </div>
        </div>
    );
}

// 默认导出
export default ImagePerformanceMonitor;