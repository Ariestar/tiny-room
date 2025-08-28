'use client'

import React, { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import { RestaurantSearch } from './RestaurantSearch'
import type { Restaurant, FoodCategory, VisitStatus } from '@/types/foodmap'
import { ChevronDown } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'

// API 输入数据类型（tags 是字符串而不是数组）
type RestaurantApiInput = Omit<Restaurant, 'id' | 'tags' | 'category'> & {
    tags?: string
}

// 常用标签建议，用户可以自由选择和组合
const suggestedTags = [
    // 菜系标签
    "川菜", "粤菜", "湘菜", "鲁菜", "苏菜", "浙菜", "闽菜", "徽菜",
    "北京菜", "东北菜", "西北菜", "新疆菜", "云南菜", "贵州菜", "广西菜", "海南菜",
    // 特色标签
    "火锅", "烧烤", "烤肉", "麻辣烫", "串串香", "冒菜", "干锅", "铁板烧",
    // 国际标签
    "日料", "韩料", "西餐", "意餐", "法餐", "美式", "泰餐", "越南菜", "印度菜", "中东菜",
    // 场景标签
    "快餐", "面食", "包子", "饺子", "馄饨", "煎饼", "炸鸡", "汉堡", "披萨",
    "甜品", "咖啡", "奶茶", "果汁", "冰淇淋", "蛋糕", "面包", "酒吧", "清吧",
    // 特色标签
    "小龙虾", "海鲜", "素食", "清真", "有机", "无麸质", "麻辣", "清淡", "重口味"
];

const priceRanges = ["¥0-30", "¥30-60", "¥60-100", "¥100-200", "¥200+"]

interface RestaurantFormProps {
    onSubmit: (restaurant: RestaurantApiInput) => void
    onCancel: () => void
    initialData?: Restaurant
}

export function RestaurantForm({ onSubmit, onCancel, initialData }: RestaurantFormProps) {
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

    const [formData, setFormData] = useState({
        name: initialData?.name?.toString() || '',
        visitStatus: initialData?.visitStatus || '未去',
        address: initialData?.address?.toString() || '',
        coordinates: initialData?.coordinates || [116.397428, 39.90923] as [number, number],
        rating: initialData?.rating?.toString() || '',
        priceRange: initialData?.priceRange?.toString() || priceRanges[0],
        description: initialData?.description?.toString() || '',
        phone: initialData?.phone?.toString() || '',
        openingHours: initialData?.openingHours?.toString() || '',
        website: initialData?.website?.toString() || '',
        tags: initialData?.tags?.join(', ') || '',
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // 获取用户位置
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords
                    setUserLocation([longitude, latitude])
                    console.log('获取到用户位置:', [longitude, latitude])
                },
                (error) => {
                    console.log('获取用户位置失败:', error.message)
                    setUserLocation(null)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            )
        } else {
            console.log('浏览器不支持地理位置')
            setUserLocation(null)
        }
    }, [])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    // 处理搜索选择
    const handleSearchSelect = (result: any) => {
        setFormData(prev => ({
            ...prev,
            name: result.name?.toString() || '',
            address: result.address?.toString() || '',
            coordinates: result.coordinates,
            phone: result.phone?.toString() || prev.phone
        }))

        // 清除相关错误
        setErrors(prev => ({
            ...prev,
            name: '',
            address: '',
            coordinates: ''
        }))
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

        // 验证坐标
        if (isNaN(formData.coordinates[0]) || isNaN(formData.coordinates[1])) {
            newErrors.coordinates = '坐标必须是有效的数字'
        } else if (formData.coordinates[0] < 73 || formData.coordinates[0] > 135 ||
            formData.coordinates[1] < 18 || formData.coordinates[1] > 54) {
            newErrors.coordinates = '坐标超出中国范围，请检查输入'
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
                name: formData.name?.toString().trim() || '',
                visitStatus: formData.visitStatus,
                address: formData.address?.toString().trim() || '',
                coordinates: formData.coordinates,
                rating: formData.rating ? Number(formData.rating) : undefined,
                priceRange: formData.priceRange,
                description: formData.description?.toString().trim() || undefined,
                phone: formData.phone?.toString().trim() || undefined,
                openingHours: formData.openingHours?.toString().trim() || undefined,
                website: formData.website?.toString().trim() || "",
                tags: formData.tags?.toString().trim() || undefined,
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
                {/* 餐厅搜索 */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        搜索餐厅 <span className="text-blue-500">💡</span>
                    </label>
                    <RestaurantSearch onSelect={handleSearchSelect} userLocation={userLocation} />
                    <p className="text-xs text-muted-foreground mt-1">
                        输入餐厅名称或地址，自动获取准确位置信息
                    </p>
                </div>

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

                    {/* 标签 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">标签</label>
                        <Input
                            value={formData.tags}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('tags', e.target.value)}
                            placeholder="用逗号分隔，如: 川菜, 火锅, 麻辣, 适合聚餐"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            常用标签：川菜、粤菜、火锅、烧烤、日料、西餐、快餐、甜品、咖啡等
                        </p>
                    </div>

                    {/* 访问状态 */}
                    <div>
                        <label className="block text-sm font-medium mb-1">是否已去</label>
                        <div className="flex items-center space-x-4">
                            <Checkbox
                                size="sm"
                                id="visitStatus"
                                checked={formData.visitStatus === '已去'}
                                onChange={(e) => handleInputChange('visitStatus', e.target.checked ? '已去' : '未去')}
                            />
                        </div>
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full flex items-center justify-between px-3 py-2 border border-input rounded-md bg-background text-sm hover:bg-accent hover:text-accent-foreground transition-colors focus:ring-2 focus:ring-ring focus:border-transparent">
                                    <span>{formData.priceRange}</span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-full min-w-[200px]">
                                {priceRanges.map((range) => (
                                    <DropdownMenuItem
                                        key={range}
                                        onClick={() => handleInputChange('priceRange', range)}
                                        className={`cursor-pointer ${formData.priceRange === range ? '!bg-accent !text-accent-foreground' : ''}`}
                                        data-selected={formData.priceRange === range}
                                    >
                                        {range}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
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

                {/* 地址和坐标 */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            地址 <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={formData.address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                            placeholder="请输入详细地址，如：北京市朝阳区三里屯路19号"
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* 坐标输入 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                经度 <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.000001"
                                value={formData.coordinates[0]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newCoordinates: [number, number] = [
                                        parseFloat(e.target.value) || 0,
                                        formData.coordinates[1]
                                    ];
                                    setFormData(prev => ({ ...prev, coordinates: newCoordinates }));
                                }}
                                placeholder="如：116.397428"
                                className="text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">北京范围：115.7-117.4</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                纬度 <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                step="0.000001"
                                value={formData.coordinates[1]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newCoordinates: [number, number] = [
                                        formData.coordinates[0],
                                        parseFloat(e.target.value) || 0
                                    ];
                                    setFormData(prev => ({ ...prev, coordinates: newCoordinates }));
                                }}
                                placeholder="如：39.90923"
                                className="text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">北京范围：39.4-41.1</p>
                        </div>
                    </div>

                    {/* 坐标说明 */}
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            💡 <strong>坐标获取方法：</strong>
                        </p>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                            <li>• 使用上方搜索功能，自动获取准确坐标</li>
                            <li>• 或手动在百度地图/高德地图中搜索地址，右键点击位置获取坐标</li>
                            <li>• 使用在线坐标转换工具</li>
                            <li>• 格式：经度在前，纬度在后（如：116.397428, 39.90923）</li>
                        </ul>
                    </div>

                    {/* 坐标错误提示 */}
                    {errors.coordinates && (
                        <p className="text-red-500 text-xs">{errors.coordinates}</p>
                    )}
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
