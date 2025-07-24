"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    CheckCircle,
    XCircle,
    AlertTriangle,
    TrendingUp,
    Zap,
    Eye,
    EyeOff,
    RefreshCw,
    BarChart3
} from "lucide-react";
import {
    runFunctionalTestSuite,
    type TestSuiteResult
} from "@/lib/testing/functional-test-suite";
import {
    generatePerformanceReport,
    type PerformanceMetrics
} from "@/lib/system/performance/performance-optimizer";

interface TestingDashboardState {
    functionalTests: TestSuiteResult | null;
    performanceReport: any | null;
    isRunningTests: boolean;
    isRunningPerformance: boolean;
    lastTestTime: Date | null;
}

export function TestingDashboard() {
    const [isVisible, setIsVisible] = useState(false);
    const [state, setState] = useState<TestingDashboardState>({
        functionalTests: null,
        performanceReport: null,
        isRunningTests: false,
        isRunningPerformance: false,
        lastTestTime: null
    });

    // 自动运行测试（仅在开发环境）
    useEffect(() => {
        if (process.env.NODE_ENV === 'development' && !state.functionalTests) {
            runAllTests();
        }
    }, []);

    const runFunctionalTests = async () => {
        setState(prev => ({ ...prev, isRunningTests: true }));
        try {
            const results = await runFunctionalTestSuite();
            setState(prev => ({
                ...prev,
                functionalTests: results,
                lastTestTime: new Date()
            }));
        } catch (error) {
            console.error('功能测试失败:', error);
        } finally {
            setState(prev => ({ ...prev, isRunningTests: false }));
        }
    };

    const runPerformanceTests = async () => {
        setState(prev => ({ ...prev, isRunningPerformance: true }));
        try {
            const report = await generatePerformanceReport();
            setState(prev => ({
                ...prev,
                performanceReport: report,
                lastTestTime: new Date()
            }));
        } catch (error) {
            console.error('性能测试失败:', error);
        } finally {
            setState(prev => ({ ...prev, isRunningPerformance: false }));
        }
    };

    const runAllTests = async () => {
        await Promise.all([
            runFunctionalTests(),
            runPerformanceTests()
        ]);
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
                className="fixed bottom-20 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="测试仪表板"
            >
                {isVisible ? <EyeOff className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
            </motion.button>

            {/* 测试仪表板 */}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed top-4 right-4 z-40 w-[480px] max-h-[85vh] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
                    >
                        {/* 头部 */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    测试仪表板
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={runAllTests}
                                        disabled={state.isRunningTests || state.isRunningPerformance}
                                        className="p-1 text-white/80 hover:text-white disabled:opacity-50"
                                        title="运行所有测试"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${(state.isRunningTests || state.isRunningPerformance) ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            {state.lastTestTime && (
                                <p className="text-xs text-white/80 mt-1">
                                    最后更新: {state.lastTestTime.toLocaleTimeString()}
                                </p>
                            )}
                        </div>

                        {/* 内容 */}
                        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-6">

                            {/* 总体概览 */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* 功能测试概览 */}
                                <div className={`p-3 rounded-lg ${state.functionalTests ? getScoreBgColor(state.functionalTests.overallScore) : 'bg-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">功能测试</span>
                                        {state.isRunningTests ? (
                                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                                        ) : state.functionalTests ? (
                                            state.functionalTests.overallScore >= 70 ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-600" />
                                            )
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className={`text-2xl font-bold ${state.functionalTests ? getScoreColor(state.functionalTests.overallScore) : 'text-gray-400'}`}>
                                        {state.functionalTests ? `${state.functionalTests.overallScore}%` : '--'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {state.functionalTests ? `${state.functionalTests.passedTests}/${state.functionalTests.totalTests} 通过` : '未测试'}
                                    </div>
                                </div>

                                {/* 性能测试概览 */}
                                <div className={`p-3 rounded-lg ${state.performanceReport ? getScoreBgColor(state.performanceReport.score) : 'bg-gray-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">性能测试</span>
                                        {state.isRunningPerformance ? (
                                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                                        ) : state.performanceReport ? (
                                            state.performanceReport.score >= 70 ? (
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                            )
                                        ) : (
                                            <Zap className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div className={`text-2xl font-bold ${state.performanceReport ? getScoreColor(state.performanceReport.score) : 'text-gray-400'}`}>
                                        {state.performanceReport ? `${state.performanceReport.score}%` : '--'}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        {state.performanceReport ? `${state.performanceReport.appliedOptimizations.length} 项优化` : '未测试'}
                                    </div>
                                </div>
                            </div>

                            {/* 功能测试详情 */}
                            {state.functionalTests && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800 text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-blue-600" />
                                        功能测试详情
                                    </h4>
                                    <div className="space-y-2">
                                        {state.functionalTests.results.map((result, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm">
                                                <span className="text-gray-700">{result.testName}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs ${getScoreColor(result.score)}`}>
                                                        {result.score}%
                                                    </span>
                                                    {result.passed ? (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 问题总结 */}
                                    {state.functionalTests.results.some(r => r.issues.length > 0) && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <h5 className="text-sm font-medium text-red-800 mb-2">需要修复的问题</h5>
                                            <div className="space-y-1">
                                                {state.functionalTests.results
                                                    .filter(r => r.issues.length > 0)
                                                    .slice(0, 3)
                                                    .map((result, index) => (
                                                        <div key={index} className="text-xs text-red-700">
                                                            • {result.issues[0]}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 性能测试详情 */}
                            {state.performanceReport && (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-800 text-sm flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        性能指标
                                    </h4>

                                    {/* 核心指标 */}
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {Object.entries(state.performanceReport.metrics).map(([key, value]) => (
                                            <div key={key} className="bg-gray-50 p-2 rounded">
                                                <div className="text-gray-600 uppercase">{key}</div>
                                                <div className="font-medium text-gray-800">
                                                    {typeof value === 'number' ? `${Math.round(value)}ms` : String(value)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* 已应用的优化 */}
                                    {state.performanceReport.appliedOptimizations.length > 0 && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <h5 className="text-sm font-medium text-green-800 mb-2">已应用优化</h5>
                                            <div className="space-y-1">
                                                {state.performanceReport.appliedOptimizations.slice(0, 3).map((opt: any, index: number) => (
                                                    <div key={index} className="text-xs text-green-700">
                                                        • {opt.optimizations[0]}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 优化建议 */}
                                    {state.performanceReport.recommendations.length > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                            <h5 className="text-sm font-medium text-yellow-800 mb-2">优化建议</h5>
                                            <div className="space-y-1">
                                                {state.performanceReport.recommendations.slice(0, 3).map((rec: any, index: number) => (
                                                    <div key={index} className="text-xs text-yellow-700">
                                                        • {rec.optimizations[0]}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 快速操作 */}
                            <div className="flex gap-2">
                                <button
                                    onClick={runFunctionalTests}
                                    disabled={state.isRunningTests}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Play className="w-3 h-3" />
                                    功能测试
                                </button>
                                <button
                                    onClick={runPerformanceTests}
                                    disabled={state.isRunningPerformance}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                    <Zap className="w-3 h-3" />
                                    性能测试
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default TestingDashboard;