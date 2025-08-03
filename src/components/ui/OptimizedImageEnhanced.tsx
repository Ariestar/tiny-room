"use client";

import { useState, useRef, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

// 智能alt标签生成
function generateSmartAlt(src: string, context?: string, imageType?: string): string {
    // 从文件名提取信息
    const filename = src.split('/').pop()?.split('.')[0] || '';
    const cleanFilename = filename
        .replace(/[-_]/g, ' ')
        .replace(/\d+/g, '')
        .trim();

    // 根据图片类型生成描述
    const typeDescriptions: Record<string, string> = {
        photograph: '照片',
        illustration: '插图',
        diagram: '图表',
        screenshot: '截图',
        logo: '标志',
        icon: '图标',
    };

    const typeDesc = imageType ? typeDescriptions[imageType] || '' : '';

    // 组合生成alt标签
    let altText = '';

    if (context) {
        altText = context;
        if (typeDesc) altText += ` - ${typeDesc}`;
        if (cleanFilename) altText += ` (${cleanFilename})`;
    } else if (cleanFilename) {
        altText = cleanFilename;
        if (typeDesc) altText += ` - ${typeDesc}`;
    } else {
        altText = typeDesc || '图片';
    }

    return altText.charAt(0).toUpperCase() + altText.slice(1);
}

// 生成图片结构化数据
function generateImageStructuredData({
    src,
    alt,
    width,
    height,
    author,
    license,
    location,
    keywords,
    caption,
    imageType,
}: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    author?: string;
    license?: string;
    location?: string;
    keywords?: string[];
    caption?: string;
    imageType?: string;
}) {
    if (typeof window === 'undefined') return null;

    const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ImageObject",
        "url": fullUrl,
        "name": alt,
        "description": caption || alt,
        ...(width && { "width": width }),
        ...(height && { "height": height }),
        ...(author && {
            "author": {
                "@type": "Person",
                "name": author
            }
        }),
        ...(license && { "license": license }),
        ...(location && {
            "contentLocation": {
                "@type": "Place",
                "name": location
            }
        }),
        ...(keywords && keywords.length > 0 && { "keywords": keywords.join(", ") }),
        "encodingFormat": src.split('.').pop()?.toLowerCase() || "image",
        "uploadDate": new Date().toISOString(),
    };

    return structuredData;
}

interface OptimizedImageProps extends Omit<ImageProps, 'placeholder'> {
    src: string;
    alt?: string; // 改为可选，支持自动生成
    width?: number;
    height?: number;
    className?: string;
    containerClassName?: string;
    showSkeleton?: boolean;
    skeletonClassName?: string;
    enableBlur?: boolean;
    blurDataURL?: string;
    aspectRatio?: 'square' | '16:9' | '4:3' | '3:2' | 'auto';
    objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    priority?: boolean;
    quality?: number;
    sizes?: string;
    onLoadComplete?: () => void;
    onError?: () => void;
    fallbackSrc?: string;
    enableWebP?: boolean;
    enableLazyLoading?: boolean;
    loadingAnimation?: 'fade' | 'blur' | 'scale' | 'none';
    // 新增SEO相关属性
    enableSmartAlt?: boolean;
    context?: string; // 图片上下文，用于生成alt标签
    caption?: string; // 图片说明
    enableStructuredData?: boolean;
    imageType?: 'photograph' | 'illustration' | 'diagram' | 'screenshot' | 'logo' | 'icon';
    author?: string;
    license?: string;
    location?: string;
    keywords?: string[];
}//
生成模糊占位符
const generateBlurDataURL = (width: number = 10, height: number = 10): string => {
    if (typeof document === 'undefined') return '';

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        // 创建渐变背景
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f3f4f6');
        gradient.addColorStop(1, '#e5e7eb');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    return canvas.toDataURL();
};

// 获取响应式尺寸配置
const getResponsiveSizes = (aspectRatio?: string): string => {
    switch (aspectRatio) {
        case 'square':
            return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
        case '16:9':
            return '(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw';
        case '4:3':
            return '(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw';
        case '3:2':
            return '(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 55vw';
        default:
            return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }
};

// 获取宽高比样式
const getAspectRatioStyle = (aspectRatio?: string) => {
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
};

// 创建有趣的占位符组件
const FunPlaceholder = ({ className = "" }: { className?: string }) => {
    const [emoji, setEmoji] = useState('🖼️');

    const emojis = ['🖼️', '📸', '🎨', '🌈', '✨', '🎭', '🎪', '🎨'];

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
};

// 错误占位符组件
const ErrorPlaceholder = ({
    onRetry,
    className = ""
}: {
    onRetry?: () => void;
    className?: string;
}) => (
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

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = "",
    containerClassName = "",
    showSkeleton = true,
    skeletonClassName = "",
    enableBlur = true,
    blurDataURL,
    aspectRatio = 'auto',
    objectFit = 'cover',
    priority = false,
    quality = 85,
    sizes,
    onLoadComplete,
    onError,
    fallbackSrc,
    enableWebP = true,
    enableLazyLoading = true,
    loadingAnimation = 'fade',
    // 新增SEO相关属性
    enableSmartAlt = true,
    context,
    caption,
    enableStructuredData = false,
    imageType,
    author,
    license,
    location,
    keywords,
    ...props
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(src);
    const [isInView, setIsInView] = useState(!enableLazyLoading || priority);
    const imgRef = useRef<HTMLDivElement>(null);

    // 生成智能alt标签
    const smartAlt = enableSmartAlt && !alt
        ? generateSmartAlt(src, context, imageType)
        : alt || '';

    // 生成结构化数据
    const structuredData = enableStructuredData
        ? generateImageStructuredData({
            src,
            alt: smartAlt,
            width,
            height,
            author,
            license,
            location,
            keywords,
            caption,
            imageType,
        })
        : null;

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
                rootMargin: '50px', // 提前50px开始加载
                threshold: 0.1
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [enableLazyLoading, priority, isInView]);

    // 处理图片加载完成
    const handleLoadComplete = () => {
        setIsLoading(false);
        onLoadComplete?.();
    };

    // 处理图片加载错误
    const handleError = () => {
        setHasError(true);
        setIsLoading(false);

        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
            setHasError(false);
            setIsLoading(true);
        } else {
            onError?.();
        }
    };

    // 重试加载
    const handleRetry = () => {
        setHasError(false);
        setIsLoading(true);
        setCurrentSrc(src);
    };

    // 生成优化的图片URL（支持WebP）
    const getOptimizedSrc = (originalSrc: string): string => {
        if (!enableWebP) return originalSrc;

        // 如果是外部URL，直接返回
        if (originalSrc.startsWith('http')) {
            return originalSrc;
        }

        // 对于本地图片，可以在这里添加WebP转换逻辑
        return originalSrc;
    };

    // 获取响应式sizes
    const responsiveSizes = sizes || getResponsiveSizes(aspectRatio);

    // 获取宽高比样式
    const aspectRatioClass = getAspectRatioStyle(aspectRatio);

    // 生成模糊占位符
    const defaultBlurDataURL = enableBlur && !blurDataURL
        ? generateBlurDataURL(width || 400, height || 300)
        : blurDataURL;

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

    const currentVariant = animationVariants[loadingAnimation];

    return (
        <>
            {/* 图片结构化数据 */}
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(structuredData),
                    }}
                />
            )}

            <div
                ref={imgRef}
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
                        >
                            {showSkeleton ? (
                                <Skeleton className={`w-full h-full ${skeletonClassName}`} />
                            ) : (
                                <FunPlaceholder className="w-full h-full" />
                            )}
                        </motion.div>
                    ) : hasError ? (
                        // 错误状态
                        <motion.div
                            key="error"
                            className={`absolute inset-0 ${aspectRatioClass}`}
                            {...currentVariant}
                            transition={{ duration: 0.3 }}
                        >
                            <ErrorPlaceholder
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
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            {/* 加载状态覆盖层 */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        className={`absolute inset-0 z-10 ${aspectRatioClass}`}
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {showSkeleton ? (
                                            <Skeleton className={`w-full h-full ${skeletonClassName}`} />
                                        ) : (
                                            <FunPlaceholder className="w-full h-full" />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 实际图片 */}
                            <Image
                                src={getOptimizedSrc(currentSrc)}
                                alt={smartAlt}
                                width={width}
                                height={height}
                                className={`${className} transition-opacity duration-300`}
                                style={{
                                    objectFit,
                                    width: '100%',
                                    height: '100%'
                                }}
                                sizes={responsiveSizes}
                                quality={quality}
                                priority={priority}
                                placeholder={enableBlur && defaultBlurDataURL ? 'blur' : 'empty'}
                                blurDataURL={defaultBlurDataURL}
                                onLoad={handleLoadComplete}
                                onError={handleError}
                                {...props}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}/
    / 预设配置的图片组件
export const AvatarImage = (props: Omit<OptimizedImageProps, 'aspectRatio' | 'objectFit'>) => (
    <OptimizedImage
        {...props}
        aspectRatio="square"
        objectFit="cover"
        className={`rounded-full ${props.className || ''}`}
    />
);

export const CardImage = (props: Omit<OptimizedImageProps, 'aspectRatio' | 'objectFit'>) => (
    <OptimizedImage
        {...props}
        aspectRatio="16:9"
        objectFit="cover"
        className={`rounded-lg ${props.className || ''}`}
    />
);

export const HeroImage = (props: Omit<OptimizedImageProps, 'aspectRatio' | 'objectFit' | 'priority'>) => (
    <OptimizedImage
        {...props}
        aspectRatio="16:9"
        objectFit="cover"
        priority={true}
        quality={90}
        className={`rounded-xl ${props.className || ''}`}
    />
);

export const GalleryImage = (props: Omit<OptimizedImageProps, 'enableLazyLoading' | 'loadingAnimation'>) => (
    <OptimizedImage
        {...props}
        enableLazyLoading={true}
        loadingAnimation="blur"
        quality={80}
        className={`rounded-lg hover:scale-105 transition-transform duration-300 ${props.className || ''}`}
    />
);

// 新增SEO优化的图片组件
export const SEOOptimizedImage = (props: OptimizedImageProps) => (
    <OptimizedImage
        {...props}
        enableSmartAlt={true}
        enableStructuredData={true}
        enableWebP={true}
        quality={85}
    />
);

export const BlogImage = (props: Omit<OptimizedImageProps, 'enableSmartAlt' | 'enableStructuredData' | 'imageType'>) => (
    <OptimizedImage
        {...props}
        enableSmartAlt={true}
        enableStructuredData={true}
        imageType="photograph"
        aspectRatio="16:9"
        className={`rounded-lg ${props.className || ''}`}
    />
);

export const DiagramImage = (props: Omit<OptimizedImageProps, 'imageType' | 'enableSmartAlt'>) => (
    <OptimizedImage
        {...props}
        enableSmartAlt={true}
        enableStructuredData={true}
        imageType="diagram"
        objectFit="contain"
        className={`bg-white rounded-lg ${props.className || ''}`}
    />
);

export const ScreenshotImage = (props: Omit<OptimizedImageProps, 'imageType' | 'enableSmartAlt'>) => (
    <OptimizedImage
        {...props}
        enableSmartAlt={true}
        enableStructuredData={true}
        imageType="screenshot"
        aspectRatio="16:9"
        className={`border border-gray-200 rounded-lg ${props.className || ''}`}
    />
);