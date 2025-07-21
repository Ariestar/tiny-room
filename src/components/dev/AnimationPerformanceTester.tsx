"use client";

import { useState, useEffect, useRef } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface PerformanceMetrics {
    fps: number;
    frameTime: number;
    droppedFrames: number;
    cpuUsage: number;
    memoryUsage: number;
}

interface AnimationTest {
    name: string;
    description: string;
    component: React.ReactNode;
    complexity: "low" | "medium" | "high";
}

export function AnimationPerformanceTester() {
    const [isRunning, setIsRunning] = useState(false);
    const [currentTest, setCurrentTest] = useState<number>(0);
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [testResults, setTestResults] = useState<Array<{
        test: string;
        metrics: PerformanceMetrics;
        passed: boolean;
    }>>([]);

    const { isMobile, isTablet } = useBreakpoint();
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(0);
    const animationIdRef = useRef<number>();

    // 动画测试用例
    const animationTests: AnimationTest[] = [
        {
            name: "CSS Transform 动画",
            description: "使用 transform 属性的高性能动画",
            complexity: "low",
            component: (
                <div className="w-16 h-16 bg-blue-500 rounded-lg animate-spin"></div>
            )
        },
        {
            name: "CSS Opacity 动画",
            description: "透明度渐变动画",
            complexity: "low",
            component: (
                <div className="w-16 h-16 bg-green-500 rounded-lg animate-pulse"></div>
            )
        },
        {
            name: "多元素动画",
            description: "多个元素同时进行动画",
            complexity: "medium",
            component: (
                <div className="flex space-x-2">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            )
        },
        {
            name: "复杂 CSS 动画",
            description: "包含多个属性变化的复杂动画",
            complexity: "high",
            component: (
                <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg animate-spin"></div>
                    <div className="absolute top-2 left-2 w-16 h-16 bg-white rounded-lg animate-pulse"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 bg-red-500 rounded-lg animate-bounce"></div>
                </div>
            )
        },
        {
            name: "大量元素动画",
            description: "测试大量动画元素的性能影响",
            complexity: "high",
            component: (
                <div className="grid grid-cols-6 gap-1">
                    {[...Array(24)].map((_, i) => (
                        <div
                            key={i}
                            className="w-4 h-4 bg-indigo-500 rounded animate-pulse"
                            style={{ animationDelay: `${(i % 6) * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            )
        }
    ];

    // 性能监控
    const startPerformanceMonitoring = () => {
        frameCountRef.current = 0;
        lastTimeRef.current = performance.now();

        const measureFrame = (currentTime: number) => {
            frameCountRef.current++;

            if (currentTime - lastTimeRef.current >= 1000) {
                const fps = Math.round((frameCountRef.current * 1000) / (currentTime - lastTimeRef.current));
                const frameTime = (currentTime - lastTimeRef.current) / frameCountRef.current;

                // 模拟其他性能指标（在实际应用中可以使用 Performance API）
                const droppedFrames = Math.max(0, 60 - fps);
                const cpuUsage = Math.min(100, (droppedFrames / 60) * 100 + Math.random() * 20);

                // 获取内存使用情况（如果支持）
                let memoryUsage = 0;
                if ('memory' in performance) {
                    const memory = (performance as any).memory;
                    memoryUsage = Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100);
                }

                setMetrics({
                    fps,
                    frameTime,
                    droppedFrames,
                    cpuUsage,
                    memoryUsage
                });

                frameCountRef.current = 0;
                lastTimeRef.current = currentTime;
            }

            if (isRunning) {
                animationIdRef.current = requestAnimationFrame(measureFrame);
            }
        };

        animationIdRef.current = requestAnimationFrame(measureFrame);
    };

    // 停止性能监控
    const stopPerformanceMonitoring = () => {
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
    };

    // 运行单个测试
    const runSingleTest = async (testIndex: number) => {
        setCurrentTest(testIndex);
        setIsRunning(true);

        // 等待动画稳定
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 开始监控
        startPerformanceMonitoring();

        // 运行测试 5 秒
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 停止监控
        stopPerformanceMonitoring();
        setIsRunning(false);

        if (metrics) {
            const passed = evaluatePerformance(metrics, animationTests[testIndex].complexity);
            setTestResults(prev => [...prev, {
                test: animationTests[testIndex].name,
                metrics: { ...metrics },
                passed
            }]);
        }
    };

    // 运行所有测试
    const runAllTests = async () => {
        setTestResults([]);

        for (let i = 0; i < animationTests.length; i++) {
            await runSingleTest(i);
            // 测试间隔
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    };

    // 评估性能
    const evaluatePerformance = (metrics: PerformanceMetrics, complexity: string): boolean => {
        // 根据设备类型和动画复杂度设置不同的标准
        let minFps = 30;
        let maxCpuUsage = 80;

        if (isMobile) {
            minFps = complexity === "high" ? 20 : complexity === "medium" ? 25 : 30;
            maxCpuUsage = complexity === "high" ? 90 : complexity === "medium" ? 85 : 80;
        } else if (isTablet) {
            minFps = complexity === "high" ? 25 : complexity === "medium" ? 30 : 45;
            maxCpuUsage = complexity === "high" ? 85 : complexity === "medium" ? 80 : 70;
        } else {
            minFps = complexity === "high" ? 30 : complexity === "medium" ? 45 : 60;
            maxCpuUsage = complexity === "high" ? 70 : complexity === "medium" ? 60 : 50;
        }

        return metrics.fps >= minFps && metrics.cpuUsage <= maxCpuUsage;
    };

    // 获取复杂度颜色
    const getComplexityColor = (complexity: string) => {
        switch (complexity) {
            case "low":
                return "bg-green-100 text-green-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "high":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // 获取性能等级
    const getPerformanceGrade = (fps: number) => {
        if (fps >= 55) return { grade: "优秀", color: "text-green-600" };
        if (fps >= 45) return { grade: "良好", color: "text-blue-600" };
        if (fps >= 30) return { grade: "一般", color: "text-yellow-600" };
        if (fps >= 20) return { grade: "较差", color: "text-orange-600" };
        return { grade: "很差", color: "text-red-600" };
    };

    useEffect(() => {
        return () => {
            stopPerformanceMonitoring();
        };
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">动画性能测试工具</h1>
                <p className="text-gray-600 mb-4">
                    测试动画在不同设备上的性能表现，确保流畅的用户体验
                </p>

                {/* 设备信息 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">当前设备信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">设备类型:</span>
                            <span className="ml-2">
                                {isMobile ? "移动设备" : isTablet ? "平板设备" : "桌面设备"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">硬件加速:</span>
                            <span className="ml-2">
                                {CSS.supports('transform', 'translateZ(0)') ? "✅ 支持" : "❌ 不支持"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">减少动画:</span>
                            <span className="ml-2">
                                {window.matchMedia('(prefers-reduced-motion: reduce)').matches ? "✅ 启用" : "❌ 未启用"}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">刷新率:</span>
                            <span className="ml-2">
                                {screen.refreshRate || "未知"} Hz
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 测试控制 */}
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={runAllTests}
                        disabled={isRunning}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isRunning ? "正在测试..." : "运行所有测试"}
                    </button>

                    <button
                        onClick={() => setTestResults([])}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        清除结果
                    </button>
                </div>

                {/* 实时性能指标 */}
                {isRunning && metrics && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">实时性能指标</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">FPS:</span>
                                <span className={`ml-2 font-bold ${getPerformanceGrade(metrics.fps).color}`}>
                                    {metrics.fps}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">帧时间:</span>
                                <span className="ml-2 font-mono">{metrics.frameTime.toFixed(1)}ms</span>
                            </div>
                            <div>
                                <span className="text-gray-500">丢帧:</span>
                                <span className="ml-2 font-mono">{metrics.droppedFrames}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">CPU:</span>
                                <span className="ml-2 font-mono">{metrics.cpuUsage.toFixed(1)}%</span>
                            </div>
                            <div>
                                <span className="text-gray-500">内存:</span>
                                <span className="ml-2 font-mono">{metrics.memoryUsage}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 动画测试区域 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">动画测试用例</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {animationTests.map((test, index) => (
                        <div
                            key={index}
                            className={`p-6 border rounded-lg ${currentTest === index && isRunning
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-200"
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold">{test.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${getComplexityColor(test.complexity)}`}>
                                    {test.complexity}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-4">{test.description}</p>

                            <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg mb-4">
                                {test.component}
                            </div>

                            <button
                                onClick={() => runSingleTest(index)}
                                disabled={isRunning}
                                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
                            >
                                {currentTest === index && isRunning ? "测试中..." : "单独测试"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 测试结果 */}
            {testResults.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">测试结果</h2>
                    <div className="space-y-4">
                        {testResults.map((result, index) => (
                            <div key={index} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">{result.test}</h3>
                                    <div className={`font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                        {result.passed ? "✅ 通过" : "❌ 需要优化"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">FPS:</span>
                                        <div className={`font-bold ${getPerformanceGrade(result.metrics.fps).color}`}>
                                            {result.metrics.fps} ({getPerformanceGrade(result.metrics.fps).grade})
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">帧时间:</span>
                                        <div className="font-mono">{result.metrics.frameTime.toFixed(1)}ms</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">丢帧数:</span>
                                        <div className="font-mono">{result.metrics.droppedFrames}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">CPU 使用:</span>
                                        <div className="font-mono">{result.metrics.cpuUsage.toFixed(1)}%</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">内存使用:</span>
                                        <div className="font-mono">{result.metrics.memoryUsage}%</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 优化建议 */}
            <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">动画性能优化建议</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium mb-2">高性能动画属性</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 使用 transform 而不是改变 left/top</li>
                            <li>• 使用 opacity 而不是 visibility</li>
                            <li>• 避免动画 width/height 等布局属性</li>
                            <li>• 使用 will-change 提示浏览器优化</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">移动端优化</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 减少同时进行的动画数量</li>
                            <li>• 使用 CSS 动画而不是 JavaScript</li>
                            <li>• 考虑用户的减少动画偏好设置</li>
                            <li>• 在低端设备上简化动画效果</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}