"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import {
    Calendar,
    Download,
    Share2,
} from "lucide-react";
import type { R2Image } from "@/app/(public)/gallery/page";
import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

interface ImageDetailsProps {
    /** 图片数据 */
    image: R2Image;
    /** 是否显示详情面板 */
    visible?: boolean;
    /** 自定义样式类名 */
    className?: string;
}

/**
 * 图片详情组件
 * 显示图片的元数据和评论系统
 */
export function ImageDetails({
    image,
    visible = true,
    className = "",
}: ImageDetailsProps) {
    const { theme, resolvedTheme } = useTheme();
    const giscusRef = useRef<HTMLDivElement>(null);
    const currentTheme = resolvedTheme || theme || "light";

    // 处理分享功能
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: image.key?.replace(/\.[^/.]+$/, "") || "图片",
                    text: "分享一张图片",
                    url: image.url,
                });
            } catch (error) {
                console.log("分享取消或失败");
            }
        } else {
            // 降级方案：复制链接到剪贴板
            try {
                await navigator.clipboard.writeText(image.url);
                alert("链接已复制到剪贴板");
            } catch (error) {
                console.error("复制失败:", error);
            }
        }
    };

    // 处理下载功能
    const handleDownload = async () => {
        try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = image.key || "image.jpg";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("下载失败:", error);
        }
    };

    // 格式化文件名
    const getImageTitle = () => {
        const name = image.key?.replace(/\.[^/.]+$/, "") || "未命名图片";
        return name;
    };

    // 格式化日期
    const getFormattedDate = () => {
        if (!image.uploadedAt) return "未知日期";
        return image.uploadedAt.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // 获取图片的唯一标识符（用于Giscus）
    const getImageId = () => {
        return image.key || `image-${image.url}`;
    };

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`
        w-full max-w-4xl mx-auto p-6 md:p-8 space-y-8
        bg-background/95 backdrop-blur-sm
        border border-border/20 rounded-2xl
        ${className}
      `}
        >
            {/* 图片基本信息 */}
            <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {getImageTitle()}
                    </h2>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                    {image.uploadedAt && (
                        <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{getFormattedDate()}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <span>{image.width} × {image.height}</span>
                    </div>
                </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl flex-wrap">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Share2 size={18} />
                    <span className="text-sm">分享</span>
                </button>

                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                    <Download size={18} />
                    <span className="text-sm">下载</span>
                </button>
            </div>

            {/* 评论系统 */}
            <div className="space-y-4" ref={giscusRef}>
                <h3 className="text-xl font-semibold">评论</h3>
                <div className="mt-4">
                    {process.env.NEXT_PUBLIC_GISCUS_REPO && process.env.NEXT_PUBLIC_GISCUS_REPO_ID ? (
                        <Giscus
                            repo={process.env.NEXT_PUBLIC_GISCUS_REPO}
                            repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID}
                            category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "Announcements"}
                            categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
                            mapping="specific"
                            term={getImageId()}
                            strict="0"
                            reactionsEnabled="1"
                            emitMetadata="0"
                            inputPosition="bottom"
                            theme={currentTheme === "dark" ? "dark" : "light"}
                            lang="zh-CN"
                            loading="lazy"
                        />
                    ) : (
                        <div className="p-8 text-center bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">
                                评论系统未配置。请在环境变量中设置 GISCUS 相关配置。
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                需要设置: NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default ImageDetails;