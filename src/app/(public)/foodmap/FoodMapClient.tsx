'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { PageTitle } from '@/components/ui/PageTitle'
import { Restaurant } from '@/types/foodmap'
import { Maximize2, Minimize2, Plus, MapPin } from 'lucide-react'
import { MapControl } from '@/components/feature/foodmap/MapControl'

// 动态导入高德地图组件，避免SSR问题
const Amap = dynamic(() => import('@/components/feature/foodmap/Amap'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[600px] bg-muted rounded-lg">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-muted-foreground">加载地图中...</p>
            </div>
        </div>
    )
})


export interface FoodMapClientProps {
    initialRestaurants: Restaurant[]
}

export default function FoodMapClient({ initialRestaurants }: FoodMapClientProps) {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
    const [selectedCategory, setSelectedCategory] = useState<string>('全部')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSatelliteView, setIsSatelliteView] = useState(false)
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
    const { resolvedTheme } = useTheme()

    const mapStyle = resolvedTheme === 'dark'
        ? 'amap://styles/dark'
        : 'amap://styles/normal'


    // 获取所有分类
    const categories = useMemo(() => {
        return ['全部', ...Array.from(new Set(restaurants.map(r => r.category)))]
    }, [restaurants])

    // 过滤餐厅
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => {
            const matchesCategory = selectedCategory === '全部' || restaurant.category === selectedCategory
            const matchesSearch = searchKeyword === '' ||
                restaurant.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                restaurant.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                restaurant.tags?.some((tag: string) => tag.toLowerCase().includes(searchKeyword.toLowerCase()))

            return matchesCategory && matchesSearch
        })
    }, [restaurants, selectedCategory, searchKeyword])

    // 全屏切换
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    // 添加餐厅
    const handleAddRestaurant = () => {
        // 跳转到管理面板的餐厅管理页面
        window.location.href = '/dashboard/foodmap';
    }

    // 处理位置更新
    const handleLocationUpdate = (location: [number, number]) => {
        setUserLocation(location);
    }

    // 手动获取用户位置
    const handleGetUserLocation = () => {
        if (!navigator.geolocation) {
            alert('您的浏览器不支持地理位置功能');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location: [number, number] = [
                    position.coords.longitude,
                    position.coords.latitude
                ];
                setUserLocation(location);
                console.log('手动获取位置成功:', location);

                // 地图会自动通过 center prop 定位到新位置
                // 因为 Amap 组件会监听 center 变化并调用 setCenter
            },
            (error) => {
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
        <div className={`w-full max-w-none ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-0' : 'px-4 sm:px-6 lg:px-8'}`}>
            {/* 页面标题 */}
            {!isFullscreen && (
                <>
                    <PageTitle title="美食地图" emoji="🍕" className="text-center" />

                    <motion.p
                        className="text-xl text-muted-foreground mb-8 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        发现身边的美食宝藏，记录每一次美好的味觉体验
                    </motion.p>
                </>
            )}

            {/* 控制面板 */}
            <motion.div
                className={`mb-6 ${isFullscreen ? 'absolute top-4 left-4 right-20 z-[1000]' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <MapControl
                    searchKeyword={searchKeyword}
                    setSearchKeyword={setSearchKeyword}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    categories={categories}
                    isSatelliteView={isSatelliteView}
                    setIsSatelliteView={setIsSatelliteView}
                    filteredCount={filteredRestaurants.length}
                    totalCount={restaurants.length}
                />
            </motion.div>

            {/* 地图容器 */}
            <motion.div
                className={`relative ${isFullscreen ? 'h-screen' : 'h-[600px]'} w-full`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm h-full">
                    <Amap
                        restaurants={filteredRestaurants}
                        mapStyle={mapStyle}
                        showSatellite={isSatelliteView}
                        center={userLocation || undefined}
                        onLocationUpdate={handleLocationUpdate}
                    />

                    {/* 地图控制按钮 */}
                    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                        <button
                            onClick={toggleFullscreen}
                            className="bg-background border border-border p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-accent"
                            title={isFullscreen ? "退出全屏" : "全屏显示"}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="h-5 w-5 text-foreground" />
                            ) : (
                                <Maximize2 className="h-5 w-5 text-foreground" />
                            )}
                        </button>

                        <button
                            onClick={handleGetUserLocation}
                            className="bg-background border border-border p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-accent"
                            title="定位到当前位置"
                        >
                            <MapPin className="h-5 w-5" />
                        </button>

                        <button
                            onClick={handleAddRestaurant}
                            className="bg-background border border-border p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-accent"
                            title="添加餐厅"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
