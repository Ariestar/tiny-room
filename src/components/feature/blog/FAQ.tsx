"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQStructuredData } from "@/components/seo/EnhancedStructuredData";

// 简单的SVG图标组件
const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
}

interface FAQProps {
    items?: FAQItem[]; // Make items optional
    topic?: string; // Add topic prop for auto-generating FAQ
    title?: string;
    description?: string;
    searchable?: boolean;
    categorized?: boolean;
    className?: string;
}

// 预设的FAQ数据
const getDefaultFAQItems = (topic?: string): FAQItem[] => {
    const reactFAQ: FAQItem[] = [
        {
            id: "react-1",
            question: "什么是React？",
            answer: "React是一个用于构建用户界面的JavaScript库，由Facebook开发。它采用组件化的开发方式，让开发者可以创建可重用的UI组件。",
            category: "基础"
        },
        {
            id: "react-2",
            question: "React的主要特点是什么？",
            answer: "React的主要特点包括：虚拟DOM、组件化架构、单向数据流、JSX语法、丰富的生态系统等。",
            category: "基础"
        },
        {
            id: "react-3",
            question: "什么是JSX？",
            answer: "JSX是JavaScript的语法扩展，允许在JavaScript代码中编写类似HTML的标记。它使React组件的编写更加直观和易读。",
            category: "语法"
        }
    ];

    const nextjsFAQ: FAQItem[] = [
        {
            id: "nextjs-1",
            question: "什么是Next.js？",
            answer: "Next.js是一个基于React的全栈框架，提供了服务端渲染、静态站点生成、API路由等功能。",
            category: "基础"
        },
        {
            id: "nextjs-2",
            question: "Next.js的主要优势是什么？",
            answer: "Next.js提供了开箱即用的SSR/SSG、自动代码分割、优化的性能、内置CSS支持等特性。",
            category: "特性"
        }
    ];

    switch (topic?.toLowerCase()) {
        case 'react':
            return reactFAQ;
        case 'next.js':
        case 'nextjs':
            return nextjsFAQ;
        default:
            return reactFAQ; // 默认返回React FAQ
    }
};

export function FAQ({
    items,
    topic,
    title = "常见问题",
    description,
    searchable = true,
    categorized = true,
    className = ""
}: FAQProps) {
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // 使用传入的items或根据topic生成默认items
    const faqItems = items || getDefaultFAQItems(topic);

    // 获取所有分类
    const categories = Array.from(new Set(faqItems.map(item => item.category).filter(Boolean)));

    // 过滤FAQ项目
    const filteredItems = faqItems.filter(item => {
        const matchesSearch = !searchQuery ||
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleItem = (id: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
        } else {
            newOpenItems.add(id);
        }
        setOpenItems(newOpenItems);
    };

    const expandAll = () => {
        setOpenItems(new Set(filteredItems.map(item => item.id)));
    };

    const collapseAll = () => {
        setOpenItems(new Set());
    };

    return (
        <div className={`max-w-4xl mx-auto ${className}`}>
            {/* 结构化数据 */}
            <FAQStructuredData
                faqItems={items.map(item => ({
                    question: item.question,
                    answer: item.answer
                }))}
            />

            {/* 标题和描述 */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {title}
                </h2>
                {description && (
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
            </div>

            {/* 搜索和过滤控件 */}
            <div className="mb-8 space-y-4">
                {searchable && (
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索问题..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* 分类过滤 */}
                    {categorized && categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === "all"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                全部
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category!)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 展开/折叠控件 */}
                    <div className="flex gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            展开全部
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            折叠全部
                        </button>
                    </div>
                </div>
            </div>

            {/* FAQ列表 */}
            <div className="space-y-4">
                {filteredItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery ? "没有找到匹配的问题" : "暂无FAQ内容"}
                        </p>
                    </div>
                ) : (
                    filteredItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => toggleItem(item.id)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                                        {item.question}
                                    </h3>
                                    {item.category && (
                                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-300">
                                            {item.category}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-shrink-0 ml-4">
                                    {openItems.has(item.id) ? (
                                        <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openItems.has(item.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-4">
                                            <div className="prose prose-sm max-w-none dark:prose-invert">
                                                <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* 统计信息 */}
            {filteredItems.length > 0 && (
                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    显示 {filteredItems.length} 个问题
                    {searchQuery && ` (搜索: "${searchQuery}")`}
                    {selectedCategory !== "all" && ` (分类: ${selectedCategory})`}
                </div>
            )}
        </div>
    );
}

// 预设的技术FAQ数据
export const TECH_FAQ_ITEMS: FAQItem[] = [
    {
        id: "react-basics",
        question: "React 的核心概念是什么？",
        answer: `
      <p>React 的核心概念包括：</p>
      <ul>
        <li><strong>组件（Components）</strong>：构建用户界面的基本单元</li>
        <li><strong>JSX</strong>：JavaScript 的语法扩展，用于描述UI结构</li>
        <li><strong>Props</strong>：组件间传递数据的方式</li>
        <li><strong>State</strong>：组件内部的状态管理</li>
        <li><strong>生命周期</strong>：组件从创建到销毁的过程</li>
        <li><strong>虚拟DOM</strong>：提高渲染性能的关键技术</li>
      </ul>
    `,
        category: "React"
    },
    {
        id: "nextjs-benefits",
        question: "为什么选择 Next.js 而不是纯 React？",
        answer: `
      <p>Next.js 相比纯 React 提供了以下优势：</p>
      <ul>
        <li><strong>服务端渲染（SSR）</strong>：更好的SEO和首屏加载性能</li>
        <li><strong>静态站点生成（SSG）</strong>：预构建页面，极快的加载速度</li>
        <li><strong>文件系统路由</strong>：基于文件结构的自动路由</li>
        <li><strong>API Routes</strong>：内置的后端API支持</li>
        <li><strong>图片优化</strong>：自动的图片优化和懒加载</li>
        <li><strong>零配置</strong>：开箱即用的开发体验</li>
      </ul>
    `,
        category: "Next.js"
    },
    {
        id: "typescript-benefits",
        question: "TypeScript 有什么优势？",
        answer: `
      <p>TypeScript 为 JavaScript 开发带来了以下好处：</p>
      <ul>
        <li><strong>类型安全</strong>：编译时发现错误，减少运行时bug</li>
        <li><strong>更好的IDE支持</strong>：智能提示、重构、导航</li>
        <li><strong>代码可读性</strong>：类型注解让代码意图更清晰</li>
        <li><strong>团队协作</strong>：统一的类型定义提高协作效率</li>
        <li><strong>渐进式采用</strong>：可以逐步从JavaScript迁移</li>
        <li><strong>现代语法支持</strong>：支持最新的ECMAScript特性</li>
      </ul>
    `,
        category: "TypeScript"
    },
    {
        id: "performance-optimization",
        question: "如何优化网站性能？",
        answer: `
      <p>网站性能优化的关键策略：</p>
      <ul>
        <li><strong>代码分割</strong>：按需加载，减少初始包大小</li>
        <li><strong>图片优化</strong>：使用现代格式（WebP、AVIF）和懒加载</li>
        <li><strong>缓存策略</strong>：合理设置浏览器和CDN缓存</li>
        <li><strong>压缩资源</strong>：Gzip/Brotli压缩CSS、JS文件</li>
        <li><strong>预加载关键资源</strong>：使用preload、prefetch</li>
        <li><strong>减少HTTP请求</strong>：合并文件、使用雪碧图</li>
        <li><strong>优化关键渲染路径</strong>：优先加载首屏内容</li>
      </ul>
    `,
        category: "性能优化"
    },
    {
        id: "seo-best-practices",
        question: "技术博客的SEO最佳实践是什么？",
        answer: `
      <p>技术博客SEO优化要点：</p>
      <ul>
        <li><strong>优质内容</strong>：原创、深入、实用的技术内容</li>
        <li><strong>关键词优化</strong>：合理使用技术关键词</li>
        <li><strong>结构化数据</strong>：使用Schema.org标记</li>
        <li><strong>页面性能</strong>：快速的加载速度</li>
        <li><strong>移动友好</strong>：响应式设计</li>
        <li><strong>内部链接</strong>：相关文章互相链接</li>
        <li><strong>社交分享</strong>：优化Open Graph标签</li>
      </ul>
    `,
        category: "SEO"
    }
];