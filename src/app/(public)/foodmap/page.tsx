import { Suspense } from 'react'
import { Metadata } from 'next'
import FoodMapClient, { FoodMapClientProps } from './FoodMapClient'
import Loading from '@/components/ui/Loading'
import { Restaurant } from '@/types/foodmap'

export const metadata: Metadata = {
    title: 'Foodmap',
    description: '发现和分享身边的美食店铺，记录每一次美好的味觉体验',
    keywords: ['美食地图', '餐厅推荐', '美食分享', '本地美食'],
}

async function getRestaurants(): Promise<Restaurant[]> {
    try {
        // 调用真实的API获取餐厅数据
        const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/food-map/restaurants`, {
            cache: 'no-store' // 禁用缓存，确保获取最新数据
        });

        if (!res.ok) {
            console.error('Failed to fetch restaurants:', res.status, res.statusText);
            return []; // 如果API失败，返回空数组
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return []; // 如果出现错误，返回空数组
    }
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
