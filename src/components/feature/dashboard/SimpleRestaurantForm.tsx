'use client'

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { Restaurant, FoodCategory } from '@/types/foodmap'

// API 输入数据类型（tags 是字符串而不是数组）
type RestaurantApiInput = Omit<Restaurant, 'id' | 'tags'> & {
    tags?: string
}

const categories: FoodCategory[] = [
    "川菜", "粤菜", "湘菜", "鲁菜", "苏菜", "浙菜", "闽菜", "徽菜",
    "北京菜", "东北菜", "西北菜", "火锅", "烧烤", "日料", "韩料",
    "西餐", "快餐", "小吃", "甜品", "咖啡", "酒吧", "面食",
    "小笼包", "麻辣小龙虾", "其他"
]

const priceRanges = ["¥0-30", "¥30-60", "¥60-100", "¥100-200", "¥200+"]

interface SimpleRestaurantFormProps {
    onSubmit: (restaurant: RestaurantApiInput) => void
    onCancel: () => void
    initialData?: Restaurant
}

export function SimpleRestaurantForm({ onSubmit, onCancel, initialData }: SimpleRestaurantFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        category: initialData?.category || categories[0],
        address: initialData?.address || '',
        coordinates: initialData?.coordinates || [116.397428, 39.90923] as [number, number],
        rating: initialData?.rating?.toString() || '',
        priceRange: initialData?.priceRange || priceRanges[0],
        description: initialData?.description || '',
        phone: initialData?.phone || '',
        openingHours: initialData?.openingHours || '',
        website: initialData?.website || '',
        tags: initialData?.tags?.join(', ') || '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = '餐厅名称不能为空'
        } else if (formData.name.length < 2) {
            newErrors.name = '餐厅名称至少需要2个字符'
        }

        if (!formData.address.trim()) {
            newErrors.address = '地址不能为空'
        } else if (formData.address.length < 5) {
            newErrors.address = '地址至少需要5个字符'
        }

        if (formData.rating && (isNaN(Number(formData.rating)) || Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
            newErrors.rating = '评分必须是0-5之间的数字'
        }

        if (formData.website && formData.website.trim() && !isValidUrl(formData.website)) {
            newErrors.website = '请输入有效的网址'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const isValidUrl = (url: string) => {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            const restaurantData: RestaurantApiInput = {
                name: formData.name.trim(),
                category: formData.category as FoodCategory,
                address: formData.address.trim(),
                coordinates: formData.coordinates,
                rating: formData.rating ? Number(formData.rating) : undefined,
                priceRange: formData.priceRange,
                description: formData.description.trim() || undefined,
                phone: formData.phone.trim() || undefined,
                openingHours: formData.openingHours.trim() || undefined,
                website: formData.website.trim() || "",
                tags: formData.tags ? formData.tags.trim() : undefined,
            }

            await onSubmit(restaurantData)
        } catch (error) {
            console.error('提交失败:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 餐厅名称 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            餐厅名称 <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('name', e.target.value)}
                            placeholder="请输入餐厅名称"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* 分类 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">分类</label>
                        <select
                            value={formData.category}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 评分 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">评分 (0-5)</label>
                        <Input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('rating', e.target.value)}
                            placeholder="如: 4.5"
                            className={errors.rating ? 'border-red-500' : ''}
                        />
                        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>

                    {/* 价格区间 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">价格区间</label>
                        <select
                            value={formData.priceRange}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('priceRange', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                        >
                            {priceRanges.map((range) => (
                                <option key={range} value={range}>
                                    {range}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 电话 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">电话</label>
                        <Input
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('phone', e.target.value)}
                            placeholder="如: 010-12345678"
                        />
                    </div>

                    {/* 网址 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">网址</label>
                        <Input
                            value={formData.website}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('website', e.target.value)}
                            placeholder="如: https://example.com"
                            className={errors.website ? 'border-red-500' : ''}
                        />
                        {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                    </div>
                </div>

                {/* 地址 */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        地址 <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                        placeholder="请输入详细地址"
                        className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* 营业时间 */}
                <div>
                    <label className="block text-sm font-medium mb-1">营业时间</label>
                    <Input
                        value={formData.openingHours}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('openingHours', e.target.value)}
                        placeholder="如: 周一至周日 09:00-22:00"
                    />
                </div>

                {/* 标签 */}
                <div>
                    <label className="block text-sm font-medium mb-1">标签</label>
                    <Input
                        value={formData.tags}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('tags', e.target.value)}
                        placeholder="用逗号分隔，如: 环境好, 服务佳, 性价比高"
                    />
                </div>

                {/* 描述 */}
                <div>
                    <label className="block text-sm font-medium mb-1">描述</label>
                    <Textarea
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                        placeholder="描述这家餐厅的特色、推荐菜品等..."
                        rows={3}
                    />
                </div>

                {/* 按钮 */}
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        取消
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? '保存中...' : (initialData ? '更新' : '添加')}
                    </Button>
                </div>
            </form>
        </Card>
    )
}
