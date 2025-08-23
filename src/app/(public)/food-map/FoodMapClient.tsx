'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { PageTitle } from '@/components/ui/PageTitle'
import { Restaurant } from '@/types/food-map'
import { Maximize2, Minimize2, Plus } from 'lucide-react'
import { MapControl } from '@/components/feature/food-map/MapControl'

// 动态导入高德地图组件，避免SSR问题
const Amap = dynamic(() => import('@/components/feature/food-map/Amap'), {
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

// 示例数据
const sampleRestaurants: Restaurant[] = [
    {
        id: '1',
        name: '老北京炸酱面',
        category: '北京菜',
        coordinates: [39.9042, 116.4074],
        address: '北京市东城区南锣鼓巷123号',
        rating: 4.5,
        priceRange: '¥30-50',
        description: '正宗老北京味道，炸酱面特别香！传承三代的老手艺，每天现做酱料。',
        tags: ['面食', '北京菜', '老字号', '传统'],
        phone: '010-12345678',
        openingHours: '11:00-21:00',
        website: 'https://example.com'
    },
    {
        id: '2',
        name: '川味小厨',
        category: '川菜',
        coordinates: [39.9122, 116.4142],
        address: '北京市东城区鼓楼大街456号',
        rating: 4.8,
        priceRange: '¥50-80',
        description: '正宗川菜，麻辣鲜香，回锅肉必点！地道四川师傅掌勺，口味绝对正宗。',
        tags: ['川菜', '麻辣', '下饭菜', '人气'],
        phone: '010-87654321',
        openingHours: '10:30-22:00'
    },
    {
        id: '3',
        name: '海底捞火锅',
        category: '火锅',
        coordinates: [39.8962, 116.3978],
        address: '北京市西城区西单大悦城B1层',
        rating: 4.2,
        priceRange: '¥80-120',
        description: '服务好，环境佳，适合聚餐。24小时营业，服务贴心周到。',
        tags: ['火锅', '聚餐', '服务好', '24h'],
        phone: '010-66666666',
        openingHours: '24小时营业',
        website: 'https://haidilao.com'
    },
    {
        id: '4',
        name: '鼎泰丰',
        category: '小笼包',
        coordinates: [39.9176, 116.4060],
        address: '北京市东城区王府井大街88号',
        rating: 4.7,
        priceRange: '¥60-100',
        description: '台湾知名连锁，小笼包皮薄汁多。现包现蒸，每个包子都是艺术品。',
        tags: ['小笼包', '台湾菜', '精致', '连锁'],
        phone: '010-55555555',
        openingHours: '11:00-21:30'
    },
    {
        id: '5',
        name: '胡大饭馆',
        category: '麻辣小龙虾',
        coordinates: [39.9388, 116.4180],
        address: '北京市东城区簋街13号',
        rating: 4.6,
        priceRange: '¥70-150',
        description: '簋街网红小龙虾，麻辣鲜香停不下来！深夜食堂的不二选择。',
        tags: ['小龙虾', '簋街', '夜宵', '网红'],
        phone: '010-77777777',
        openingHours: '17:00-02:00'
    }
]

export default function FoodMapClient() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>(sampleRestaurants)
    const [selectedCategory, setSelectedCategory] = useState<string>('全部')
    const [searchKeyword, setSearchKeyword] = useState('')
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isSatelliteView, setIsSatelliteView] = useState(false)
    const { resolvedTheme } = useTheme()

    const mapStyle = resolvedTheme === 'dark'
        ? 'amap://styles/dark'
        : 'amap://styles/normal'


    // 获取所有分类
    const categories = ['全部', ...Array.from(new Set(restaurants.map(r => r.category)))]

    // 过滤餐厅
    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesCategory = selectedCategory === '全部' || restaurant.category === selectedCategory
        const matchesSearch = searchKeyword === '' ||
            restaurant.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            restaurant.description?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            restaurant.tags?.some(tag => tag.toLowerCase().includes(searchKeyword.toLowerCase()))

        return matchesCategory && matchesSearch
    })

    // 全屏切换
    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    // 添加餐厅
    const handleAddRestaurant = () => {
        alert('添加餐厅功能开发中...')
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
                            onClick={handleAddRestaurant}
                            className="bg-primary hover:bg-primary/90 p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-primary-foreground"
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
