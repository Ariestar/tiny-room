'use client'

import { Search, Filter, Satellite, MapPin, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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
    userLocation?: [number, number] | null
    onLocationUpdate?: (location: [number, number]) => void
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
    totalCount,
    userLocation,
    onLocationUpdate
}: MapControlProps) => {
    const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword)
    const [isGettingLocation, setIsGettingLocation] = useState(false)
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

    // 获取用户位置
    const getUserLocation = () => {
        if (!navigator.geolocation) {
            alert('您的浏览器不支持地理位置功能');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location: [number, number] = [
                    position.coords.longitude,
                    position.coords.latitude
                ];
                onLocationUpdate?.(location);
                setIsGettingLocation(false);
                console.log('位置获取成功:', location);
            },
            (error) => {
                setIsGettingLocation(false);
                let errorMessage = '无法获取位置信息';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = '位置访问被拒绝，请在浏览器设置中允许位置访问';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = '位置信息不可用';
                        break;
                    case error.TIMEOUT:
                        errorMessage = '获取位置信息超时';
                        break;
                }
                alert(errorMessage);
                console.error('位置获取失败:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5分钟缓存
            }
        );
    }
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
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 获取位置按钮 */}
                <button
                    onClick={getUserLocation}
                    disabled={isGettingLocation}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${userLocation
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={userLocation ? '已获取位置' : '获取当前位置'}
                >
                    {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MapPin className="h-4 w-4" />
                    )}
                    <span>{isGettingLocation ? '定位中...' : userLocation ? '已定位' : '定位'}</span>
                </button>

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
