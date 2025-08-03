"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

interface SearchResult {
    id: string;
    title: string;
    excerpt: string;
    url: string;
    type: 'post' | 'project' | 'page';
    tags?: string[];
    date?: string;
}

interface SearchBoxProps {
    placeholder?: string;
    className?: string;
    variant?: "default" | "minimal" | "floating";
    showResults?: boolean;
    onSearch?: (query: string, results: SearchResult[]) => void;
    onResultClick?: (result: SearchResult) => void;
}

// 搜索图标
const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

// 清除图标
const ClearIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// 模拟搜索数据（实际项目中应该从API获取）
const mockSearchData: SearchResult[] = [
    {
        id: "1",
        title: "React Hooks 完全指南",
        excerpt: "深入理解 React Hooks 的工作原理和最佳实践...",
        url: "/blog/react-hooks-guide",
        type: "post",
        tags: ["React", "JavaScript", "前端"],
        date: "2024-01-15",
    },
    {
        id: "2",
        title: "Next.js 性能优化技巧",
        excerpt: "提升 Next.js 应用性能的实用技巧和方法...",
        url: "/blog/nextjs-performance",
        type: "post",
        tags: ["Next.js", "性能优化", "React"],
        date: "2024-01-10",
    },
    {
        id: "3",
        title: "个人博客系统",
        excerpt: "基于 Next.js 和 TypeScript 构建的现代化博客系统...",
        url: "/projects/blog-system",
        type: "project",
        tags: ["Next.js", "TypeScript", "博客"],
        date: "2024-01-05",
    },
];

export function SearchBox({
    placeholder = "搜索文章、项目...",
    className = "",
    variant = "default",
    showResults = true,
    onSearch,
    onResultClick,
}: SearchBoxProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 防抖搜索
    const debouncedSearch = useCallback(
        debounce(async (searchQuery: string) => {
            if (!searchQuery.trim()) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            try {
                // 模拟搜索API调用
                await new Promise(resolve => setTimeout(resolve, 300));
                const filteredResults = mockSearchData.filter(item =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                setResults(filteredResults);
                setSelectedIndex(-1);

                // 记录搜索行为
                await fetch('/api/analytics/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: searchQuery,
                        results: filteredResults.length,
                        sessionId,
                        timestamp: new Date().toISOString(),
                    }),
                }).catch(console.error);

                onSearch?.(searchQuery, filteredResults);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        [onSearch, sessionId]
    );

    // 处理输入变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setIsLoading(true);
        debouncedSearch(value);
    };

    // 处理键盘导航
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < results.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleResultClick(results[selectedIndex]);
                } else if (query.trim()) {
                    // 执行搜索页面跳转
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    // 处理结果点击
    const handleResultClick = async (result: SearchResult) => {
        // 记录点击行为
        await fetch('/api/analytics/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                results: results.length,
                clickedResult: result.url,
                sessionId,
                timestamp: new Date().toISOString(),
            }),
        }).catch(console.error);

        onResultClick?.(result);
        router.push(result.url);
        setIsOpen(false);
        setQuery("");
    };

    // 清除搜索
    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    // 点击外部关闭
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                inputRef.current &&
                resultsRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                !resultsRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 样式配置
    const getInputStyles = () => {
        const baseStyles = "w-full pl-10 pr-10 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

        switch (variant) {
            case "minimal":
                return `${baseStyles} bg-transparent border-none focus:ring-1`;
            case "floating":
                return `${baseStyles} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg`;
            default:
                return `${baseStyles} bg-white dark:bg-gray-800`;
        }
    };

    const getContainerStyles = () => {
        switch (variant) {
            case "floating":
                return "fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50";
            default:
                return "relative w-full max-w-2xl";
        }
    };

    return (
        <div className={`${getContainerStyles()} ${className}`}>
            {/* 搜索输入框 */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={getInputStyles()}
                    autoComplete="off"
                />
                {/* 清除按钮 */}
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ClearIcon className="h-5 w-5" />
                    </button>
                )}
                {/* 加载指示器 */}
                {isLoading && (
                    <div className="absolute inset-y-0 right-8 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {/* 搜索结果 */}
            <AnimatePresence>
                {isOpen && showResults && (query || results.length > 0) && (
                    <motion.div
                        ref={resultsRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                    >
                        {results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <motion.button
                                        key={result.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleResultClick(result)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* 类型图标 */}
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${result.type === 'post'
                                                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                    : result.type === 'project'
                                                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                }`}>
                                                {result.type === 'post' ? '文' : result.type === 'project' ? '项' : '页'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {result.title}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {result.excerpt}
                                                </p>
                                                {result.tags && (
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {result.tags.slice(0, 3).map(tag => (
                                                            <span
                                                                key={tag}
                                                                className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        ) : query && !isLoading ? (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <SearchIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>没有找到相关内容</p>
                                <p className="text-sm mt-1">试试其他关键词</p>
                            </div>
                        ) : null}

                        {/* 搜索建议 */}
                        {query && results.length === 0 && !isLoading && (
                            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">搜索建议：</p>
                                <div className="flex flex-wrap gap-2">
                                    {['React', 'Next.js', 'TypeScript', '性能优化'].map(suggestion => (
                                        <button
                                            key={suggestion}
                                            onClick={() => {
                                                setQuery(suggestion);
                                                debouncedSearch(suggestion);
                                            }}
                                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 预设组件
export function HeaderSearchBox({ className = "" }: { className?: string }) {
    return (
        <SearchBox
            placeholder="搜索..."
            variant="minimal"
            className={className}
        />
    );
}

export function FloatingSearchBox({ className = "" }: { className?: string }) {
    return (
        <SearchBox
            placeholder="搜索文章、项目..."
            variant="floating"
            className={className}
        />
    );
}