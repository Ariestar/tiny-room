"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
    Heart,
    Star,
    MessageCircle,
    Share2,
    Download,
    Calendar,
    Camera,
    MapPin,
    Eye,
    ThumbsUp
} from "lucide-react";
import type { R2Image } from "@/app/(public)/gallery/page";

interface ImageDetailsProps {
    /** 图片数据 */
    image: R2Image;
    /** 是否显示详情面板 */
    visible?: boolean;
    /** 自定义样式类名 */
    className?: string;
}

interface ImageMetadata {
    views: number;
    likes: number;
    rating: number;
    totalRatings: number;
    comments: Comment[];
    tags: string[];
    camera?: string;
    lens?: string;
    settings?: string;
    location?: string;
}

interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    likes: number;
}

/**
 * 图片详情组件
 * 显示图片的元数据、评分、评论和相关推荐
 */
export function ImageDetails({
    image,
    visible = true,
    className = "",
}: ImageDetailsProps) {
    // 模拟数据 - 实际项目中应该从 API 获取
    const [metadata] = useState<ImageMetadata>({
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 50) + 10,
        rating: 4.2 + Math.random() * 0.8,
        totalRatings: Math.floor(Math.random() * 20) + 5,
        comments: [
            {
                id: "1",
                author: "摄影爱好者",
                content: "构图很棒，光线处理得很好！",
                timestamp: new Date(Date.now() - 86400000),
                likes: 3,
            },
            {
                id: "2",
                author: "风景达人",
                content: "这个角度很独特，很有艺术感。",
                timestamp: new Date(Date.now() - 172800000),
                likes: 1,
            },
        ],
        tags: ["风景", "自然", "摄影", "艺术"],
        camera: "Canon EOS R5",
        lens: "RF 24-70mm f/2.8L",
        settings: "f/8, 1/125s, ISO 100",
        location: "杭州西湖",
    });

    const [userRating, setUserRating] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [newComment, setNewComment] = useState("");

    // 处理评分
    const handleRating = (rating: number) => {
        setUserRating(rating);
    };

    // 处理点赞
    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    // 处理评论提交
    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            // 这里应该调用 API 提交评论
            console.log("提交评论:", newComment);
            setNewComment("");
        }
    };

    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`
        w-full max-w-4xl mx-auto p-6 space-y-8
        bg-background/95 backdrop-blur-sm
        border border-border/20 rounded-2xl
        ${className}
      `}
        >
            {/* 图片基本信息 */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                        {image.key?.replace(/\.[^/.]+$/, "") || "未命名图片"}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye size={16} />
                        <span className="text-sm">{metadata.views} 次浏览</span>
                    </div>
                </div>

                {/* 统计信息 */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>{image.uploadedAt?.toLocaleDateString() || "未知日期"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>{image.width} × {image.height}</span>
                    </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                    {metadata.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* 互动区域 */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                {/* 评分 */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">评分:</span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => handleRating(star)}
                                className="transition-colors hover:scale-110"
                            >
                                <Star
                                    size={20}
                                    className={`
                    ${star <= userRating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted-foreground hover:text-yellow-400"
                                        }
                  `}
                                />
                            </button>
                        ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {metadata.rating.toFixed(1)} ({metadata.totalRatings})
                    </span>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLike}
                        className={`
              flex items-center gap-1 px-3 py-2 rounded-lg transition-colors
              ${isLiked
                                ? "bg-red-500/10 text-red-500"
                                : "hover:bg-muted text-muted-foreground"
                            }
            `}
                    >
                        <Heart size={16} className={isLiked ? "fill-current" : ""} />
                        <span className="text-sm">{metadata.likes + (isLiked ? 1 : 0)}</span>
                    </button>

                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                        <Share2 size={16} />
                        <span className="text-sm">分享</span>
                    </button>

                    <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                        <Download size={16} />
                        <span className="text-sm">下载</span>
                    </button>
                </div>
            </div>

            {/* 拍摄信息 */}
            {(metadata.camera || metadata.location) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/20 rounded-xl">
                    {metadata.camera && (
                        <div className="space-y-2">
                            <h3 className="font-medium flex items-center gap-2">
                                <Camera size={16} />
                                拍摄设备
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>{metadata.camera}</p>
                                {metadata.lens && <p>{metadata.lens}</p>}
                                {metadata.settings && <p>{metadata.settings}</p>}
                            </div>
                        </div>
                    )}

                    {metadata.location && (
                        <div className="space-y-2">
                            <h3 className="font-medium flex items-center gap-2">
                                <MapPin size={16} />
                                拍摄地点
                            </h3>
                            <p className="text-sm text-muted-foreground">{metadata.location}</p>
                        </div>
                    )}
                </div>
            )}

            {/* 评论区域 */}
            <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                    <MessageCircle size={16} />
                    评论 ({metadata.comments.length})
                </h3>

                {/* 评论输入 */}
                <div className="space-y-3">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="写下你的想法..."
                        className="w-full p-3 bg-muted/30 border border-border/20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        rows={3}
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleCommentSubmit}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                        >
                            发表评论
                        </button>
                    </div>
                </div>

                {/* 评论列表 */}
                <div className="space-y-4">
                    {metadata.comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-muted/20 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">
                                    {comment.timestamp.toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                                <ThumbsUp size={12} />
                                <span>{comment.likes}</span>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 相关推荐 */}
            <div className="space-y-4">
                <h3 className="font-medium">相关推荐</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* 这里应该显示相关图片的缩略图 */}
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                            <span className="text-sm">推荐 {i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ImageDetails;