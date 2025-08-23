import { Suspense } from 'react'
import { Metadata } from 'next'
import FoodMapClient from './FoodMapClient'
import Loading from '@/components/ui/Loading'

export const metadata: Metadata = {
    title: '美食地图 | Tiny Room',
    description: '发现和分享身边的美食店铺，记录每一次美好的味觉体验',
    keywords: ['美食地图', '餐厅推荐', '美食分享', '本地美食'],
}

export default function FoodMapPage() {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-[80vh]">
                    <Loading size="xl" />
                </div>
            }
        >
            <FoodMapClient />
        </Suspense>
    )
}
