"use client";

import { useState, useEffect } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { breakpoints } from "@/lib/ui/responsive";

interface DevicePreset {
    name: string;
    width: number;
    height: number;
    category: "mobile" | "tablet" | "desktop";
    description: string;
}

const devicePresets: DevicePreset[] = [
    // 移动设备
    {
        name: "iPhone SE",
        width: 375,
        height: 667,
        category: "mobile",
        description: "小屏手机 - 最小支持尺寸"
    },
    {
        name: "iPhone 12/13/14",
        width: 390,
        height: 844,
        category: "mobile",
        description: "标准手机尺寸"
    },
    {
        name: "iPhone 14 Plus",
        width: 428,
        height: 926,
        category: "mobile",
        description: "大屏手机"
    },
    {
        name: "Samsung Galaxy S21",
        width: 360,
        height: 800,
        category: "mobile",
        description: "Android 标准尺寸"
    },

    // 平板设备
    {
        name: "iPad Mini",
        width: 768,
        height: 1024,
        category: "tablet",
        description: "小尺寸平板"
    },
    {
        name: "iPad Air",
        width: 820,
        height: 1180,
        category: "tablet",
        description: "标准平板尺寸"
    },
    {
        name: "iPad Pro 11\"",
        width: 834,
        height: 1194,
        category: "tablet",
        description: "专业平板"
    },
    {
        name: "iPad Pro 12.9\"",
        width: 1024,
        height: 1366,
        category: "tablet",
        description: "大尺寸平板"
    },

    // 桌面设备
    {
        name: "MacBook Air",
        width: 1280,
        height: 800,
        category: "desktop",
        description: "小型笔记本"
    },
    {
        name: "MacBook Pro 14\"",
        width: 1512,
        height: 982,
        category: "desktop",
        description: "标准笔记本"
    },
    {
        name: "iMac 24\"",
        width: 1920,
        height: 1080,
        category: "desktop",
        description: "桌面显示器"
    },
    {
        name: "4K Display",
        width: 2560,
        height: 1440,
        category: "desktop",
        description: "高分辨率显示器"
    }
];

interface CompatibilityTestResult {
    device: string;
    breakpoint: string;
    layoutIssues: string[];
    touchTargetIssues: string[];
    performanceIssues: string[];
    passed: boolean;
}

export function DeviceCompatibilityTester() {
    const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(devicePresets[0]);
    const [testResults, setTestResults] = useState<CompatibilityTestResult[]>([]);
    const [isRunningTests, setIsRunningTests] = useState(false);
    const [currentViewport, setCurrentViewport] = useState({ width: 0, height: 0 });

    const { breakpoint, windowWidth, windowHeight } = useBreakpoint();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
    }, []);

    // 模拟设备视口
    const simulateDevice = (device: DevicePreset) => {
        setSelectedDevice(device);

        // 在实际应用中，这里会调整iframe或者测试环境的尺寸
        // 目前我们只是记录选择的设备信息
        console.log(`模拟设备: ${device.name} (${device.width}x${device.height})`);
    };

    // 运行兼容性测试
    const runCompatibilityTests = async () => {
        setIsRunningTests(true);
        const results: CompatibilityTestResult[] = [];

        for (const device of devicePresets) {
            const result = await testDeviceCompatibility(device);
            results.push(result);

            // 模拟测试延迟
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        setTestResults(results);
        setIsRunningTests(false);
    };

    // 测试单个设备的兼容性
    const testDeviceCompatibility = async (device: DevicePreset): Promise<CompatibilityTestResult> => {
        const layoutIssues: string[] = [];
        const touchTargetIssues: string[] = [];
        const performanceIssues: string[] = [];

        // 检查断点匹配
        let expectedBreakpoint = "xs";
        if (device.width >= breakpoints["2xl"]) expectedBreakpoint = "2xl";
        else if (device.width >= breakpoints.xl) expectedBreakpoint = "xl";
        else if (device.width >= breakpoints.lg) expectedBreakpoint = "lg";
        else if (device.width >= breakpoints.md) expectedBreakpoint = "md";
        else if (device.width >= breakpoints.sm) expectedBreakpoint = "sm";

        // 布局检查
        if (device.category === "mobile" && device.width < 360) {
            layoutIssues.push("屏幕宽度过小，可能导致内容显示不完整");
        }

        if (device.category === "mobile" && device.height < 600) {
            layoutIssues.push("屏幕高度较小，需要优化垂直布局");
        }

        // 触摸目标检查
        if (device.category === "mobile" || device.category === "tablet") {
            if (device.width < 375) {
                touchTargetIssues.push("建议增加触摸目标的最小尺寸到44px");
            }
        }

        // 性能检查
        if (device.category === "mobile") {
            performanceIssues.push("移动设备建议减少动画复杂度");
            if (device.width < 400) {
                performanceIssues.push("小屏设备建议启用性能优化模式");
            }
        }

        const passed = layoutIssues.length === 0 && touchTargetIssues.length === 0;

        return {
            device: device.name,
            breakpoint: expectedBreakpoint,
            layoutIssues,
            touchTargetIssues,
            performanceIssues,
            passed
        };
    };

    // 获取设备类别的颜色
    const getCategoryColor = (category: string) => {
        switch (category) {
            case "mobile":
                return "bg-blue-100 text-blue-800";
            case "tablet":
                return "bg-green-100 text-green-800";
            case "desktop":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // 获取测试结果的颜色
    const getResultColor = (passed: boolean) => {
        return passed ? "text-green-600" : "text-red-600";
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">设备兼容性测试工具</h1>
                <p className="text-gray-600 mb-4">
                    测试网站在不同设备和屏幕尺寸下的兼容性表现
                </p>

                {/* 当前视口信息 */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">当前视口信息</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">宽度:</span>
                            <span className="ml-2 font-mono">{currentViewport.width}px</span>
                        </div>
                        <div>
                            <span className="text-gray-500">高度:</span>
                            <span className="ml-2 font-mono">{currentViewport.height}px</span>
                        </div>
                        <div>
                            <span className="text-gray-500">断点:</span>
                            <span className="ml-2 font-mono font-semibold text-blue-600">{breakpoint}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">设备类型:</span>
                            <span className="ml-2">
                                {currentViewport.width < breakpoints.md ? "移动端" :
                                    currentViewport.width < breakpoints.lg ? "平板" : "桌面"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 设备选择器 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">选择测试设备</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devicePresets.map((device) => (
                        <div
                            key={device.name}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${selectedDevice.name === device.name
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                            onClick={() => simulateDevice(device)}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{device.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(device.category)}`}>
                                    {device.category}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{device.description}</p>
                            <div className="text-xs text-gray-500 font-mono">
                                {device.width} × {device.height}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 测试控制 */}
            <div className="mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={runCompatibilityTests}
                        disabled={isRunningTests}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRunningTests ? "正在测试..." : "运行兼容性测试"}
                    </button>

                    {testResults.length > 0 && (
                        <div className="text-sm text-gray-600">
                            已测试 {testResults.length} 个设备，
                            通过 {testResults.filter(r => r.passed).length} 个
                        </div>
                    )}
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
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold">{result.device}</h3>
                                        <span className="text-sm text-gray-500">
                                            断点: {result.breakpoint}
                                        </span>
                                    </div>
                                    <div className={`font-semibold ${getResultColor(result.passed)}`}>
                                        {result.passed ? "✅ 通过" : "❌ 需要优化"}
                                    </div>
                                </div>

                                {/* 问题详情 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {/* 布局问题 */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">布局问题</h4>
                                        {result.layoutIssues.length > 0 ? (
                                            <ul className="space-y-1">
                                                {result.layoutIssues.map((issue, i) => (
                                                    <li key={i} className="text-red-600 text-xs">• {issue}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-green-600 text-xs">无布局问题</p>
                                        )}
                                    </div>

                                    {/* 触摸目标问题 */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">触摸目标</h4>
                                        {result.touchTargetIssues.length > 0 ? (
                                            <ul className="space-y-1">
                                                {result.touchTargetIssues.map((issue, i) => (
                                                    <li key={i} className="text-orange-600 text-xs">• {issue}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-green-600 text-xs">触摸目标合适</p>
                                        )}
                                    </div>

                                    {/* 性能建议 */}
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">性能建议</h4>
                                        {result.performanceIssues.length > 0 ? (
                                            <ul className="space-y-1">
                                                {result.performanceIssues.map((issue, i) => (
                                                    <li key={i} className="text-blue-600 text-xs">• {issue}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-green-600 text-xs">性能表现良好</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 测试指南 */}
            <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">测试指南</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h4 className="font-medium mb-2">布局测试要点</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 内容是否完整显示</li>
                            <li>• 导航是否易于使用</li>
                            <li>• 文字是否清晰可读</li>
                            <li>• 图片是否正确缩放</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">交互测试要点</h4>
                        <ul className="space-y-1 text-gray-600">
                            <li>• 按钮是否易于点击</li>
                            <li>• 滚动是否流畅</li>
                            <li>• 动画是否适度</li>
                            <li>• 表单是否易于填写</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}