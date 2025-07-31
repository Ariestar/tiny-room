"use client";

import React from "react";
import { motion } from "framer-motion";
import { TimelineLayout } from "@/components/feature/blog/timeline";

// 模拟文章数据用于演示
const mockPosts = [
    {
        slug: "modern-web-development-2024",
        title: "现代Web开发的最佳实践与趋势",
        date: "2024-12-15",
        tags: ["React", "Next.js", "TypeScript", "Web Development"],
        status: "published",
        description: "探索现代Web开发的最新趋势和最佳实践，包括框架选择、性能优化和开发工具。",
        coverImage: null,
        readingTime: "8 分钟阅读"
    },
    {
        slug: "ai-powered-development",
        title: "AI驱动的开发工具如何改变编程体验",
        date: "2024-11-28",
        tags: ["AI", "Development Tools", "Productivity"],
        status: "published",
        description: "深入了解AI如何革命性地改变开发者的工作流程和编程体验。",
        coverImage: null,
        readingTime: "6 分钟阅读"
    },
    {
        slug: "design-system-architecture",
        title: "构建可扩展的设计系统架构",
        date: "2024-10-20",
        tags: ["Design System", "UI/UX", "Architecture"],
        status: "published",
        description: "学习如何构建一个可扩展、可维护的设计系统架构。",
        coverImage: null,
        readingTime: "12 分钟阅读"
    },
    {
        slug: "performance-optimization-guide",
        title: "前端性能优化完全指南",
        date: "2024-09-15",
        tags: ["Performance", "Optimization", "Web Vitals"],
        status: "published",
        description: "全面的前端性能优化指南，涵盖Core Web Vitals和最佳实践。",
        coverImage: null,
        readingTime: "15 分钟阅读"
    },
    {
        slug: "serverless-architecture-patterns",
        title: "Serverless架构模式与实践",
        date: "2024-08-10",
        tags: ["Serverless", "Architecture", "Cloud"],
        status: "published",
        description: "探索Serverless架构的设计模式和实际应用场景。",
        coverImage: null,
        readingTime: "10 分钟阅读"
    },
    {
        slug: "react-18-new-features",
        title: "React 18新特性深度解析",
        date: "2023-12-20",
        tags: ["React", "JavaScript", "Frontend"],
        status: "published",
        description: "深入解析React 18的新特性，包括并发渲染和Suspense改进。",
        coverImage: null,
        readingTime: "9 分钟阅读"
    },
    {
        slug: "typescript-advanced-patterns",
        title: "TypeScript高级类型模式",
        date: "2023-11-15",
        tags: ["TypeScript", "Programming", "Types"],
        status: "published",
        description: "掌握TypeScript的高级类型模式和实用技巧。",
        coverImage: null,
        readingTime: "11 分钟阅读"
    },
    {
        slug: "css-grid-flexbox-mastery",
        title: "CSS Grid与Flexbox布局精通",
        date: "2023-10-05",
        tags: ["CSS", "Layout", "Frontend"],
        status: "published",
        description: "全面掌握CSS Grid和Flexbox的布局技巧和最佳实践。",
        coverImage: null,
        readingTime: "7 分钟阅读"
    },
    {
        slug: "javascript-es2023-features",
        title: "JavaScript ES2023新特性一览",
        date: "2023-09-12",
        tags: ["JavaScript", "ES2023", "Language Features"],
        status: "published",
        description: "了解JavaScript ES2023版本中引入的新特性和改进。",
        coverImage: null,
        readingTime: "6 分钟阅读"
    },
    {
        slug: "web-accessibility-guide",
        title: "Web无障碍设计完整指南",
        date: "2022-12-08",
        tags: ["Accessibility", "UX", "Web Standards"],
        status: "published",
        description: "构建包容性Web应用的完整无障碍设计指南。",
        coverImage: null,
        readingTime: "13 分钟阅读"
    },
    {
        slug: "progressive-web-apps",
        title: "渐进式Web应用开发实践",
        date: "2022-10-25",
        tags: ["PWA", "Web Apps", "Mobile"],
        status: "published",
        description: "学习如何开发高性能的渐进式Web应用。",
        coverImage: null,
        readingTime: "14 分钟阅读"
    },
    {
        slug: "graphql-api-design",
        title: "GraphQL API设计最佳实践",
        date: "2022-08-18",
        tags: ["GraphQL", "API", "Backend"],
        status: "published",
        description: "掌握GraphQL API设计的最佳实践和性能优化技巧。",
        coverImage: null,
        readingTime: "10 分钟阅读"
    }
];

export default function TimelineShowcase() {
    return (
        <div className="min-h-screen bg-background">
            {/* 页面标题 */}
            <section className="py-12 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h1
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Timeline Showcase
                    </motion.h1>
                    <motion.p
                        className="text-xl text-muted-foreground mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        美化后的博客时间线组件演示
                    </motion.p>

                    {/* 特性说明 */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">流畅动画</h3>
                            <p className="text-sm text-muted-foreground">Spring动画和渐进式加载效果</p>
                        </div>

                        <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">响应式设计</h3>
                            <p className="text-sm text-muted-foreground">完美适配移动端和桌面端</p>
                        </div>

                        <div className="p-6 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="font-semibold mb-2">视差滚动</h3>
                            <p className="text-sm text-muted-foreground">多层视差效果创造深度感</p>
                        </div>
                    </motion.div>

                    {/* 视差效果说明 */}
                    <motion.div
                        className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <h3 className="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">🌟 视差滚动效果</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                            滚动页面时，不同层级的元素以不同速度移动，创造出丰富的视觉层次和深度感：
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                                    <span>背景装饰元素：慢速浮动</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                                    <span>时间线主轴：中等速度</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                                    <span>年份标签：独立视差</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-orange-400"></div>
                                    <span>文章卡片：微妙变换</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
        </div>
            </section >

        {/* 滚动提示 */ }
        < motion.div
    className = "flex flex-col items-center justify-center py-8"
    initial = {{ opacity: 0 }
}
animate = {{ opacity: 1 }}
transition = {{ duration: 0.6, delay: 0.8 }}
            >
                <p className="text-sm text-muted-foreground mb-4">向下滚动体验视差效果</p>
                <motion.div
                    className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.div
                        className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
                        animate={{ y: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </motion.div >

    {/* Timeline演示 */ }
    < section >
    <TimelineLayout posts={mockPosts} />
            </section >
        </div >
    );
}