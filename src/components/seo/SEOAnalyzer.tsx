"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    analyzeKeywords,
    generateSEOScore,
    generateLongTailKeywords,
    type KeywordAnalysis,
    type SEOScore
} from '@/lib/seo/keyword-analyzer';

interface SEOAnalyzerProps {
    content: string;
    title: string;
    description?: string; // Make description optional
    url?: string; // Add url prop
    targetKeywords?: string[];
    className?: string;
}

export function SEOAnalyzer({
    content,
    title,
    description = "",
    url,
    targetKeywords = [],
    className = "",
}: SEOAnalyzerProps) {
    const [analysis, setAnalysis] = useState<{
        keywords: KeywordAnalysis[];
        seoScore: SEOScore;
        longTailKeywords: string[];
    } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const performAnalysis = async () => {
            setIsLoading(true);

            try {
                const keywords = analyzeKeywords(content, title, targetKeywords);
                const seoScore = generateSEOScore(content, title, description, targetKeywords);
                const longTailKeywords = generateLongTailKeywords(content, targetKeywords);

                setAnalysis({
                    keywords,
                    seoScore,
                    longTailKeywords,
                });
            } catch (error) {
                console.error('SEO analysis failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (content && title) {
            performAnalysis();
        }
    }, [content, title, description, targetKeywords]);

    if (isLoading) {
        return (
            <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border ${className}`}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className={`p-6 bg-white dark:bg-gray-800 rounded-lg border ${className}`}>
                <p className="text-gray-500 dark:text-gray-400">无法分析内容</p>
            </div>
        );
    }

    const { keywords, seoScore, longTailKeywords } = analysis;

    // 获取评分颜色
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
        if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
        return 'bg-red-100 dark:bg-red-900/20';
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 总体SEO评分 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border p-6"
            >
                <h3 className="text-lg font-semibold mb-4">SEO 评分</h3>

                <div className="flex items-center gap-4 mb-4">
                    <div className={`text-3xl font-bold ${getScoreColor(seoScore.overall)}`}>
                        {seoScore.overall}
                    </div>
                    <div className="flex-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${seoScore.overall >= 80 ? 'bg-green-500' :
                                    seoScore.overall >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                style={{ width: `${seoScore.overall}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* 详细评分 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(seoScore.breakdown).map(([key, score]) => (
                        <div key={key} className={`p-3 rounded-lg ${getScoreBgColor(score)}`}>
                            <div className={`text-lg font-semibold ${getScoreColor(score)}`}>
                                {score}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {key === 'keywordOptimization' && '关键词优化'}
                                {key === 'contentStructure' && '内容结构'}
                                {key === 'readability' && '可读性'}
                                {key === 'technicalSEO' && '技术SEO'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 建议 */}
                {seoScore.recommendations.length > 0 && (
                    <div>
                        <h4 className="font-medium mb-2">优化建议：</h4>
                        <ul className="space-y-1">
                            {seoScore.recommendations.map((rec, index) => (
                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                    <span className="text-yellow-500 mt-1">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </motion.div>

            {/* 关键词分析 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg border p-6"
            >
                <h3 className="text-lg font-semibold mb-4">关键词分析</h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-2">关键词</th>
                                <th className="text-left py-2">频次</th>
                                <th className="text-left py-2">密度</th>
                                <th className="text-left py-2">位置</th>
                                <th className="text-left py-2">突出度</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keywords.slice(0, 10).map((keyword, index) => (
                                <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="py-2 font-medium">{keyword.keyword}</td>
                                    <td className="py-2">{keyword.frequency}</td>
                                    <td className="py-2">{keyword.density.toFixed(2)}%</td>
                                    <td className="py-2">
                                        <div className="flex gap-1">
                                            {keyword.inTitle && (
                                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs rounded">
                                                    标题
                                                </span>
                                            )}
                                            {keyword.inHeadings && (
                                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 text-xs rounded">
                                                    标题
                                                </span>
                                            )}
                                            {keyword.inFirstParagraph && (
                                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 text-xs rounded">
                                                    首段
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="h-2 bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(100, keyword.prominence * 10)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {keyword.prominence.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* 长尾关键词建议 */}
            {longTailKeywords.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border p-6"
                >
                    <h3 className="text-lg font-semibold mb-4">长尾关键词建议</h3>

                    <div className="flex flex-wrap gap-2">
                        {longTailKeywords.slice(0, 15).map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                title="点击复制"
                                onClick={() => {
                                    navigator.clipboard.writeText(keyword);
                                }}
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// 简化版的SEO评分显示组件
export function SEOScoreCard({
    content,
    title,
    description,
    targetKeywords = [],
    className = "",
}: SEOAnalyzerProps) {
    const [seoScore, setSeoScore] = useState<SEOScore | null>(null);

    useEffect(() => {
        if (content && title) {
            const score = generateSEOScore(content, title, description ?? "", targetKeywords ?? []);
            setSeoScore(score);
        }
    }, [content, title, description, targetKeywords]);

    if (!seoScore) {
        return (
            <div className={`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
                <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border ${className}`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    SEO 评分
                </span>
                <span className={`text-lg font-bold ${getScoreColor(seoScore.overall)}`}>
                    {seoScore.overall}/100
                </span>
            </div>

            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-500 ${seoScore.overall >= 80 ? 'bg-green-500' :
                        seoScore.overall >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                    style={{ width: `${seoScore.overall}%` }}
                />
            </div>
        </div>
    );
}