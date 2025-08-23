'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { ChevronDown, ChevronUp, Edit2, Trash2, Search, Plus } from 'lucide-react'
import type { Restaurant, FoodCategory } from '@/types/foodmap'

// 餐厅数据列定义
const columnHelper = createColumnHelper<Restaurant>()

interface RestaurantTableProps {
    onEdit?: (restaurant: Restaurant) => void
    onDelete?: (restaurantId: string) => void
    onAdd?: () => void
}

export function RestaurantTable({ onEdit, onDelete, onAdd }: RestaurantTableProps) {
    const [data, setData] = useState<Restaurant[]>([])
    const [loading, setLoading] = useState(true)
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')

    // 获取餐厅数据
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await fetch('/api/food-map/restaurants')
                if (response.ok) {
                    const restaurants = await response.json()
                    setData(restaurants)
                }
            } catch (error) {
                console.error('获取餐厅数据失败:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchRestaurants()
    }, [])

    // 定义表格列
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: '餐厅名称',
            cell: info => (
                <div className="font-medium">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('category', {
            header: '分类',
            cell: info => (
                <Badge variant="secondary">
                    {info.getValue()}
                </Badge>
            ),
            filterFn: 'equals',
        }),
        columnHelper.accessor('address', {
            header: '地址',
            cell: info => (
                <div className="max-w-[200px] truncate text-sm text-muted-foreground">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('rating', {
            header: '评分',
            cell: info => {
                const rating = info.getValue()
                return rating ? (
                    <div className="flex items-center">
                        <span className="mr-1">⭐</span>
                        <span>{rating.toFixed(1)}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">未评分</span>
                )
            },
        }),
        columnHelper.accessor('priceRange', {
            header: '价格',
            cell: info => info.getValue() || '未知',
        }),
        columnHelper.display({
            id: 'actions',
            header: '操作',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(row.original)}
                        className="h-8 w-8 p-0"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete?.(row.original.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ], [onEdit, onDelete])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    // 获取所有分类用于筛选
    const categories = useMemo(() => {
        const categorySet = new Set(data.map(r => r.category))
        return Array.from(categorySet)
    }, [data])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="text-muted-foreground">加载中...</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* 工具栏 */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    {/* 搜索框 */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜索餐厅..."
                            value={globalFilter ?? ''}
                            onChange={(event) => setGlobalFilter(String(event.target.value))}
                            className="pl-9 w-[200px]"
                        />
                    </div>

                    {/* 分类筛选 */}
                    <select
                        value={(table.getColumn('category')?.getFilterValue() as string) ?? ''}
                        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                            table.getColumn('category')?.setFilterValue(event.target.value || undefined)
                        }
                        className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                    >
                        <option value="">所有分类</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 添加按钮 */}
                <Button
                    onClick={onAdd}
                    variant="outline"
                >
                    <Plus className="mr-2 h-4 w-4 inline-block" />
                    <span>添加餐厅</span>
                </Button>
            </div>

            {/* 表格 */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'cursor-pointer select-none flex items-center gap-2'
                                                        : ''
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <div className="h-4 w-4 opacity-50">
                                                                <ChevronUp className="h-3 w-3" />
                                                                <ChevronDown className="h-3 w-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    暂无餐厅数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* 分页 */}
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-between space-x-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        共 {table.getFilteredRowModel().rows.length} 条记录，
                        第 {table.getState().pagination.pageIndex + 1} 页，
                        共 {table.getPageCount()} 页
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            上一页
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            下一页
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
