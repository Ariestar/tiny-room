"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Monitor,
    Smartphone,
    Tablet,
    CheckCircle,
    XCircle,
    AlertTriangle,
    RefreshCw,
    Eye,
    EyeOff
} from "lucide-react";
import {
    runCompatibilityTestSuite,
    type DeviceTestResult
} from "@/utils/device-compatibility-test";

interface TestResult {
    deviceInfo: DeviceTestResult;
    testResults: {
        layout: { passed: boolean; issues: string[] };
        touch: { passed: boolean; issues: string[] };
        performance: { passed: boolean; metrics: any; issues: string[] };
        accessibility: { passed: boolean; issues: string[] };
        animations: { passed: boolean; issues: string[] };
    };
    overallScore: number;
    recommendations: string[];
}

export function CompatibilityTester() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [testResult, setTestResult] = useState<TestResult | null>(null);
    const [autoTest, setAutoTest] = useState(true);

    // 自动运行测试
    useEffect(() => {
        if (autoTest && !testResult) {
            runTest();
        }
    }, [autoTest]);

    // 监听窗口大小变化，重新测试
    useEffect(() => {
        const handleResize = () => {
            if (autoTest && testResult) {
                setTimeout(() => runTest(), 500); // 延迟执行，避免频繁测试
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [autoTest, testResult]);

    const runTest = async () => {
        setIsLoading(true);
        try {
            const result = await runCompatibilityTestSuite();
            setTestResult(result);
        } catch (error) {
            console.error('兼容性测试失败:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'Mobile':
                return <Smartphone className="w-4 h-4" />;
            case 'Tablet':
                return <Tablet className="w-4 h-4" />;
            default:
                return <Monitor className="w-4 h-4" />;
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 90) return 'bg-green-100';
        if (score >= 70) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    // 只在开发环境显示
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <>
            {/* 切换按钮 */}
            <motion.button
                onClick={() => setIsVisible(!isVisible)}
                className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="设备兼容性测试"
            >
                {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>

            {/* 测试面板 */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed top-4 right-4 z-40 w-96 max-h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
                    >
                        {/* 头部 */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Monitor className="w-4 h-4" />
                                    兼容性测试
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setAutoTest(!autoTest)}
                                        className={`text-xs px-2 py-1 rounded ${autoTest
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        自动测试
                                    </button>
                                    <button
                                        onClick={runTest}
                                        disabled={isLoading}
                                        className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 内容 */}
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                                    <span className="ml-2 text-gray-600">测试中...</span>
                                </div>
                            ) : testResult ? (
                                <div className="space-y-4">
                                    {/* 设备信息 */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            {getDeviceIcon(testResult.deviceInfo.device)}
                                            <span className="font-medium text-gray-800">
                                                {testResult.deviceInfo.device}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {testResult.deviceInfo.screenSize}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-600 space-y-1">
                                            <div>方向: {testResult.deviceInfo.orientation}</div>
                                            <div>触控: {testResult.deviceInfo.touchSupport ? '支持' : '不支持'}</div>
                                            <div>像素比: {testResult.deviceInfo.pixelRatio}x</div>
                                        </div>
                                    </div>

                                    {/* 总体评分 */}
                                    <div className={`rounded-lg p-3 ${getScoreBgColor(testResult.overallScore)}`}>
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-800">总体评分</span>
                                            <span className={`text-xl font-bold ${getScoreColor(testResult.overallScore)}`}>
                                                {testResult.overallScore}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* 测试结果详情 */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-800 text-sm">测试详情</h4>
                                        {Object.entries(testResult.testResults).map(([testName, result]) => (
                                            <div key={testName} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                                                <span className="text-sm text-gray-700 capitalize">
                                                    {testName === 'layout' && '布局'}
                                                    {testName === 'touch' && '触控'}
                                                    {testName === 'performance' && '性能'}
                                                    {testName === 'accessibility' && '无障碍'}
                                                    {testName === 'animations' && '动画'}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {result.passed ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                    {result.issues && result.issues.length > 0 && (
                                                        <span className="text-xs text-gray-500">
                                                            {result.issues.length}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 问题和建议 */}
                                    {testResult.recommendations.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-800 text-sm flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                                优化建议
                                            </h4>
                                            <div className="space-y-1">
                                                {testResult.recommendations.slice(0, 3).map((rec, index) => (
                                                    <div key={index} className="text-xs text-gray-600 bg-yellow-50 p-2 rounded">
                                                        {rec}
                                                    </div>
                                                ))}
                                                {testResult.recommendations.length > 3 && (
                                                    <div className="text-xs text-gray-500 text-center py-1">
                                                        还有 {testResult.recommendations.length - 3} 条建议...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* 性能指标 */}
                                    {testResult.testResults.performance.metrics && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-gray-800 text-sm">性能指标</h4>
                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                {Object.entries(testResult.testResults.performance.metrics).map(([key, value]) => (
                                                    <div key={key} className="bg-gray-50 p-2 rounded">
                                                        <div className="text-gray-600 capitalize">{key}</div>
                                                        <div className="font-medium text-gray-800">
                                                            {typeof value === 'number' ? `${value}ms` : String(value)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-600">
                                    点击刷新按钮开始测试
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default CompatibilityTester;