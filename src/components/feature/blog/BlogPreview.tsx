"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CreativeCard } from "@/components/ui/CreativeCard";
import { Clock, Calendar, Tag, ArrowRight } from "lucide-react";
import { ScrollReveal, ScrollRevealContainer, ScrollRevealItem } from "@/components/animation/ScrollReveal";

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    description?: string;
    readingTime: string;
    status: string;
    coverImage?: string | null;
}

export interface BlogPreviewProps {
    posts: BlogPost[];
    maxPosts?: number;
    showImages?: boolean;
    className?: string;
}

/**
 * 博客文章预览组件
 * 用于在首页展示最新的博客文章
 */
export function BlogPreview({
    posts,
    maxPosts = 3,
    showImages = false,
    className,
}: BlogPreviewProps) {
    const displayPosts = posts.slice(0, maxPosts);

    if (displayPosts.length === 0) {
        return (
            <div className={cn("text-center py-12", className)}>
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                    暂无博客文章
                </h3>
                <p className="text-muted-foreground">
                    精彩内容正在准备中，敬请期待！
                </p>
            </div>
        );
    }

    return (
        <ScrollRevealContainer className={cn("space-y-6", className)}>
            {displayPosts.map((post, index) => (
                <ScrollRevealItem key={post.slug}>
                    <BlogPreviewCard
                        post={post}
                        index={index}
                        showImage={showImages}
                    />
                </ScrollRevealItem>
            ))}

            {/* 查看更多链接 */}
            <ScrollReveal animation="fadeIn" delay={300}>
                <div className="text-center pt-4">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                    >
                        查看所有文章
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </ScrollReveal>
        </ScrollRevealContainer>
    );
}

/**
 * 单个博客预览卡片
 */
function BlogPreviewCard({
    post,
    index,
    showImage = false,
}: {
    post: BlogPost;
    index: number;
    showImage?: boolean;
}) {
    // 为不同的文章分配不同的emoji
    const getPostEmoji = (title: string, index: number) => {
        const emojis = ["📚", "💡", "🚀", "🎨", "⚡", "🌟", "🔥", "💻", "🎯", "✨"];

        // 基于标题和索引生成一个稳定的emoji
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return emojis[(hash + index) % emojis.length];
    };

    // 获取文章摘要
    const getExcerpt = (description?: string, title?: string) => {
        if (description) return description;

        // 如果没有描述，生成一个基于标题的简短描述
        const defaultDescriptions = [
            "探索新的技术见解和实践经验",
            "分享学习过程中的思考和总结",
            "记录技术成长路上的点点滴滴",
            "深入浅出地解析复杂概念",
            "从实践中总结的宝贵经验"
        ];

        const hash = (title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return defaultDescriptions[hash % defaultDescriptions.length];
    };

    // 格式化日期
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return "昨天";
        if (diffDays <= 7) return `${diffDays}天前`;
        if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周前`;

        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Link href={`/blog/${post.slug}`} className="block group">
            <CreativeCard
                variant="default"
                size="sm"
                enable3D={false}
                enableHover={false}
                className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1"
            >
                <div className="flex items-start gap-4">
                    {/* 文章emoji图标 */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {getPostEmoji(post.title, index)}
                        </div>
                    </div>

                    {/* 文章内容 */}
                    <div className="flex-1 min-w-0">
                        {/* 标题 */}
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>

                        {/* 摘要 */}
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {getExcerpt(post.description, post.title)}
                        </p>

                        {/* 标签 */}
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md"
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 3 && (
                                    <span className="text-xs text-muted-foreground">
                                        +{post.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* 元信息 */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(post.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{post.readingTime}</span>
                            </div>
                            {post.status === 'published' && (
                                <span className="px-2 py-0.5 bg-accent-green/10 text-accent-green rounded-full text-xs">
                                    已发布
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 箭头指示器 */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </CreativeCard>
        </Link>
    );
}

/**
 * 紧凑版博客预览组件
 * 用于侧边栏或小空间展示
 */
export function CompactBlogPreview({
    posts,
    maxPosts = 5,
    className,
}: {
    posts: BlogPost[];
    maxPosts?: number;
    className?: string;
}) {
    const displayPosts = posts.slice(0, maxPosts);

    return (
        <div className={cn("space-y-3", className)}>
            {displayPosts.map((post, index) => (
                <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <Link
                        href={`/blog/${post.slug}`}
                        className="block p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                        <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                            {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                            <span>·</span>
                            <span>{post.readingTime}</span>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}

/**
 * 博客统计组件
 */
export function BlogStats({
    posts,
    className,
}: {
    posts: BlogPost[];
    className?: string;
}) {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(post => post.status === 'published').length;
    const totalTags = new Set(posts.flatMap(post => post.tags)).size;

    // 计算总阅读时间
    const totalReadingTime = posts.reduce((total, post) => {
        const minutes = parseInt(post.readingTime.replace(/\D/g, '')) || 0;
        return total + minutes;
    }, 0);

    const stats = [
        { label: "文章总数", value: totalPosts, emoji: "📝" },
        { label: "已发布", value: publishedPosts, emoji: "✅" },
        { label: "标签数", value: totalTags, emoji: "🏷️" },
        { label: "阅读时长", value: `${totalReadingTime}分钟`, emoji: "⏱️" },
    ];

    return (
        <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", className)}>
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    className="text-center p-4 rounded-lg bg-muted/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="text-2xl mb-2">{stat.emoji}</div>
                    <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
            ))}
        </div>
    );
}