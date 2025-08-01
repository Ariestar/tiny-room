"use client";

import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAnimationPerformance } from '@/hooks/useAnimationPerformance';

interface DynamicLoaderProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    className?: string;
    enableAnimation?: boolean;
}

/**
 * 动态加载包装器
 * 为懒加载组件提供加载状态和错误边界
 */
export function DynamicLoader({
    children,
    fallback,
    className = "",
    enableAnimation = true
}: DynamicLoaderProps) {
    const { currentMetrics } = useAnimationPerformance();

    // 检测用户动画偏好
    const [isReducedMotion, setIsReducedMotion] = React.useState(false);

    React.useEffect(() => {
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
    const createOptimizedConfig = (config: any) => ({
        ...config,
        duration: isReducedMotion ? 0.1 : config.duration
    });

    const defaultFallback = (
        <div className={`animate-pulse ${className}`}>
            <Skeleton className="w-full h-32" />
        </div>
    );

    const loadingContent = fallback || defaultFallback;

    if (!shouldAnimate || !enableAnimation) {
        return (
            <Suspense fallback={loadingContent}>
                {children}
            </Suspense>
        );
    }

    return (
        <Suspense fallback={loadingContent}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={createOptimizedConfig({ duration: 0.5 })}
                className={className}
            >
                {children}
            </motion.div>
        </Suspense>
    );
}

/**
 * 创建动态导入的组件
 */
export function createDynamicComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    options: {
        fallback?: React.ReactNode;
        className?: string;
        enableAnimation?: boolean;
        ssr?: boolean;
    } = {}
) {
    const {
        fallback,
        className = "",
        enableAnimation = true,
        ssr = false
    } = options;

    const LazyComponent = lazy(importFn);

    return function DynamicComponent(props: React.ComponentProps<T>) {
        // 如果禁用 SSR，在客户端渲染
        if (!ssr && typeof window === 'undefined') {
            return fallback || <Skeleton className={`w-full h-32 ${className}`} />;
        }

        return (
            <DynamicLoader
                fallback={fallback}
                className={className}
                enableAnimation={enableAnimation}
            >
                <LazyComponent {...props} />
            </DynamicLoader>
        );
    };
}

/**
 * 预设的动态组件加载器
 */
export const DynamicComponents = {
    // 动画组件 - 非关键路径
    MouseFollowParticles: createDynamicComponent(
        () => import('@/components/animation/MouseFollowParticles'),
        {
            fallback: <div className="absolute inset-0" />,
            enableAnimation: true,
            ssr: false
        }
    ),

    AnimatedGradient: createDynamicComponent(
        () => import('@/components/animation/AnimatedGradient'),
        {
            fallback: <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/10" />,
            enableAnimation: true,
            ssr: false
        }
    ),

    InteractiveElements: createDynamicComponent(
        () => import('@/components/animation/InteractiveElements'),
        {
            fallback: <div className="absolute inset-0" />,
            enableAnimation: true,
            ssr: false
        }
    ),

    // 功能组件 - 可延迟加载
    GalleryPreview: createDynamicComponent(
        () => import('@/components/feature/gallery/GalleryPreview'),
        {
            fallback: <Skeleton className="w-full h-64" />,
            className: "w-full",
            ssr: true
        }
    ),

    ProjectShowcase: createDynamicComponent(
        () => import('@/components/feature/projects/ProjectShowcase'),
        {
            fallback: <Skeleton className="w-full h-48" />,
            className: "w-full",
            ssr: true
        }
    ),

    PersonalIntro: createDynamicComponent(
        () => import('@/components/feature/personal/PersonalIntro'),
        {
            fallback: <Skeleton className="w-full h-40" />,
            className: "w-full",
            ssr: true
        }
    ),

    // 联系组件 - 低优先级
    SocialLinks: createDynamicComponent(
        () => import('@/components/feature/contact/SocialLinks'),
        {
            fallback: <Skeleton className="w-full h-16" />,
            ssr: false
        }
    ),

    ContactInfo: createDynamicComponent(
        () => import('@/components/feature/contact/ContactInfo'),
        {
            fallback: <Skeleton className="w-full h-24" />,
            ssr: false
        }
    ),

    InteractiveEasterEggs: createDynamicComponent(
        () => import('@/components/feature/contact/InteractiveEasterEggs'),
        {
            fallback: <div className="w-full h-16" />,
            ssr: false
        }
    ),

    // 开发工具 - 仅开发环境
    ImagePerformanceMonitor: createDynamicComponent(
        () => import('@/components/dev/ImagePerformanceMonitor'),
        {
            fallback: null,
            ssr: false
        }
    ),

    PerformanceOptimizedWrapper: createDynamicComponent(
        () => import('@/components/animation/PerformanceOptimizedWrapper'),
        {
            fallback: <div />,
            ssr: false
        }
    )
};

/**
 * 智能组件加载器
 * 根据网络条件和设备性能决定加载策略
 */
export function SmartLoader({
    component: Component,
    fallback,
    priority = 'normal',
    className = ""
}: {
    component: ComponentType<any>;
    fallback?: React.ReactNode;
    priority?: 'high' | 'normal' | 'low';
    className?: string;
}) {
    const [shouldLoad, setShouldLoad] = React.useState(priority === 'high');

    React.useEffect(() => {
        if (priority === 'high') return;

        // 检测网络条件
        const connection = (navigator as any).connection;
        const isSlowNetwork = connection &&
            ['slow-2g', '2g', '3g'].includes(connection.effectiveType);

        // 检测设备性能
        const isLowEndDevice = navigator.hardwareConcurrency <= 2;

        if (priority === 'low' && (isSlowNetwork || isLowEndDevice)) {
            // 低优先级组件在慢网络或低端设备上延迟加载
            const timer = setTimeout(() => setShouldLoad(true), 2000);
            return () => clearTimeout(timer);
        } else {
            setShouldLoad(true);
        }
    }, [priority]);

    if (!shouldLoad) {
        return fallback || <Skeleton className={`w-full h-32 ${className}`} />;
    }

    return (
        <DynamicLoader fallback={fallback} className={className}>
            <Component />
        </DynamicLoader>
    );
}

/**
 * 预加载关键组件
 */
export function preloadCriticalComponents() {
    // 预加载关键组件
    const criticalComponents = [
        () => import('@/components/feature/blog/BlogPreview'),
        () => import('@/components/feature/projects/ProjectShowcase'),
        () => import('@/components/feature/personal/PersonalIntro')
    ];

    criticalComponents.forEach(importFn => {
        importFn().catch(error => {
            console.warn('Failed to preload component:', error);
        });
    });
}

/**
 * 组件预加载 Hook
 */
export function useComponentPreloader() {
    const [preloadedComponents, setPreloadedComponents] = React.useState<Set<string>>(new Set());

    const preloadComponent = React.useCallback(async (
        name: string,
        importFn: () => Promise<any>
    ) => {
        if (preloadedComponents.has(name)) return;

        try {
            await importFn();
            setPreloadedComponents(prev => new Set([...prev, name]));
        } catch (error) {
            console.warn(`Failed to preload component ${name}:`, error);
        }
    }, [preloadedComponents]);

    const isPreloaded = React.useCallback((name: string) => {
        return preloadedComponents.has(name);
    }, [preloadedComponents]);

    return {
        preloadComponent,
        isPreloaded,
        preloadedCount: preloadedComponents.size
    };
}