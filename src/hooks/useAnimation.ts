/**
 * 统一动画 Hook
 * Unified Animation Hook
 */

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
	prefersReducedMotion,
	supportsHardwareAcceleration,
	createResponsiveAnimationConfig,
	optimizedAnimationVariants,
	optimizedSpringConfig,
	easingConfig,
	createDebouncedAnimationTrigger,
	createThrottledAnimationTrigger,
	useOptimizedAnimation,
} from "@/lib/ui/animations";

export interface AnimationMetrics {
	fps: number;
	frameDrops: number;
	averageFrameTime: number;
	jankEvents: number;
	memoryUsage?: number;
	status: "excellent" | "good" | "poor" | "critical";
}

export interface PerformanceTest {
	name: string;
	duration: number;
	metrics: AnimationMetrics;
	recommendations: string[];
}

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	ease?: string;
	reducedMotionDuration?: number;
	enableHardwareAcceleration?: boolean;
}

/**
 * 动画性能监控 Hook
 */
export function useAnimationPerformance() {
	const [metrics, setMetrics] = useState<AnimationMetrics>({
		fps: 60,
		frameDrops: 0,
		averageFrameTime: 16.67,
		jankEvents: 0,
		status: "excellent",
	});

	const [isMonitoring, setIsMonitoring] = useState(false);
	const frameTimesRef = useRef<number[]>([]);
	const lastFrameTimeRef = useRef(performance.now());
	const animationFrameRef = useRef<number>();

	const startMonitoring = useCallback(() => {
		if (isMonitoring) return;

		setIsMonitoring(true);
		frameTimesRef.current = [];
		lastFrameTimeRef.current = performance.now();

		const measureFrame = () => {
			const now = performance.now();
			const frameTime = now - lastFrameTimeRef.current;

			frameTimesRef.current.push(frameTime);

			// 保持最近100帧的数据
			if (frameTimesRef.current.length > 100) {
				frameTimesRef.current.shift();
			}

			lastFrameTimeRef.current = now;

			if (isMonitoring) {
				animationFrameRef.current = requestAnimationFrame(measureFrame);
			}
		};

		animationFrameRef.current = requestAnimationFrame(measureFrame);
	}, [isMonitoring]);

	const stopMonitoring = useCallback(() => {
		setIsMonitoring(false);

		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}

		// 计算性能指标
		const frameTimes = frameTimesRef.current;
		if (frameTimes.length > 0) {
			const averageFrameTime =
				frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
			const fps = 1000 / averageFrameTime;
			const frameDrops = frameTimes.filter(time => time > 20).length; // >20ms 认为是掉帧
			const jankEvents = frameTimes.filter(time => time > 50).length; // >50ms 认为是卡顿

			let status: AnimationMetrics["status"] = "excellent";
			if (fps < 30 || jankEvents > 5) status = "critical";
			else if (fps < 45 || jankEvents > 2) status = "poor";
			else if (fps < 55 || jankEvents > 0) status = "good";

			setMetrics({
				fps: Math.round(fps),
				frameDrops,
				averageFrameTime: Math.round(averageFrameTime * 100) / 100,
				jankEvents,
				status,
			});
		}
	}, []);

	const generateRecommendations = useCallback((metrics: AnimationMetrics): string[] => {
		const recommendations: string[] = [];

		if (metrics.fps < 30) {
			recommendations.push("帧率过低，考虑减少同时运行的动画数量");
			recommendations.push("使用 transform 和 opacity 属性进行动画，避免触发重排");
		}

		if (metrics.frameDrops > 10) {
			recommendations.push("频繁掉帧，检查是否有复杂的 DOM 操作");
			recommendations.push("考虑使用 will-change 属性优化动画性能");
		}

		if (metrics.jankEvents > 2) {
			recommendations.push("存在明显卡顿，检查动画期间的 JavaScript 执行");
			recommendations.push("考虑使用 Web Workers 处理复杂计算");
		}

		if (metrics.averageFrameTime > 20) {
			recommendations.push("帧时间过长，优化动画复杂度");
			recommendations.push("使用 CSS 动画替代 JavaScript 动画");
		}

		if (recommendations.length === 0) {
			recommendations.push("动画性能良好，继续保持！");
		}

		return recommendations;
	}, []);

	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return {
		metrics,
		isMonitoring,
		startMonitoring,
		stopMonitoring,
		generateRecommendations,
	};
}

/**
 * 响应式动画配置 Hook
 */
export function useResponsiveAnimation(config: AnimationConfig = {}) {
	const optimizedConfig = useOptimizedAnimation();

	const animationConfig = useMemo(() => {
		return createResponsiveAnimationConfig({
			duration: config.duration,
			delay: config.delay,
			ease: config.ease,
			reducedMotionDuration: config.reducedMotionDuration,
		});
	}, [config]);

	const variants = useMemo(() => {
		return optimizedConfig.getVariants(optimizedAnimationVariants);
	}, [optimizedConfig]);

	return {
		...optimizedConfig,
		config: animationConfig,
		variants,
		springs: optimizedSpringConfig,
		easings: easingConfig,
	};
}

/**
 * 动画状态管理 Hook
 */
export function useAnimationState(initialState: string = "hidden") {
	const [currentState, setCurrentState] = useState(initialState);
	const [isAnimating, setIsAnimating] = useState(false);
	const performanceMonitor = {
		startAnimation: (..._args: any[]) => ({} as any),
		endAnimation: (_: any) => {},
	} as const;

	const animate = useCallback(
		(newState: string, onComplete?: () => void) => {
			if (isAnimating) return;

			setIsAnimating(true);
			const metric = performanceMonitor.startAnimation(
				`state-${currentState}-to-${newState}`
			);

			setCurrentState(newState);

			// 模拟动画完成
			setTimeout(() => {
				setIsAnimating(false);
				performanceMonitor.endAnimation(metric);
				onComplete?.();
			}, 300); // 默认动画时长
		},
		[currentState, isAnimating, performanceMonitor]
	);

	return {
		currentState,
		isAnimating,
		animate,
		canAnimate: !isAnimating,
	};
}

/**
 * 滚动动画 Hook
 */
export function useScrollAnimation(threshold: number = 0.1) {
	const [isInView, setIsInView] = useState(false);
	const [hasAnimated, setHasAnimated] = useState(false);
	const elementRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !hasAnimated) {
					setIsInView(true);
					setHasAnimated(true);
				}
			},
			{
				threshold,
				rootMargin: "50px",
			}
		);

		observer.observe(element);

		return () => {
			observer.unobserve(element);
		};
	}, [threshold, hasAnimated]);

	const reset = useCallback(() => {
		setIsInView(false);
		setHasAnimated(false);
	}, []);

	return {
		ref: elementRef,
		isInView,
		hasAnimated,
		reset,
	};
}

/**
 * 视差滚动 Hook
 */
export function useParallax(speed: number = 0.5) {
	const [offset, setOffset] = useState(0);
	const elementRef = useRef<HTMLElement>(null);
	const { shouldAnimate } = useOptimizedAnimation();

	useEffect(() => {
		if (!shouldAnimate) return;

		const handleScroll = createThrottledAnimationTrigger(() => {
			const element = elementRef.current;
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const scrolled = window.pageYOffset;
			const rate = scrolled * speed;

			setOffset(rate);
		}, 16);

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [speed, shouldAnimate]);

	return {
		ref: elementRef,
		offset,
		style: shouldAnimate
			? {
					transform: `translateY(${offset}px)`,
			  }
			: {},
	};
}

/**
 * 鼠标跟随动画 Hook
 */
export function useMouseFollow(sensitivity: number = 0.1) {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const elementRef = useRef<HTMLElement>(null);
	const { shouldAnimate } = useOptimizedAnimation();

	useEffect(() => {
		if (!shouldAnimate) return;

		const handleMouseMove = createThrottledAnimationTrigger((e: MouseEvent) => {
			const element = elementRef.current;
			if (!element) return;

			const rect = element.getBoundingClientRect();
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;

			const deltaX = (e.clientX - centerX) * sensitivity;
			const deltaY = (e.clientY - centerY) * sensitivity;

			setPosition({ x: deltaX, y: deltaY });
		}, 16);

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [sensitivity, shouldAnimate]);

	return {
		ref: elementRef,
		position,
		style: shouldAnimate
			? {
					transform: `translate(${position.x}px, ${position.y}px)`,
			  }
			: {},
	};
}

/**
 * 交错动画 Hook
 */
export function useStaggerAnimation(itemCount: number, delay: number = 0.1) {
	const [animatedItems, setAnimatedItems] = useState<Set<number>>(new Set());
	const { shouldAnimate, getDuration, getDelay } = useOptimizedAnimation();

	const animateItem = useCallback(
		(index: number) => {
			if (!shouldAnimate) {
				setAnimatedItems(prev => new Set([...prev, index]));
				return;
			}

			setTimeout(() => {
				setAnimatedItems(prev => new Set([...prev, index]));
			}, getDelay(delay * index));
		},
		[shouldAnimate, delay, getDelay]
	);

	const animateAll = useCallback(() => {
		for (let i = 0; i < itemCount; i++) {
			animateItem(i);
		}
	}, [itemCount, animateItem]);

	const reset = useCallback(() => {
		setAnimatedItems(new Set());
	}, []);

	const isItemAnimated = useCallback(
		(index: number) => {
			return animatedItems.has(index);
		},
		[animatedItems]
	);

	return {
		animateItem,
		animateAll,
		reset,
		isItemAnimated,
		animatedCount: animatedItems.size,
		progress: animatedItems.size / itemCount,
	};
}

/**
 * 弹簧动画 Hook
 */
export function useSpringAnimation(
	from: Record<string, number>,
	to: Record<string, number>,
	config: typeof optimizedSpringConfig.smooth = optimizedSpringConfig.smooth
) {
	const [values, setValues] = useState(from);
	const [isAnimating, setIsAnimating] = useState(false);
	const { shouldAnimate } = useOptimizedAnimation();

	const animate = useCallback(() => {
		if (!shouldAnimate) {
			setValues(to);
			return;
		}

		setIsAnimating(true);

		// 简化的弹簧动画实现
		const startTime = performance.now();
		const duration = 1000; // 1秒

		const animateFrame = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// 简单的缓动函数
			const easeProgress = 1 - Math.pow(1 - progress, 3);

			const currentValues: Record<string, number> = {};
			Object.keys(from).forEach(key => {
				const fromValue = from[key];
				const toValue = to[key];
				currentValues[key] = fromValue + (toValue - fromValue) * easeProgress;
			});

			setValues(currentValues);

			if (progress < 1) {
				requestAnimationFrame(animateFrame);
			} else {
				setIsAnimating(false);
			}
		};

		requestAnimationFrame(animateFrame);
	}, [from, to, shouldAnimate]);

	return {
		values,
		isAnimating,
		animate,
	};
}

/**
 * 防抖动画触发 Hook
 */
export function useDebouncedAnimation(callback: () => void, delay: number = 300) {
	const debouncedTrigger = useMemo(() => {
		return createDebouncedAnimationTrigger(callback, delay);
	}, [callback, delay]);

	return debouncedTrigger;
}

/**
 * 节流动画触发 Hook
 */
export function useThrottledAnimation(callback: () => void, delay: number = 16) {
	const throttledTrigger = useMemo(() => {
		return createThrottledAnimationTrigger(callback, delay);
	}, [callback, delay]);

	return throttledTrigger;
}
