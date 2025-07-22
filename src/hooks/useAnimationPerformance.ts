"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface AnimationMetrics {
	fps: number;
	frameDrops: number;
	averageFrameTime: number;
	jankEvents: number;
	memoryUsage?: number;
	status: "excellent" | "good" | "poor" | "critical";
}

interface PerformanceTest {
	name: string;
	duration: number;
	metrics: AnimationMetrics;
	recommendations: string[];
}

export function useAnimationPerformance() {
	const [isMonitoring, setIsMonitoring] = useState(false);
	const [currentMetrics, setCurrentMetrics] = useState<AnimationMetrics | null>(null);
	const [testResults, setTestResults] = useState<PerformanceTest[]>([]);

	const frameTimesRef = useRef<number[]>([]);
	const lastFrameTimeRef = useRef<number>(0);
	const animationFrameRef = useRef<number>();
	const startTimeRef = useRef<number>(0);
	const shouldAnimateRef = useRef<boolean>(true);
	const createOptimizedConfigRef = useRef<() => void>(() => {});

	const createOptimizedConfig = useCallback((config: any) => {
		createOptimizedConfigRef.current = () => config;
	}, []);

	useEffect(() => {
		if (isMonitoring) {
			shouldAnimateRef.current = true;
			createOptimizedConfigRef.current = () => createOptimizedConfig;
		}
	}, [isMonitoring, createOptimizedConfig]);

	// 计算性能指标
	const calculateMetrics = useCallback((frameTimes: number[]): AnimationMetrics => {
		if (frameTimes.length === 0) {
			return {
				fps: 0,
				frameDrops: 0,
				averageFrameTime: 0,
				jankEvents: 0,
				status: "critical",
			};
		}

		const averageFrameTime =
			frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
		const fps = Math.round(1000 / averageFrameTime);

		// 检测掉帧（超过16.67ms的帧）
		const frameDrops = frameTimes.filter(time => time > 16.67).length;

		// 检测卡顿事件（超过50ms的帧）
		const jankEvents = frameTimes.filter(time => time > 50).length;

		// 获取内存使用情况（如果支持）
		let memoryUsage: number | undefined;
		if ("memory" in performance) {
			const memory = (performance as any).memory;
			memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
		}

		// 确定性能状态
		let status: AnimationMetrics["status"];
		if (fps >= 55 && jankEvents === 0) {
			status = "excellent";
		} else if (fps >= 45 && jankEvents <= 2) {
			status = "good";
		} else if (fps >= 30 && jankEvents <= 5) {
			status = "poor";
		} else {
			status = "critical";
		}

		return {
			fps,
			frameDrops,
			averageFrameTime,
			jankEvents,
			memoryUsage,
			status,
		};
	}, []);

	// 帧监控函数
	const monitorFrame = useCallback(
		(currentTime: number) => {
			if (lastFrameTimeRef.current > 0) {
				const frameTime = currentTime - lastFrameTimeRef.current;
				frameTimesRef.current.push(frameTime);

				// 保持最近100帧的数据
				if (frameTimesRef.current.length > 100) {
					frameTimesRef.current.shift();
				}

				// 每10帧更新一次指标
				if (frameTimesRef.current.length % 10 === 0) {
					const metrics = calculateMetrics(frameTimesRef.current);
					setCurrentMetrics(metrics);
				}
			}

			lastFrameTimeRef.current = currentTime;

			if (isMonitoring) {
				animationFrameRef.current = requestAnimationFrame(monitorFrame);
			}
		},
		[isMonitoring, calculateMetrics]
	);

	// 开始监控
	const startMonitoring = useCallback(() => {
		if (isMonitoring) return;

		setIsMonitoring(true);
		frameTimesRef.current = [];
		lastFrameTimeRef.current = 0;
		startTimeRef.current = performance.now();

		animationFrameRef.current = requestAnimationFrame(monitorFrame);
	}, [isMonitoring, monitorFrame]);

	// 停止监控
	const stopMonitoring = useCallback(() => {
		if (!isMonitoring) return;

		setIsMonitoring(false);

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
	}, [isMonitoring]);

	// 运行特定动画测试
	const runAnimationTest = useCallback(
		async (testName: string, testDuration: number = 3000) => {
			return new Promise<PerformanceTest>(resolve => {
				const testFrameTimes: number[] = [];
				let testLastFrameTime = 0;
				let testAnimationFrame: number;
				const testStartTime = performance.now();

				const testMonitorFrame = (currentTime: number) => {
					if (testLastFrameTime > 0) {
						const frameTime = currentTime - testLastFrameTime;
						testFrameTimes.push(frameTime);
					}

					testLastFrameTime = currentTime;

					if (currentTime - testStartTime < testDuration) {
						testAnimationFrame = requestAnimationFrame(testMonitorFrame);
					} else {
						// 测试完成
						const metrics = calculateMetrics(testFrameTimes);
						const recommendations = generateRecommendations(metrics);

						const testResult: PerformanceTest = {
							name: testName,
							duration: testDuration,
							metrics,
							recommendations,
						};

						setTestResults(prev => [...prev, testResult]);
						resolve(testResult);
					}
				};

				testAnimationFrame = requestAnimationFrame(testMonitorFrame);
			});
		},
		[calculateMetrics]
	);

	// 清除测试结果
	const clearTestResults = useCallback(() => {
		setTestResults([]);
	}, []);

	// 获取性能建议
	const getPerformanceRecommendations = useCallback(() => {
		if (!currentMetrics) return [];
		return generateRecommendations(currentMetrics);
	}, [currentMetrics]);

	// 清理资源
	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return {
		isMonitoring,
		currentMetrics,
		testResults,
		startMonitoring,
		stopMonitoring,
		runAnimationTest,
		clearTestResults,
		getPerformanceRecommendations,
	};
}

// 生成性能优化建议
function generateRecommendations(metrics: AnimationMetrics): string[] {
	const recommendations: string[] = [];

	if (metrics.fps < 30) {
		recommendations.push("帧率过低，建议减少动画复杂度或使用 CSS transforms");
	} else if (metrics.fps < 45) {
		recommendations.push("帧率偏低，考虑优化动画性能");
	}

	if (metrics.jankEvents > 5) {
		recommendations.push("检测到多次卡顿，建议使用 will-change 属性或减少重排重绘");
	} else if (metrics.jankEvents > 0) {
		recommendations.push("偶有卡顿，建议检查动画实现方式");
	}

	if (metrics.frameDrops > metrics.fps * 0.1) {
		recommendations.push("掉帧较多，建议使用 requestAnimationFrame 优化动画");
	}

	if (metrics.memoryUsage && metrics.memoryUsage > 50) {
		recommendations.push("内存使用较高，建议检查是否有内存泄漏");
	}

	if (metrics.averageFrameTime > 20) {
		recommendations.push("平均帧时间较长，建议优化动画计算逻辑");
	}

	// 移动端特殊建议
	if (typeof window !== "undefined" && window.innerWidth < 768) {
		recommendations.push(
			"移动端建议：使用 transform 和 opacity 进行动画，避免修改 layout 属性"
		);

		if (metrics.fps < 45) {
			recommendations.push("移动端性能不佳，考虑添加 prefers-reduced-motion 支持");
		}
	}

	if (recommendations.length === 0) {
		recommendations.push("动画性能表现优秀！");
	}

	return recommendations;
}
