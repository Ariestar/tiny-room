import { Suspense } from 'react'
import { Metadata } from 'next'
import FoodMapClient, { FoodMapClientProps } from './FoodMapClient'
import Loading from '@/components/ui/Loading'
import { Restaurant } from '@/types/foodmap'

export const metadata: Metadata = {
    title: '美食地图',
    description: '发现和分享身边的美食店铺，记录每一次美好的味觉体验',
    keywords: ['美食地图', '餐厅推荐', '美食分享', '本地美食'],
}

async function getRestaurants(): Promise<Restaurant[]> {
    // 在实际应用中，这里会是一个fetch调用
    // 例如: const res = await fetch('/api/restaurants'); const data = await res.json(); return data;
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
    return sampleRestaurants;
}


export default async function FoodMapPage() {
    const initialRestaurants = await getRestaurants();

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading size="xl" />
                </div>
            }
        >
            <FoodMapClient initialRestaurants={initialRestaurants} />
        </Suspense>
    )
}
