"use client";

import { lazy, Suspense, ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// 懒加载组件的配置选项
interface LazyComponentOptions {
    fallback?: ReactNode;
    errorFallback?: ReactNode;
    delay?: number;
    retryCount?: number;
    preload?: boolean;
}

// 创建懒加载组件的工具函数
export function createLazyComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    options: LazyComponentOptions = {}
) {
    const {
        fallback = <LazyLoadingSkeleton />,
        errorFallback = <LazyErrorFallback />,
        delay = 0,
        retryCount = 3,
        preload = false
    } = options;

    // 创建懒加载组件
    const LazyComponent = lazy(() => {
        // 添加延迟（用于测试或特殊需求）
        if (delay > 0) {
            return new Promise(resolve => {
                setTimeout(() => {
                    importFn().then(resolve);
                }, delay);
            });
        }

        // 添加重试机制
        let attempts = 0;
        const loadWithRetry = async (): Promise<{ default: T }> => {
            try {
                return await importFn();
            } catch (error) {
                attempts++;
                if (attempts < retryCount) {
                    console.warn(`Failed to load component, retrying... (${attempts}/${retryCount})`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
                    return loadWithRetry();
                }
                throw error;
            }
        };

        return loadWithRetry();
    });

    // 预加载功能
    if (preload && typeof window !== 'undefined') {
        // 在空闲时间预加载
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                importFn().catch(() => {
                    // 预加载失败不影响正常使用
                });
            });
        } else {
            // 回退到 setTimeout
            setTimeout(() => {
                importFn().catch(() => { });
            }, 100);
        }
    }

    // 返回包装后的组件
    return function WrappedLazyComponent(props: any) {
        return (
            <LazyErrorBoundary fallback={errorFallback}>
                <Suspense fallback={fallback}>
                    <LazyComponent {...props} />
                </Suspense>
            </LazyErrorBoundary>
        );
    };
}

// 默认加载骨架屏
const LazyLoadingSkeleton = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 p-4"
    >
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full" />
    </motion.div>
);

// 默认错误回退组件
const LazyErrorFallback = () => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-8 text-center"
    >
        <div className="text-4xl mb-4">😔</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
            组件加载失败
        </h3>
        <p className="text-gray-600 mb-4">
            抱歉，这个组件暂时无法加载。请刷新页面重试。
        </p>
        <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            刷新页面
        </button>
    </motion.div>
);

// 错误边界组件
class LazyErrorBoundary extends React.Component<
    { children: ReactNode; fallback: ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: ReactNode; fallback: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Lazy component error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

// 预定义的懒加载组件类型
export const LazyComponentTypes = {
    // 重型图表组件
    Chart: () => createLazyComponent(
        () => import('@/components/charts/Chart'),
        {
            fallback: <ChartSkeleton />,
            preload: false
        }
    ),

    // 代码编辑器
    CodeEditor: () => createLazyComponent(
        () => import('@/components/editor/CodeEditor'),
        {
            fallback: <EditorSkeleton />,
            preload: false
        }
    ),

    // 图片画廊
    ImageGallery: () => createLazyComponent(
        () => import('@/components/gallery/ImageGallery'),
        {
            fallback: <GallerySkeleton />,
            preload: true // 画廊可能会被频繁访问
        }
    ),

    // 评论系统
    Comments: () => createLazyComponent(
        () => import('@/components/comments/Comments'),
        {
            fallback: <CommentsSkeleton />,
            preload: false
        }
    )
};

// 专用骨架屏组件
const ChartSkeleton = () => (
    <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-64 w-full" />
        <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
        </div>
    </div>
);

const EditorSkeleton = () => (
    <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-2 border-b">
            <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
            </div>
        </div>
        <Skeleton className="h-96 w-full rounded-none" />
    </div>
);

const GallerySkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square" />
        ))}
    </div>
);

const CommentsSkeleton = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        ))}
    </div>
);

// 路由级别的代码分割
export const createLazyPage = (
    importFn: () => Promise<{ default: ComponentType<any> }>,
    pageName: string
) => {
    return createLazyComponent(importFn, {
        fallback: <PageSkeleton pageName={pageName} />,
        errorFallback: <PageErrorFallback pageName={pageName} />,
        retryCount: 2
    });
};

const PageSkeleton = ({ pageName }: { pageName: string }) => (
    <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                            <Skeleton className="h-48 w-full mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
);

const PageErrorFallback = ({ pageName }: { pageName: string }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8"
        >
            <div className="text-6xl mb-6">😔</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {pageName} 页面加载失败
            </h1>
            <p className="text-gray-600 mb-6 max-w-md">
                抱歉，{pageName} 页面暂时无法加载。这可能是网络问题或服务器错误。
            </p>
            <div className="space-x-4">
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    刷新页面
                </button>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    返回上页
                </button>
            </div>
        </motion.div>
    </div>
);

// 组件预加载工具
export const preloadComponent = (importFn: () => Promise<any>) => {
    if (typeof window === 'undefined') return;

    // 在空闲时间预加载
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            importFn().catch(() => { });
        });
    } else {
        setTimeout(() => {
            importFn().catch(() => { });
        }, 100);
    }
};

// 批量预加载组件
export const preloadComponents = (importFns: (() => Promise<any>)[]) => {
    importFns.forEach(importFn => {
        preloadComponent(importFn);
    });
};

// 智能预加载（基于用户行为）
export const smartPreload = {
    // 鼠标悬停时预加载
    onHover: (importFn: () => Promise<any>) => {
        let hasPreloaded = false;

        return {
            onMouseEnter: () => {
                if (!hasPreloaded) {
                    hasPreloaded = true;
                    preloadComponent(importFn);
                }
            }
        };
    },

    // 滚动到视口时预加载
    onIntersection: (importFn: () => Promise<any>, threshold = 0.1) => {
        if (typeof window === 'undefined') return {};

        let hasPreloaded = false;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasPreloaded) {
                    hasPreloaded = true;
                    preloadComponent(importFn);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        return {
            ref: (element: HTMLElement | null) => {
                if (element) {
                    observer.observe(element);
                }
            }
        };
    },

    // 延迟预加载
    delayed: (importFn: () => Promise<any>, delay = 2000) => {
        setTimeout(() => {
            preloadComponent(importFn);
        }, delay);
    }
};