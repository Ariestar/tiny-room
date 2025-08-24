'use client'

import { Search, Filter, Satellite, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

interface MapControlProps {
    searchKeyword: string
    setSearchKeyword: (keyword: string) => void
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    categories: string[]
    isSatelliteView: boolean
    setIsSatelliteView: (isSatellite: boolean) => void
    filteredCount: number
    totalCount: number
}

export const MapControl = ({
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    categories,
    isSatelliteView,
    setIsSatelliteView,
    filteredCount,
    totalCount
}: MapControlProps) => {
    const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword)
    const searchTimeoutRef = useRef<NodeJS.Timeout>()

    // 防抖搜索 - 600ms防抖
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearchKeyword(localSearchKeyword)
        }, 600)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [localSearchKeyword, setSearchKeyword])

    // 同步外部搜索关键词变化
    useEffect(() => {
        setLocalSearchKeyword(searchKeyword)
    }, [searchKeyword])

    return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
                {/* 搜索框 */}
                <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="搜索餐厅、菜系、标签..."
                        value={localSearchKeyword}
                        onChange={(e) => setLocalSearchKeyword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    />
                </div>

                {/* 分类筛选 */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:ring-2 focus:ring-ring focus:border-transparent">
                                <span>{selectedCategory}</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-32">
                            {categories.map(category => (
                                <DropdownMenuItem
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`cursor-pointer ${selectedCategory === category ? '!bg-gray-200 !text-gray-900 dark:!bg-gray-700 dark:!text-gray-100' : ''}`}
                                    data-selected={selectedCategory === category}
                                >
                                    {category}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* 卫星/街道切换按钮 */}
                <button
                    onClick={() => setIsSatelliteView(!isSatelliteView)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${isSatelliteView
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                >
                    <Satellite className="h-4 w-4" />
                    <span>{isSatelliteView ? '街道' : '卫星'}</span>
                </button>

                {/* 统计信息 */}
                <div className="text-sm text-muted-foreground">
                    显示 <span className="font-semibold text-primary">{filteredCount}</span> / {totalCount} 家餐厅
                </div>
            </div>
        </div>
    )
}
