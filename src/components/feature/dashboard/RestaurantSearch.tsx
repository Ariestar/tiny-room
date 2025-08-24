'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Phone, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchResult {
    id: string
    name: string
    address: string
    coordinates: [number, number]
    phone: string
    type: string
    distance: string
}

interface RestaurantSearchProps {
    onSelect: (result: SearchResult) => void
    className?: string
    userLocation?: [number, number] | null // 用户位置
}

export function RestaurantSearch({ onSelect, className = '', userLocation }: RestaurantSearchProps) {
    const [keyword, setKeyword] = useState('')
    const [results, setResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [error, setError] = useState('')
    const [hasSelected, setHasSelected] = useState(false) // 跟踪是否已选择餐厅
    const searchTimeoutRef = useRef<NodeJS.Timeout>()
    const containerRef = useRef<HTMLDivElement>(null)

    // 搜索函数
    const searchRestaurants = async (searchKeyword: string) => {
        if (!searchKeyword.trim()) {
            setResults([])
            setError('')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            // 构建搜索URL，优先使用用户位置
            let searchUrl = `/api/amap/search?keyword=${encodeURIComponent(searchKeyword)}`;

            if (userLocation) {
                // 使用用户位置进行周边搜索
                searchUrl += `&location=${userLocation[0]},${userLocation[1]}&radius=10000`; // 10km范围
                console.log('使用用户位置搜索:', userLocation);
            } else {
                console.log('用户位置不可用，进行全国搜索');
            }

            const response = await fetch(searchUrl);
            const data = await response.json()

            if (data.success) {
                setResults(data.results)
                setShowResults(true)
            } else {
                setError(data.error || '搜索失败')
                setResults([])
            }
        } catch (err) {
            console.error('搜索API调用失败:', err)
            setError('搜索服务暂时不可用，请检查网络连接或稍后重试')
            setResults([])
        } finally {
            setIsLoading(false)
        }
    }

    // 防抖搜索 - 增加到800ms防抖
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        if (keyword.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                searchRestaurants(keyword)
            }, 800)
        } else {
            setResults([])
            setShowResults(false)
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [keyword])

    // 点击外部关闭结果列表
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // 选择结果
    const handleSelect = (result: SearchResult) => {
        onSelect(result)
        setKeyword(result.name)
        setShowResults(false)
        setHasSelected(true) // 标记已选择餐厅
        // 清空搜索结果，防止再次聚焦时重新显示
        setResults([])
    }

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* 搜索输入框 */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value)
                        // 用户开始输入时，重置选择状态
                        if (hasSelected) {
                            setHasSelected(false)
                        }
                    }}
                    placeholder="搜索餐厅名称或地址..."
                    className="pl-9 pr-10"
                    onFocus={() => {
                        // 只有在有搜索结果、用户正在输入且未选择餐厅时才显示
                        if (results.length > 0 && keyword.trim() && !hasSelected) {
                            setShowResults(true)
                        }
                    }}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* 错误提示 */}
            {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            {/* 搜索结果列表 */}
            <AnimatePresence>
                {showResults && results.length > 0 && !hasSelected && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                    >
                        {results.map((result, index) => (
                            <motion.div
                                key={result.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                                onClick={() => handleSelect(result)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm text-foreground truncate">
                                            {result.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {result.address}
                                        </p>
                                        {result.phone && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Phone className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {result.phone}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {result.type}
                                            </span>
                                            {result.distance && (
                                                <span className="text-xs text-muted-foreground">
                                                    {result.distance}米
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 无结果提示 */}
            {showResults && !isLoading && results.length === 0 && keyword.trim() && !error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 p-4"
                >
                    <p className="text-sm text-muted-foreground text-center">
                        未找到相关餐厅，请尝试其他关键词
                    </p>
                </motion.div>
            )}
        </div>
    )
}
