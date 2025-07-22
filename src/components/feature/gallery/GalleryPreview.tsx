"use client";

import React, { useState, useEffect } from "react";
import { GalleryImage as OptimizedGalleryImage } from "@/components/ui/OptimizedImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreativeCard } from "@/components/ui/CreativeCard";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";
import {
    Camera,
    MapPin,
    Calendar,
    Eye,
    Heart,
    ArrowRight,
    Maximize2,
    Share2
} from "lucide-react";

export interface GalleryImage {
    id: string;
    key: string;
    url: string;
    width: number;
    height: number;
    uploadedAt: Date | string;
    title?: string;
    description?: string;
    location?: string;
    tags?: string[];
    camera?: string;
    lens?: string;
    settings?: {
        aperture?: string;
        shutter?: string;
        iso?: string;
        focal?: string;
    };
    likes?: number;
    views?: number;
    featured?: boolean;
}

export interface GalleryPreviewProps {
    images: GalleryImage[];
    maxImages?: number;
    showMetadata?: boolean;
    layout?: "grid" | "masonry" | "carousel";
    className?: string;
}

/**
 * 图片画廊预览组件
 * 用于在首页展示最新的精美图片
 */
export function GalleryPreview({
    images,
    maxImages = 6,
    showMetadata = true,
    layout = "grid",
    className,
}: GalleryPreviewProps) {
    const [displayImages, setDisplayImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    useEffect(() => {
        // 优先显示featured图片，然后按上传时间排序
        const sortedImages = [...images]
            .sort((a, b) => {
                // 优先级排序
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;

                // 按上传时间排序
                const dateA = new Date(a.uploadedAt).getTime();
                const dateB = new Date(b.uploadedAt).getTime();
                return dateB - dateA;
            })
            .slice(0, maxImages);

        setDisplayImages(sortedImages);
    }, [images, maxImages]);

    if (displayImages.length === 0) {
        return (
            <div className={cn("text-center py-12", className)}>
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    暂无图片展示
                </h3>
                <p className="text-muted-foreground">
                    精美图片正在准备中，敬请期待！
                </p>
            </div>
        );
    }

    return (
        <div className={cn("space-y-8", className)}>
            {/* 图片网格 */}
            {layout === "grid" && (
                <ScrollRevealContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayImages.map((image, index) => (
                        <ScrollRevealItem key={image.id}>
                            <ImageCard
                                image={image}
                                index={index}
                                showMetadata={showMetadata}
                                onClick={() => setSelectedImage(image)}
                            />
                        </ScrollRevealItem>
                    ))}
                </ScrollRevealContainer>
            )}

            {/* 瀑布流布局 */}
            {layout === "masonry" && (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {displayImages.map((image, index) => (
                        <div key={image.id} className="break-inside-avoid">
                            <ImageCard
                                image={image}
                                index={index}
                                showMetadata={showMetadata}
                                onClick={() => setSelectedImage(image)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* 轮播布局 */}
            {layout === "carousel" && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground">
                    {displayImages.map((image, index) => (
                        <div key={image.id} className="flex-shrink-0 w-80">
                            <ImageCard
                                image={image}
                                index={index}
                                showMetadata={showMetadata}
                                onClick={() => setSelectedImage(image)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* 查看更多链接 */}
            <ScrollReveal animation="fadeIn" delay={300}>
                <div className="text-center pt-4">
                    <Link
                        href="/gallery"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                    >
                        查看完整画廊
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </ScrollReveal>

            {/* 全屏查看模态框 */}
            <ImageModal
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
}

/**
 * 单个图片卡片
 */
function ImageCard({
    image,
    index,
    showMetadata,
    onClick,
}: {
    image: GalleryImage;
    index: number;
    showMetadata: boolean;
    onClick: () => void;
}) {
    // 计算图片宽高比
    const aspectRatio = image.width / image.height;
    const isLandscape = aspectRatio > 1;
    const isPortrait = aspectRatio < 0.8;

    // 格式化日期
    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // 获取卡片变体
    const getCardVariant = () => {
        if (image.featured) return "floating";
        if (index % 3 === 0) return "tilted";
        if (index % 3 === 1) return "morphing";
        return "glass";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <CreativeCard
                variant={getCardVariant()}
                size="md"
                enable3D={true}
                enableHover={true}
                className="h-full relative group cursor-pointer overflow-hidden"
                onClick={onClick}
            >
                {/* 特色图片标识 */}
                {image.featured && (
                    <div className="absolute top-2 right-2 z-20">
                        <div className="bg-gradient-to-r from-accent-orange to-accent-pink text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            精选
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {/* 图片容器 */}
                    <div className="relative overflow-hidden rounded-lg">
                        <div
                            className={cn(
                                "relative w-full",
                                isPortrait ? "aspect-[3/4]" : isLandscape ? "aspect-[4/3]" : "aspect-square"
                            )}
                        >
                            <OptimizedGalleryImage
                                src={image.url}
                                alt={image.title || image.key}
                                width={image.width}
                                height={image.height}
                                className="transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                enableLazyLoading={true}
                                loadingAnimation="blur"
                                quality={80}
                                aspectRatio={isPortrait ? "3:4" : isLandscape ? "4:3" : "square"}
                            />

                            {/* 悬停覆盖层 */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* 悬停操作按钮 */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors">
                                        <Maximize2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 图片信息 */}
                    {showMetadata && (
                        <div className="space-y-3">
                            {/* 标题和描述 */}
                            {(image.title || image.description) && (
                                <div>
                                    {image.title && (
                                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                                            {image.title}
                                        </h3>
                                    )}
                                    {image.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {image.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* 标签 */}
                            {image.tags && image.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {image.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded-md"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                    {image.tags.length > 3 && (
                                        <span className="text-xs text-muted-foreground">
                                            +{image.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* 元信息 */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    {image.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate max-w-20">{image.location}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(image.uploadedAt)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {image.views && (
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{image.views}</span>
                                        </div>
                                    )}
                                    {image.likes && (
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-3 h-3" />
                                            <span>{image.likes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CreativeCard>
        </motion.div>
    );
}

/**
 * 图片全屏查看模态框
 */
function ImageModal({
    image,
    onClose,
}: {
    image: GalleryImage | null;
    onClose: () => void;
}) {
    useEffect(() => {
        if (image) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [image]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (image) {
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            window.removeEventListener('keydown', handleEscape);
        };
    }, [image, onClose]);

    return (
        <AnimatePresence>
            {image && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative max-w-[90vw] max-h-[90vh] bg-white rounded-lg overflow-hidden"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 图片 */}
                        <div className="relative">
                            <OptimizedGalleryImage
                                src={image.url}
                                alt={image.title || image.key}
                                width={image.width}
                                height={image.height}
                                className="max-w-full max-h-[80vh]"
                                objectFit="contain"
                                priority={true}
                                quality={95}
                                enableLazyLoading={false}
                            />
                        </div>

                        {/* 图片信息 */}
                        <div className="p-4 bg-white">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    {image.title && (
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {image.title}
                                        </h3>
                                    )}
                                    {image.description && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            {image.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        {image.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{image.location}</span>
                                            </div>
                                        )}
                                        {image.camera && (
                                            <div className="flex items-center gap-1">
                                                <Camera className="w-3 h-3" />
                                                <span>{image.camera}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * 紧凑版画廊预览
 */
export function CompactGalleryPreview({
    images,
    maxImages = 4,
    className,
}: {
    images: GalleryImage[];
    maxImages?: number;
    className?: string;
}) {
    const displayImages = images
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, maxImages);

    return (
        <div className={cn("grid grid-cols-2 gap-2", className)}>
            {displayImages.map((image, index) => (
                <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                    <OptimizedGalleryImage
                        src={image.url}
                        alt={image.title || image.key}
                        width={200}
                        height={200}
                        className="transition-transform duration-300 group-hover:scale-110"
                        aspectRatio="square"
                        enableLazyLoading={true}
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </motion.div>
            ))}
        </div>
    );
}// 
默认导出
export default GalleryPreview;