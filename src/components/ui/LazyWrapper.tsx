"use client";

import { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// 加载骨架屏组件
const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 mb-4"></div>
        <div className="space-y-3">
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2"></div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-5/6"></div>
        </div>
    </div>
);

// 卡片骨架屏
const CardSkeleton = () => (
    <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6">
            <div className="bg-gray-300 dark:bg-gray-600 rounded h-6 w-3/4 mb-4"></div>
            <div className="space-y-2">
                <div className="bg-gray-300 dark:bg-gray-600 rounded h-4 w-full"></div>
                <div className="bg-gray-300 dark:bg-gray-600 rounded h-4 w-5/6"></div>
                <div className="bg-gray-300 dark:bg-gray-600 rounded h-4 w-4/6"></div>
            </div>
        </div>
    </div>
);

// 列表骨架屏
const ListSkeleton = () => (
    <div className="animate-pulse space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2"></div>
                </div>
            </div>
        ))}
    </div>
);

// 网格骨架屏
const GridSkeleton = ({ columns = 3 }: { columns?: number }) => (
    <div className={`animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

// 懒加载包装器
interface LazyWrapperProps {
    children: React.ReactNode;
    fallback?: React.ComponentType;
    className?: string;
    skeletonType?: 'default' | 'card' | 'list' | 'grid';
    gridColumns?: number;
    delay?: number;
}

export function LazyWrapper({
    children,
    fallback,
    className = "",
    skeletonType = 'default',
    gridColumns = 3,
    delay = 0
}: LazyWrapperProps) {
    const getFallbackComponent = () => {
        if (fallback) return <fallback />;

        switch (skeletonType) {
            case 'card':
                return <CardSkeleton />;
            case 'list':
                return <ListSkeleton />;
            case 'grid':
                return <GridSkeleton columns={gridColumns} />;
            default:
                return <LoadingSkeleton className={className} />;
        }
    };

    return (
        <Suspense fallback={getFallbackComponent()}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay }}
                className={className}
            >
                {children}
            </motion.div>
        </Suspense>
    );
}

// 懒加载组件工厂
export function createLazyComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    fallbackType: 'default' | 'card' | 'list' | 'grid' = 'default'
) {
    const LazyComponent = lazy(importFn);

    return function LazyComponentWrapper(props: React.ComponentProps<T>) {
        return (
            <LazyWrapper skeletonType={fallbackType}>
                <LazyComponent {...props} />
            </LazyWrapper>
        );
    };
}

// 预定义的懒加载组件
export const LazySmartRecommendations = createLazyComponent(
    () => import('@/components/feature/blog/SmartRecommendations'),
    'grid'
);

export const LazySocialShare = createLazyComponent(
    () => import('@/components/feature/blog/SocialShare'),
    'card'
);

export const LazyFAQ = createLazyComponent(
    () => import('@/components/feature/blog/FAQ'),
    'list'
);

export const LazyPerformanceMonitor = createLazyComponent(
    () => import('@/components/analytics/PerformanceMonitor'),
    'card'
);

export const LazySEOAnalyzer = createLazyComponent(
    () => import('@/components/seo/SEOAnalyzer'),
    'card'
);

// 条件懒加载 - 基于网络状况
export function ConditionalLazyWrapper({
    children,
    condition = true,
    ...props
}: LazyWrapperProps & { condition?: boolean }) {
    if (!condition) {
        return <>{children}</>;
    }

    return (
        <LazyWrapper {...props}>
            {children}
        </LazyWrapper>
    );
}

// 视口懒加载
export function ViewportLazyWrapper({
    children,
    rootMargin = "100px",
    threshold = 0.1,
    ...props
}: LazyWrapperProps & {
    rootMargin?: string;
    threshold?: number;
}) {
    return (
        <LazyWrapper {...props}>
            {children}
        </LazyWrapper>
    );
}