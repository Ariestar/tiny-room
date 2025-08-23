'use client'

import { useState } from 'react'
import { PageTitle } from '@/components/ui/PageTitle'
import { RestaurantTable } from '@/components/feature/dashboard/RestaurantTable'
import { SimpleRestaurantForm } from '@/components/feature/dashboard/SimpleRestaurantForm'
import type { Restaurant } from '@/types/foodmap'

// API 输入数据类型（tags 是字符串而不是数组）
type RestaurantApiInput = Omit<Restaurant, 'id' | 'tags'> & {
    tags?: string
}

export default function DashboardFoodMapPage() {
    const [showForm, setShowForm] = useState(false)
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | undefined>(undefined)
    const [refreshKey, setRefreshKey] = useState(0)

    const handleAddRestaurant = () => {
        setEditingRestaurant(undefined)
        setShowForm(true)
    }

    const handleEditRestaurant = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant)
        setShowForm(true)
    }

    const handleDeleteRestaurant = async (restaurantId: string) => {
        if (!confirm('确定要删除这家餐厅吗？')) {
            return
        }

        try {
            const response = await fetch(`/api/food-map/restaurants/${restaurantId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                // 刷新表格数据
                setRefreshKey(prev => prev + 1)
            } else {
                alert('删除失败，请重试')
            }
        } catch (error) {
            console.error('删除餐厅失败:', error)
            alert('删除失败，请重试')
        }
    }

    const handleFormSubmit = async (restaurantData: RestaurantApiInput) => {
        try {
            const url = editingRestaurant
                ? `/api/food-map/restaurants/${editingRestaurant.id}`
                : '/api/food-map/restaurants'

            const method = editingRestaurant ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(restaurantData),
            })

            if (response.ok) {
                setShowForm(false)
                setEditingRestaurant(undefined)
                // 刷新表格数据
                setRefreshKey(prev => prev + 1)
            } else {
                const errorData = await response.json()
                alert(`${editingRestaurant ? '更新' : '添加'}失败: ${errorData.error || '未知错误'}`)
            }
        } catch (error) {
            console.error('操作失败:', error)
            alert(`${editingRestaurant ? '更新' : '添加'}失败，请重试`)
        }
    }

    const handleFormCancel = () => {
        setShowForm(false)
        setEditingRestaurant(undefined)
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <PageTitle title="美食地图管理" emoji="🗺️" />
                <p className="text-muted-foreground mt-2">
                    管理您的美食收藏，添加、编辑和组织餐厅信息
                </p>
            </div>

            {showForm ? (
                <div className="mb-8">
                    <h2 className="text-lg font-medium mb-4">
                        {editingRestaurant ? '编辑餐厅' : '添加新餐厅'}
                    </h2>
                    <SimpleRestaurantForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleFormCancel}
                        initialData={editingRestaurant}
                    />
                </div>
            ) : (
                <RestaurantTable
                    key={refreshKey}
                    onAdd={handleAddRestaurant}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                />
            )}
        </div>
    )
}
