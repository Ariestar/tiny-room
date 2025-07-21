"use client";

import { useState, useRef, useEffect } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface TouchTestResult {
    element: string;
    targetSize: { width: number; height: number };
    position: { x: number; y: number };
    accessible: boolean;
    issues: string[];
}

export function TouchInteractionTester() {
    const [testResults, setTestResults] = useState<TouchTestResult[]>([]);
    const [isRunningTest, setIsRunningTest] = useState(false);
    const [touchEvents, setTouchEvents] = useState<any[]>([]);
    const testAreaRef = useRef<HTMLDivElement>(null);

    const { isMobile, isTablet } = useBreakpoint();

    // 测试触摸目标的最小尺寸（44px x 44px 是推荐标准）
    const MIN_TOUCH_TARGET_SIZE = 44;

    // 运行触摸交互测试
    const runTouchInteractionTest = () => {
        setIsRunningTest(true);
        const results: TouchTestResult[] = [];

        if (testAreaRef.current) {
            // 获取所有可交互元素
            const interactiveElements = testAreaRef.current.querySelectorAll(
                'button, a, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
            );

            interactiveElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const computedStyle = window.getComputedStyle(element);

                const issues: string[] = [];
                let accessible = true;

                // 检查尺寸
                if (rect.width < MIN_TOUCH_TARGET_SIZE) {
                    issues.push(`宽度 ${rect.width.toFixed(1)}px 小于推荐的 ${MIN_TOUCH_TARGET_SIZE}px`);
                    accessible = false;
                }

                if (rect.height < MIN_TOUCH_TARGET_SIZE) {
                    issues.push(`高度 ${rect.height.toFixed(1)}px 小于推荐的 ${MIN_TOUCH_TARGET_SIZE}px`);
                    accessible = false;
                }

                // 检查间距
                const marginTop = parseInt(computedStyle.marginTop);
                const marginBottom = parseInt(computedStyle.marginBottom);
                const marginLeft = parseInt(computedStyle.marginLeft);
                const marginRight = parseInt(computedStyle.marginRight);

                if (marginTop + marginBottom < 8) {
                    issues.push("垂直间距过小，可能导致误触");
                }

                if (marginLeft + marginRight < 8) {
                    issues.push("水平间距过小，可能导致误触");
                }

                // 检查是否有足够的对比度
                const color = computedStyle.color;
                const backgroundColor = computedStyle.backgroundColor;

                if (color === backgroundColor) {
                    issues.push("文字和背景颜色对比度不足");
                    accessible = false;
                }

                results.push({
                    element: `${element.tagName.toLowerCase()}${element.className ? '.' + element.className.split(' ')[0] : ''}`,
                    targetSize: { width: rect.width, height: rect.height },
                    position: { x: rect.left, y: rect.top },
                    accessible,
                    issues
                });
            });
        }

        setTestResults(results);
        setIsRunningTest(false);
    };

    // 记录触摸事件
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        const newEvent = {
            type: 'touchstart',
            timestamp: Date.now(),
            x: touch.clientX,
            y: touch.clientY,
            target: (e.target as HTMLElement).tagName
        };

        setTouchEvents(prev => [...prev.slice(-9), newEvent]);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touch = e.changedTouches[0];
        const newEvent = {
            type: 'touchend',
            timestamp: Date.now(),
            x: touch.clientX,
            y: touch.clientY,
            target: (e.target as HTMLElement).tagName
        };

        setTouchEvents(prev => [...prev.slice(-9), newEvent]);
    };

    // 清除触摸事件记录
    const clearTouchEvents = () => {
        setTouchEvents([]);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">触摸交互测试工具</h1>
                <p className="text-gray-600 mb-4">
                    测试触摸目标的尺寸、间距和可访问性
                </p>

                {/* 设备信息 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">当前设备信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">设备类型:</span>
                            <span className="ml-2">
                                {isMobile ? "移动设备" : isTablet ? "平板设备" : "桌面设备"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">触摸支持:</span>
                            <span className="ml-2">
                                {'ontouchstart' in window ? "✅ 支持" : "❌ 不支持"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">最大触摸点:</span>
                            <span className="ml-2">
                                {navigator.maxTouchPoints || "未知"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 测试控制 */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={runTouchInteractionTest}
                        disabled={isRunningTest}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isRunningTest ? "正在测试..." : "运行触摸测试"}
                    </button>

                    <button
                        onClick={clearTouchEvents}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        清除事件记录
                    </button>
                </div>

                {testResults.length > 0 && (
                    <div className="text-sm text-gray-600">
                        已测试 {testResults.length} 个交互元素，
                        通过 {testResults.filter(r => r.accessible).length} 个
                    </div>
                )}
            </div>

            {/* 测试区域 */}
            <div
                ref={testAreaRef}
                className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <h3 className="font-semibold mb-4">测试区域 - 请在此区域进行触摸交互</h3>

                {/* 各种尺寸的按钮测试 */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium mb-2">按钮尺寸测试</h4>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                                小按钮 (32px)
                            </button>
                            <button className="px-3 py-2 bg-orange-500 text-white rounded text-sm">
                                中按钮 (40px)
                            </button>
                            <button className="px-4 py-3 bg-green-500 text-white rounded">
                                大按钮 (48px)
                            </button>
                            <button className="px-6 py-4 bg-blue-500 text-white rounded text-lg">
                                超大按钮 (56px)
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">链接测试</h4>
                        <div className="space-y-2">
                            <a href="#" className="text-blue-600 underline text-sm">小链接文字</a>
                            <br />
                            <a href="#" className="text-blue-600 underline">标准链接文字</a>
                            <br />
                            <a href="#" className="inline-block px-3 py-2 text-blue-600 underline">
                                带内边距的链接
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">表单元素测试</h4>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="小输入框"
                                className="px-2 py-1 border rounded text-sm w-32"
                            />
                            <br />
                            <input
                                type="text"
                                placeholder="标准输入框"
                                className="px-3 py-2 border rounded w-48"
                            />
                            <br />
                            <select className="px-2 py-1 border rounded text-sm">
                                <option>小选择框</option>
                            </select>
                            <select className="px-3 py-2 border rounded ml-2">
                                <option>标准选择框</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">复选框和单选框测试</h4>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm">小复选框</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2 scale-125" />
                                <span>放大的复选框</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="test" className="mr-2" />
                                <span className="text-sm">小单选框</span>
                            </label>
                            <label className="flex items-center">
                                <input type="radio" name="test" className="mr-2 scale-125" />
                                <span>放大的单选框</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* 触摸事件记录 */}
            {touchEvents.length > 0 && (
                <div className="mb-8">
                    <h3 className="font-semibold mb-3">触摸事件记录</h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                        {touchEvents.map((event, index) => (
                            <div key={index} className="text-xs font-mono mb-1">
                                <span className={event.type === 'touchstart' ? 'text-green-600' : 'text-red-600'}>
                                    {event.type}
                                </span>
                                <span className="text-gray-500 ml-2">
                                    {new Date(event.timestamp).toLocaleTimeString()}
                                </span>
                                <span className="ml-2">
                                    ({event.x}, {event.y}) → {event.target}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 测试结果 */}
            {testResults.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-4">测试结果</h3>
                    <div className="space-y-3">
                        {testResults.map((result, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium">{result.element}</span>
                                        <span className="text-xs text-gray-500">
                                            {result.targetSize.width.toFixed(0)} × {result.targetSize.height.toFixed(0)}px
                                        </span>
                                    </div>
                                    <div className={`font-semibold ${result.accessible ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.accessible ? "✅ 通过" : "❌ 需要优化"}
                                    </div>
                                </div>

                                {result.issues.length > 0 && (
                                    <div className="mt-2">
                                        <h4 className="text-sm font-medium text-gray-700 mb-1">发现的问题:</h4>
                                        <ul className="space-y-1">
                                            {result.issues.map((issue, i) => (
                                                <li key={i} className="text-xs text-red-600">• {issue}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 测试建议 */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">触摸交互优化建议</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium mb-2">尺寸要求</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 最小触摸目标: 44×44px</li>
                            <li>• 推荐触摸目标: 48×48px</li>
                            <li>• 重要按钮: 56×56px 或更大</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">间距要求</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 触摸目标间距: 至少 8px</li>
                            <li>• 推荐间距: 12-16px</li>
                            <li>• 避免相邻元素过于密集</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}