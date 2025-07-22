"use client";

import React, { useEffect, useState } from 'react';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';

interface PerformanceOptimizedWrapperProps {
    children: React.ReactNode;
    enableDebug?: boolean;
}

/**
 * 性能优化包装器组件
 * 为子组件提供动画性能监控和优化
 */
export function PerformanceOptimizedWrapper({
    children,
    enableDebug = process.env.NODE_ENV === 'development'
}: PerformanceOptimizedWrapperProps) {
    const { isMonitoring, currentMetrics } = useAnimationPerformance();

    // 检测用户动画偏好
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setIsReducedMotion(mediaQuery.matches);

            const handleChange = (e: MediaQueryListEvent) => {
                setIsReducedMotion(e.matches);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    const shouldAnimate = !isReducedMotion;
    const isPerformanceCritical = currentMetrics?.status === 'critical';
    const animationCount = 0; // 简化版本
    const performanceStatus = currentMetrics?.status || 'good';

    // 在开发环境下显示性能信息
    useEffect(() => {
        if (enableDebug) {
            console.log('🎬 Animation Performance Status:', {
                shouldAnimate,
                isReducedMotion,
                animationCount,
                performanceStatus,
                isPerformanceCritical
            });
        }
    }, [enableDebug, shouldAnimate, isReducedMotion, animationCount, performanceStatus, isPerformanceCritical]);

    // 如果性能严重影响，显示警告
    if (enableDebug && isPerformanceCritical) {
        return (
            <div className="relative">
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
                    ⚠️ Performance Critical: {animationCount} animations
                </div>
                {children}
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * 动画性能指示器组件
 * 用于开发环境下显示当前动画性能状态
 */
export function AnimationPerformanceIndicator() {
    // 简化版本，暂时不使用详细的动画计数
    const animationCount = 0;
    const performanceStatus = 'good';

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    const statusColors = {
        good: 'bg-green-500',
        warning: 'bg-yellow-500',
        critical: 'bg-red-500'
    };

    const statusColor = statusColors[performanceStatus as keyof typeof statusColors];

    return (
        <div className="fixed bottom-4 left-4 z-50 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono backdrop-blur-sm">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                <span>Animations: {animationCount}</span>
                <span className="text-gray-400">({performanceStatus})</span>
            </div>
        </div>
    );
}

/**
 * 条件渲染动画组件
 * 根据性能状态决定是否渲染动画
 */
export function ConditionalAnimation({
    children,
    fallback = null,
    priority = 'normal'
}: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    priority?: 'low' | 'normal' | 'high';
}) {
    const { currentMetrics } = useAnimationPerformance();

    // 检测用户动画偏好
    const [isReducedMotion, setIsReducedMotion] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            setIsReducedMotion(mediaQuery.matches);

            const handleChange = (e: MediaQueryListEvent) => {
                setIsReducedMotion(e.matches);
            };

            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, []);

    const shouldAnimate = !isReducedMotion;
    const isPerformanceCritical = currentMetrics?.status === 'critical';

    // 如果不应该动画，返回fallback
    if (!shouldAnimate) {
        return <>{fallback}</>;
    }

    // 如果性能严重且优先级不高，返回fallback
    if (isPerformanceCritical && priority === 'low') {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

// 默认导出
export default PerformanceOptimizedWrapper;