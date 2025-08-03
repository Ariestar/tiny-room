"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface PostData {
    slug: string;
    title: string;
    date: string;
    tags: string[];
    status: string;
    content: string;
    readingTime: string;
    views?: number;
}

interface RelatedPostData extends PostData {
    relevanceScore: number;
    matchedTags: string[];
    similarity: number;
}

interface RelatedPostsProps {
    slug?: string; // Add slug prop for current post
    currentSlug?: string; // Alternative name for slug
    tags?: string[]; // Add tags prop for filtering
    limit?: number; // Alternative name for maxResults
    currentPost?: PostData;
    allPosts?: PostData[];
    maxResults?: number;
    context?: "detail" | "homepage";
    className?: string;
    title?: string;
    showRelevanceScore?: boolean;
}

// 相关性算法配置
const RELEVANCE_WEIGHTS = {
    tagMatch: 0.4,        // 标签匹配权重
    contentSimilarity: 0.3, // 内容相似度权重
    recency: 0.2,         // 时间新鲜度权重
    popularity: 0.1,      // 热度权重
};

// 计算文本相似度（简化版TF-IDF）
function calculateTextSimilarity(text1: string, text2: string): number {
    const getWords = (text: string) =>
        text.toLowerCase()
            .replace(/[^\w\s\u4e00-\u9fff]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);

    const words1 = getWords(text1);
    const words2 = getWords(text2);

    if (words1.length === 0 || words2.length === 0) return 0;

    // 计算词频
    const freq1 = new Map<string, number>();
    const freq2 = new Map<string, number>();

    words1.forEach(word => freq1.set(word, (freq1.get(word) || 0) + 1));
    words2.forEach(word => freq2.set(word, (freq2.get(word) || 0) + 1));

    // 计算余弦相似度
    const allWords = new Set([...words1, ...words2]);
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (const word of allWords) {
        const f1 = freq1.get(word) || 0;
        const f2 = freq2.get(word) || 0;
        dotProduct += f1 * f2;
        norm1 += f1 * f1;
        norm2 += f2 * f2;
    }

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// 计算相关性得分
function calculateRelevanceScore(currentPost: PostData, candidatePost: PostData): number {
    // 1. 标签匹配得分
    const commonTags = currentPost.tags.filter(tag =>
        candidatePost.tags.includes(tag)
    );
    const tagScore = commonTags.length / Math.max(currentPost.tags.length, candidatePost.tags.length, 1);

    // 2. 内容相似度得分
    const contentScore = calculateTextSimilarity(
        currentPost.content.slice(0, 1000), // 只比较前1000字符
        candidatePost.content.slice(0, 1000)
    );

    // 3. 时间新鲜度得分
    const daysDiff = Math.abs(
        (new Date(currentPost.date).getTime() - new Date(candidatePost.date).getTime())
        / (1000 * 60 * 60 * 24)
    );
    const recencyScore = Math.max(0, 1 - daysDiff / 365); // 一年内的文章有新鲜度加分

    // 4. 热度得分（基于浏览量）
    const popularityScore = candidatePost.views ?
        Math.min(1, candidatePost.views / 1000) : 0;

    // 综合得分
    const totalScore =
        tagScore * RELEVANCE_WEIGHTS.tagMatch +
        contentScore * RELEVANCE_WEIGHTS.contentSimilarity +
        recencyScore * RELEVANCE_WEIGHTS.recency +
        popularityScore * RELEVANCE_WEIGHTS.popularity;

    return totalScore;
}

// 首页推荐算法（基于热度和新鲜度）
function calculateHomepageScore(post: PostData): number {
    let score = 0;

    // 发布时间新鲜度 (权重: 40%)
    const daysSincePublished = Math.floor(
        (Date.now() - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const freshnessScore = Math.max(0, 1 - daysSincePublished / 30); // 30天内为新鲜
    score += freshnessScore * 0.4;

    // 浏览量热度 (权重: 35%)
    const viewsScore = Math.min(1, (post.views || 0) / 1000); // 1000浏览量为满分
    score += viewsScore * 0.35;

    // 内容质量指标 (权重: 25%)
    const qualityScore =
        (post.content.length > 500 ? 0.3 : 0) + // 长文章加分
        (post.tags.length >= 3 ? 0.3 : 0) + // 标签丰富度
        (post.title.length >= 10 ? 0.4 : 0); // 标题完整度
    score += qualityScore * 0.25;

    return score;
}

export function RelatedPosts({
    slug,
    currentSlug,
    tags,
    limit,
    currentPost,
    allPosts = [],
    maxResults = 5,
    context = "detail",
    className = "",
    title,
    showRelevanceScore = false,
}: RelatedPostsProps) {
    // 处理新的 props
    const currentPostSlug = slug || currentSlug;
    const maxItems = limit || maxResults;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 模拟加载延迟
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const relatedPosts = useMemo(() => {
        // 如果没有提供 allPosts，返回空数组（组件会显示占位内容）
        if (!allPosts || allPosts.length === 0) {
            return [];
        }

        if (context === "homepage") {
            // 首页场景：推荐热门和最新文章
            return allPosts
                .map((post) => ({
                    ...post,
                    relevanceScore: calculateHomepageScore(post),
                    matchedTags: [],
                    similarity: 0,
                }))
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, maxItems);
        }

        // 简化的相关文章推荐（基于 slug 和 tags）
        if (currentPostSlug && tags) {
            return allPosts
                .filter(post => post.slug !== currentPostSlug) // 排除当前文章
                .map(post => {
                    const commonTags = tags.filter(tag => post.tags.includes(tag));
                    const tagScore = commonTags.length / Math.max(tags.length, post.tags.length, 1);
                    return {
                        ...post,
                        relevanceScore: tagScore,
                        matchedTags: commonTags,
                        similarity: tagScore,
                    };
                })
                .filter(post => post.relevanceScore > 0) // 只显示有相关标签的文章
                .sort((a, b) => b.relevanceScore - a.relevanceScore)
                .slice(0, maxItems);
        }

        if (!currentPost) return [];

        // 博客详情页场景：基于当前文章推荐相关文章
        return allPosts
            .filter((post) => post.slug !== currentPost.slug && post.status === "publish")
            .map((post) => {
                const relevanceScore = calculateRelevanceScore(currentPost, post);
                const matchedTags = currentPost.tags.filter(tag => post.tags.includes(tag));
                const similarity = calculateTextSimilarity(
                    currentPost.content.slice(0, 500),
                    post.content.slice(0, 500)
                );

                return {
                    ...post,
                    relevanceScore,
                    matchedTags,
                    similarity,
                };
            })
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, maxResults);
    }, [currentPost, allPosts, maxItems, context, currentPostSlug, tags]);

    const defaultTitle = context === "homepage" ? "推荐阅读" : "相关文章";

    // 如果没有相关文章，显示占位内容
    if (!isLoading && relatedPosts.length === 0) {
        return (
            <div className={`space-y-4 ${className}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title || defaultTitle}
                </h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>暂无相关文章推荐</p>
                    <p className="text-sm mt-2">更多精彩内容正在路上...</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={`space-y-4 ${className}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title || defaultTitle}
                </h3>
                <div className="space-y-3">
                    {Array.from({ length: maxResults }).map((_, index) => (
                        <div
                            key={index}
                            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-24"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (relatedPosts.length === 0) {
        return (
            <div className={`text-center py-8 ${className}`}>
                <p className="text-gray-500 dark:text-gray-400">
                    暂无相关文章推荐
                </p>
            </div>
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title || defaultTitle}
                </h3>
                {context === "homepage" && (
                    <Link
                        href="/blog"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        查看全部 →
                    </Link>
                )}
            </div>

            <div className="space-y-3">
                {relatedPosts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="p-4 hover:shadow-md transition-shadow">
                            <Link href={`/blog/${post.slug}`} className="block">
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                                        <span>{post.readingTime}</span>
                                    </div>

                                    {/* 标签 */}
                                    {post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.slice(0, 3).map((tag) => {
                                                const isMatched = context === "detail" &&
                                                    currentPost?.tags.includes(tag);
                                                return (
                                                    <Badge
                                                        key={tag}
                                                        variant={isMatched ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* 相关性得分（调试用） */}
                                    {showRelevanceScore && (
                                        <div className="text-xs text-gray-400">
                                            相关性: {(post.relevanceScore * 100).toFixed(1)}%
                                            {context === "detail" && post.matchedTags.length > 0 && (
                                                <span className="ml-2">
                                                    匹配标签: {post.matchedTags.join(", ")}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* 浏览量 */}
                                    {post.views && (
                                        <div className="text-xs text-gray-400">
                                            {post.views} 次阅读
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* 算法说明 */}
            {context === "detail" && showRelevanceScore && (
                <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="font-medium mb-1">推荐算法说明：</p>
                    <ul className="space-y-1">
                        <li>• 标签匹配 ({(RELEVANCE_WEIGHTS.tagMatch * 100).toFixed(0)}%)</li>
                        <li>• 内容相似度 ({(RELEVANCE_WEIGHTS.contentSimilarity * 100).toFixed(0)}%)</li>
                        <li>• 时间新鲜度 ({(RELEVANCE_WEIGHTS.recency * 100).toFixed(0)}%)</li>
                        <li>• 文章热度 ({(RELEVANCE_WEIGHTS.popularity * 100).toFixed(0)}%)</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

// 预设配置的便捷组件
export function BlogDetailRelatedPosts({
    currentPost,
    allPosts,
    maxResults = 5,
    className = "",
}: {
    currentPost: PostData;
    allPosts: PostData[];
    maxResults?: number;
    className?: string;
}) {
    return (
        <RelatedPosts
            currentPost={currentPost}
            allPosts={allPosts}
            maxResults={maxResults}
            context="detail"
            title="相关文章推荐"
            className={className}
        />
    );
}

export function HomepageRelatedPosts({
    allPosts,
    maxResults = 6,
    className = "",
}: {
    allPosts: PostData[];
    maxResults?: number;
    className?: string;
}) {
    return (
        <RelatedPosts
            allPosts={allPosts}
            maxResults={maxResults}
            context="homepage"
            title="推荐阅读"
            className={className}
        />
    );
}