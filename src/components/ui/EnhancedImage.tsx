"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ImageOptimizationUtils,
    ResponsiveImageCalculator,
    AdaptiveQualityManager,
    ImageErrorHandler,
    ImagePerformanceMonitor
} from "@/lib/ui/images";
import { useAnimationPerformance } from "@/hooks/useAnimationPerformance";

interface EnhancedImageProps extends Omit<ImageProps, 'placeholder' | 'quality'> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    containerClassName?: string;

    // 加载状态
    showSkeleton?: boolean;
    skeletonClassName?: string;
    loadingAnimation?: 'fade' | 'blur' | 'scale' | 'none';

    // 图片优化
    enableWebP?: boolean;
    enableAVIF?: boolean;
    adaptiveQuality?: boolean;
    baseQuality?: number;

    // 懒加载
    enableLazyLoading?: boolean;
    lazyOffset?: string;

    // 响应式
    aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'auto';
    responsivePreset?: keyof typeof ResponsiveImageCalculator.presets;

    // 错误处理
    fallbackSrc?: string;
    fallbackSources?: string[];
    maxRetries?: number;

    // 性能监控
    enablePerformanceMonitoring?: boolean;

    // 回调
    onLoadStart?: () => void;
    onLoadComplete?: () => void;
    onError?: (error: Error) => void;
    onRetry?: (attempt: number) => void;
}

/**
 * 增强版图片组件
 * 集成了完整的图片优化功能
 */
export function EnhancedImage({
    src,
    alt,
    width,
    height,
    className = "",
    containerClassName = "",

    showSkeleton = true,
    skeletonClassName = "",
    loadingAnimation = 'fade',

    enableWebP = true,
    enableAVIF = true,
    adaptiveQuality = true,
    baseQuality = 85,

    enableLazyLoading = true,
    lazyOffset = '50px',

    aspectRatio = 'auto',
    responsivePreset,

    fallbackSrc,
    fallbackSources = [],
    maxRetries = 3,

    enablePerformanceMonitoring = process.env.NODE_ENV === 'development',

    onLoadStart,
    onLoadComplete,
    onError,
    onRetry,

    priority = false,
    sizes,
    ...props
}: EnhancedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isInView, setIsInView] = useState(!enableLazyLoading || priority);
    const [loadStartTime, setLoadStartTime] = useState<number>(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const { shouldAnimate, createOptimizedConfig } = useAnimationPerformance();

    // 获取优化的图片源
    const getOptimizedSrc = useCallback((originalSrc: string): string => {
        if (originalSrc.startsWith('http')) {
            return originalSrc; // 外部图片直接返回
        }

        // 本地图片格式优化
        let optimizedSrc = originalSrc;

        if (enableAVIF && ImageOptimizationUtils.formatOptimizer.supportsFormat('avif')) {
            optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
        } else if (enableWebP && ImageOptimizationUtils.formatOptimizer.supportsFormat('webp')) {
            optimizedSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        }

        return optimizedSrc;
    }, [enableWebP, enableAVIF]);

    // 获取自适应质量
    const getAdaptiveQuality = useCallback((): number => {
        if (!adaptiveQuality) return baseQuality;
        return AdaptiveQualityManager.getRecommendedQuality(baseQuality);
    }, [adaptiveQuality, baseQuality]);

    // 获取响应式 sizes
    const getResponsiveSizes = useCallback((): string => {
        if (sizes) return sizes;
        if (responsivePreset) {
            return ResponsiveImageCalculator.presets[responsivePreset];
        }

        // 根据宽高比生成默认 sizes
        switch (aspectRatio) {
            case 'square':
                return ResponsiveImageCalculator.presets.card;
            case '16:9':
                return ResponsiveImageCalculator.presets.hero;
            default:
                return ResponsiveImageCalculator.presets.card;
        }
    }, [sizes, responsivePreset, aspectRatio]);

    // 懒加载观察器
    useEffect(() => {
        if (!enableLazyLoading || priority || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: lazyOffset,
                threshold: 0.1
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [enableLazyLoading, priority, isInView, lazyOffset]);

    // 处理图片加载开始
    const handleLoadStart = useCallback(() => {
        setLoadStartTime(performance.now());
        onLoadStart?.();
    }, [onLoadStart]);

    // 处理图片加载完成
    const handleLoadComplete = useCallback(() => {
        setIsLoading(false);

        if (enablePerformanceMonitoring && loadStartTime > 0) {
            ImagePerformanceMonitor.recordLoad(
                currentSrc,
                loadStartTime,
                undefined, // 文件大小需要额外获取
                getOptimizedSrc(currentSrc).split('.').pop(),
                false // 缓存状态需要额外检测
            );
        }

        onLoadComplete?.();
    }, [currentSrc, loadStartTime, enablePerformanceMonitoring, getOptimizedSrc, onLoadComplete]);

    // 处理图片加载错误
    const handleError = useCallback(async () => {
        setHasError(true);
        setIsLoading(false);

        try {
            const allFallbacks = fallbackSrc ? [fallbackSrc, ...fallbackSources] : fallbackSources;
            const newSrc = await ImageErrorHandler.handleError(currentSrc, allFallbacks, onRetry);

            if (newSrc && newSrc !== currentSrc) {
                setCurrentSrc(newSrc);
                setHasError(false);
                setIsLoading(true);
                return;
            }
        } catch (error) {
            onError?.(error as Error);
        }

        onError?.(new Error(`Failed to load image: ${currentSrc}`));
    }, [currentSrc, fallbackSrc, fallbackSources, onError, onRetry]);

    // 重试加载
    const handleRetry = useCallback(() => {
        ImageErrorHandler.resetRetries(currentSrc);
        setHasError(false);
        setIsLoading(true);
        setCurrentSrc(src);
    }, [currentSrc, src]);

    // 获取宽高比样式
    const getAspectRatioClass = useCallback(() => {
        switch (aspectRatio) {
            case 'square':
                return 'aspect-square';
            case '16:9':
                return 'aspect-video';
            case '4:3':
                return 'aspect-[4/3]';
            case '3:2':
                return 'aspect-[3/2]';
            default:
                return '';
        }
    }, [aspectRatio]);

    // 动画变体
    const animationVariants = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        blur: {
            initial: { opacity: 0, filter: 'blur(10px)' },
            animate: { opacity: 1, filter: 'blur(0px)' },
            exit: { opacity: 0, filter: 'blur(10px)' }
        },
        scale: {
            initial: { opacity: 0, scale: 1.1 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 }
        },
        none: {
            initial: {},
            animate: {},
            exit: {}
        }
    };

    const currentVariant = shouldAnimate ? animationVariants[loadingAnimation] : animationVariants.none;
    const aspectRatioClass = getAspectRatioClass();

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${aspectRatioClass} ${containerClassName}`}
        >
            <AnimatePresence mode="wait">
                {!isInView ? (
                    // 懒加载占位符
                    <motion.div
                        key="lazy-placeholder"
                        className={`absolute inset-0 ${aspectRatioClass}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={createOptimizedConfig({ duration: 0.3 })}
                    >
                        {showSkeleton ? (
                            <Skeleton className={`w-full h-full ${skeletonClassName}`} />
                        ) : (
                            <PlaceholderContent className="w-full h-full" />
                        )}
                    </motion.div>
                ) : hasError ? (
                    // 错误状态
                    <motion.div
                        key="error"
                        className={`absolute inset-0 ${aspectRatioClass}`}
                        {...currentVariant}
                        transition={createOptimizedConfig({ duration: 0.3 })}
                    >
                        <ErrorContent
                            onRetry={handleRetry}
                            className="w-full h-full"
                        />
                    </motion.div>
                ) : (
                    // 图片内容
                    <motion.div
                        key="image"
                        className="relative w-full h-full"
                        {...currentVariant}
                        transition={createOptimizedConfig({ duration: 0.5 })}
                    >
                        {/* 加载状态覆盖层 */}
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div
                                    className={`absolute inset-0 z-10 ${aspectRatioClass}`}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={createOptimizedConfig({ duration: 0.3 })}
                                >
                                    {showSkeleton ? (
                                        <Skeleton className={`w-full h-full ${skeletonClassName}`} />
                                    ) : (
                                        <PlaceholderContent className="w-full h-full" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 实际图片 */}
                        <Image
                            src={getOptimizedSrc(currentSrc)}
                            alt={alt}
                            width={width}
                            height={height}
                            className={`${className} transition-opacity duration-300`}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                            sizes={getResponsiveSizes()}
                            quality={getAdaptiveQuality()}
                            priority={priority}
                            onLoadingComplete={handleLoadComplete}
                            onLoad={handleLoadStart}
                            onError={handleError}
                            {...props}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * 占位符内容组件
 */
function PlaceholderContent({ className = "" }: { className?: string }) {
    const [emoji, setEmoji] = useState('🖼️');
    const emojis = ['🖼️', '📸', '🎨', '🌈', '✨', '🎭', '🎪'];

    useEffect(() => {
        const interval = setInterval(() => {
            setEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${className}`}>
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-4xl mb-2"
            >
                {emoji}
            </motion.div>
            <div className="text-sm text-gray-500 font-medium">加载中...</div>
        </div>
    );
}

/**
 * 错误内容组件
 */
function ErrorContent({
    onRetry,
    className = ""
}: {
    onRetry?: () => void;
    className?: string;
}) {
    return (
        <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 ${className}`}>
            <div className="text-3xl mb-2">😔</div>
            <div className="text-sm text-red-600 font-medium mb-2">图片加载失败</div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-xs px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                    重试
                </button>
            )}
        </div>
    );
}

// 预设配置的图片组件
export const EnhancedAvatarImage = (props: Omit<EnhancedImageProps, 'aspectRatio' | 'responsivePreset'>) => (
    <EnhancedImage
        {...props}
        aspectRatio="square"
        responsivePreset="avatar"
        className={`rounded-full ${props.className || ''}`}
    />
);

export const EnhancedCardImage = (props: Omit<EnhancedImageProps, 'aspectRatio' | 'responsivePreset'>) => (
    <EnhancedImage
        {...props}
        aspectRatio="16:9"
        responsivePreset="card"
        className={`rounded-lg ${props.className || ''}`}
    />
);

export const EnhancedHeroImage = (props: Omit<EnhancedImageProps, 'aspectRatio' | 'responsivePreset' | 'priority'>) => (
    <EnhancedImage
        {...props}
        aspectRatio="16:9"
        responsivePreset="hero"
        priority={true}
        baseQuality={90}
        className={`rounded-xl ${props.className || ''}`}
    />
);

export const EnhancedGalleryImage = (props: Omit<EnhancedImageProps, 'enableLazyLoading' | 'loadingAnimation'>) => (
    <EnhancedImage
        {...props}
        enableLazyLoading={true}
        loadingAnimation="blur"
        responsivePreset="gallery"
        baseQuality={80}
        className={`rounded-lg hover:scale-105 transition-transform duration-300 ${props.className || ''}`}
    />
);