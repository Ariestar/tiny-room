"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { OptimizedImage } from "@/components/ui/OptimizedImage";
import {
    getSmartRecommendations,
    getPopularPosts,
    getLatestPosts,
    diversifyRecommendations,
    type Post,
    type RecommendationScore
} from "@/lib/algorithms/recommendation";

interface SmartRecommendationsProps {
    posts: Post[];
    currentPostId?: string;
    userTags?: string[];
    maxResults?: number;
    className?: string;
    title?: string;
    showReasons?: boolean;
    variant?: "grid" | "list" | "carousel";
}

// 推荐标签组件
const RecommendationBadge = ({ reasons }: { reasons: string[] }) => {
    if (reasons.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-1 mt-2">
            {reasons.slice(0, 2).map((reason, index) => (
                <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                >
                    {reason}
                </Badge>
            ))}
        </div>
    );
};

// 文章卡片组件
const PostCard = ({
    post,
    score,
    reasons,
    showReasons = false
}: {
    post: Post;
    score?: RecommendationScore;
    reasons?: string[];
    showReasons?: boolean;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <Link href={`/blog/${post.slug}`} className="block">
                    {/* 文章图片 */}
                    <div className="relative h-48 overflow-hidden">
                        <OptimizedImage
                            src={`/api/og?title=${encodeURIComponent(post.title)}&tags=${encodeURIComponent(post.tags.join(','))}&type=article`}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* 推荐评分显示 */}
                        {score && score.score > 0.7 && (
                            <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                推荐
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {/* 标题 */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {post.title}
                        </h3>

                        {/* 摘要 */}
                        {post.excerpt && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
                                {post.excerpt}
                            </p>
                        )}

                        {/* 标签 */}
                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        {/* 元信息 */}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                            {post.readingTime && (
                                <span>{post.readingTime} 分钟阅读</span>
                            )}
                        </div>

                        {/* 推荐原因 */}
                        {showReasons && reasons && (
                            <RecommendationBadge reasons={reasons} />
                        )}
                    </div>
                </Link>
            </Card>
        </motion.div>
    );
};

export function SmartRecommendations({
    posts,
    currentPostId,
    userTags = [],
    maxResults = 6,
    className = "",
    title = "推荐阅读",
    showReasons = true,
    variant = "grid"
}: SmartRecommendationsProps) {
    const [recommendations, setRecommendations] = useState<{
        post: Post;
        score?: RecommendationScore;
    }[]>([]);
    const [activeTab, setActiveTab] = useState<'smart' | 'popular' | 'latest'>('smart');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const generateRecommendations = async () => {
            setIsLoading(true);

            try {
                let recommendedPosts: Post[] = [];
                let scores: RecommendationScore[] = [];

                switch (activeTab) {
                    case 'smart':
                        scores = getSmartRecommendations(posts, {
                            maxResults,
                            currentPostId,
                            userTags,
                            includePopular: true,
                            includeFresh: true,
                            includeRelated: true,
                        });
                        recommendedPosts = scores.map(score =>
                            posts.find(post => post.id === score.postId)!
                        ).filter(Boolean);
                        break;

                    case 'popular':
                        recommendedPosts = getPopularPosts(posts, maxResults);
                        break;

                    case 'latest':
                        recommendedPosts = getLatestPosts(posts, maxResults);
                        break;
                }

                // 确保推荐结果的多样性
                const diversifiedPosts = diversifyRecommendations(recommendedPosts, maxResults);

                setRecommendations(
                    diversifiedPosts.map(post => ({
                        post,
                        score: scores.find(s => s.postId === post.id)
                    }))
                );
            } catch (error) {
                console.error('Failed to generate recommendations:', error);
                setRecommendations([]);
            } finally {
                setIsLoading(false);
            }
        };

        generateRecommendations();
    }, [posts, currentPostId, userTags, maxResults, activeTab]);

    if (isLoading) {
        return (
            <div className={`${className}`}>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (recommendations.length === 0) {
        return (
            <div className={`${className}`}>
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    暂无推荐内容
                </div>
            </div>
        );
    }

    const getGridClass = () => {
        switch (variant) {
            case 'list':
                return 'space-y-4';
            case 'carousel':
                return 'flex gap-6 overflow-x-auto pb-4';
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        }
    };

    return (
        <div className={`${className}`}>
            {/* 标题和标签切换 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
                    {title}
                </h2>

                {/* 推荐类型切换 */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {[
                        { key: 'smart', label: '智能推荐' },
                        { key: 'popular', label: '热门文章' },
                        { key: 'latest', label: '最新发布' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.key
                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 推荐文章网格 */}
            <div className={getGridClass()}>
                {recommendations.map(({ post, score }, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        score={score}
                        reasons={score?.reasons}
                        showReasons={showReasons && activeTab === 'smart'}
                    />
                ))}
            </div>

            {/* 查看更多链接 */}
            {recommendations.length >= maxResults && (
                <div className="text-center mt-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                        查看更多文章
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
}

// 预设组件变体
export function PopularPosts({ posts, limit = 5, className = "" }: {
    posts: Post[];
    limit?: number;
    className?: string;
}) {
    return (
        <SmartRecommendations
            posts={posts}
            maxResults={limit}
            title="热门文章"
            showReasons={false}
            variant="list"
            className={className}
        />
    );
}

export function LatestPosts({ posts, limit = 5, className = "" }: {
    posts: Post[];
    limit?: number;
    className?: string;
}) {
    return (
        <SmartRecommendations
            posts={posts}
            maxResults={limit}
            title="最新文章"
            showReasons={false}
            variant="grid"
            className={className}
        />
    );
}