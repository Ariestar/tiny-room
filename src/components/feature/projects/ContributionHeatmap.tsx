"use client";

import React, { useEffect, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css"; // 导入官方样式，包含GitHub色彩方案
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface HeatmapData {
    date: string;
    count: number;
}

interface ContributionHeatmapProps {
    className?: string;
}

export default function ContributionHeatmap({ className }: ContributionHeatmapProps) {
    const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiInfo, setApiInfo] = useState<any>(null);

    useEffect(() => {
        fetchContributionData();
    }, []);

    const fetchContributionData = async () => {
        try {
            setLoading(true);
            setError(null);

            // 获取贡献数据
            const contributionsRes = await fetch('/api/github/contributions');
            if (!contributionsRes.ok) {
                throw new Error('Failed to fetch contribution data');
            }
            const data = await contributionsRes.json();
            console.log('GitHub API response:', data);

            setHeatmapData(data.contributions || []);
            setApiInfo(data); // 保存API信息用于调试显示
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load contribution data');
        } finally {
            setLoading(false);
        }
    };

    // Removed tooltip function to avoid type conflicts

    const getClassForValue = (value: any) => {
        if (!value || value.count === 0) {
            return 'color-github-0'; // GitHub官方样式：空/无活动
        }
        if (value.count <= 2) {
            return 'color-github-1'; // GitHub官方样式：低活动
        }
        if (value.count <= 4) {
            return 'color-github-2'; // GitHub官方样式：中等活动
        }
        if (value.count <= 6) {
            return 'color-github-3'; // GitHub官方样式：高活动
        }
        return 'color-github-4'; // GitHub官方样式：非常高活动
    };

    const currentYear = new Date().getFullYear();
    const startDate = new Date(`${currentYear - 1}-01-01`);
    const endDate = new Date(`${currentYear}-12-31`);

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>项目活跃度</span>
                    <div className="text-right">
                        <div className="text-sm text-muted-foreground font-normal">
                            过去一年
                        </div>
                        {apiInfo && (
                            <div className="text-xs text-muted-foreground">
                                总贡献: {apiInfo.totalContributions} | 活跃天数: {apiInfo.activeDays}
                                {apiInfo.includesPrivateRepos && (
                                    <span className="ml-1 text-green-600">✓ 包含私有仓库</span>
                                )}
                            </div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-destructive py-8">
                        <p>加载失败: {error}</p>
                        <button
                            onClick={fetchContributionData}
                            className="mt-2 text-sm text-primary hover:underline"
                        >
                            重试
                        </button>
                    </div>
                ) : (
                    <div className="w-full">
                        <CalendarHeatmap
                            startDate={startDate}
                            endDate={endDate}
                            values={heatmapData}
                            classForValue={getClassForValue}
                            showWeekdayLabels={true}
                            onClick={(value) => {
                                if (value && value.count > 0) {
                                    console.log(`Clicked on ${value.date} with ${value.count} contributions`);
                                }
                            }}
                        />

                        {/* 图例 - 使用GitHub官方色彩方案 */}
                        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                            <span>Less</span>
                            <div className="flex items-center space-x-1">
                                {/* GitHub官方颜色：#eeeeee, #d6e685, #8cc665, #44a340, #1e6823 */}
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#eeeeee' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#d6e685' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#8cc665' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#44a340' }}></div>
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1e6823' }}></div>
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
