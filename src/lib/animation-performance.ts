/**
 * Animation Performance Utilities
 * 动画性能优化工具函数
 */

/**
 * 检查用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;

	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * 创建响应式动画配置
 * 根据用户偏好自动调整动画参数
 */
export function createResponsiveAnimationConfig(config: {
	duration?: number;
	delay?: number;
	ease?: string;
	reducedMotionDuration?: number;
}) {
	const isReducedMotion = prefersReducedMotion();

	return {
		duration: isReducedMotion ? config.reducedMotionDuration ?? 0.1 : config.duration ?? 1,
		delay: isReducedMotion ? 0 : config.delay ?? 0,
		ease: config.ease ?? "easeOut",
	};
}

/**
 * 优化的动画变体
 * 使用 transform 和 opacity 进行硬件加速
 */
export const optimizedAnimationVariants = {
	// 淡入动画
	fadeIn: {
		hidden: {
			opacity: 0,
			willChange: "opacity",
		},
		visible: {
			opacity: 1,
			willChange: "auto",
			transition: createResponsiveAnimationConfig({ duration: 0.6 }),
		},
	},

	// 从下方滑入
	slideUp: {
		hidden: {
			opacity: 0,
			y: 20,
			willChange: "transform, opacity",
		},
		visible: {
			opacity: 1,
			y: 0,
			willChange: "auto",
			transition: createResponsiveAnimationConfig({
				duration: 0.6,
				ease: "easeOut",
			}),
		},
	},

	// 从左侧滑入
	slideLeft: {
		hidden: {
			opacity: 0,
			x: -20,
			willChange: "transform, opacity",
		},
		visible: {
			opacity: 1,
			x: 0,
			willChange: "auto",
			transition: createResponsiveAnimationConfig({
				duration: 0.6,
				ease: "easeOut",
			}),
		},
	},

	// 缩放动画
	scale: {
		hidden: {
			opacity: 0,
			scale: 0.8,
			willChange: "transform, opacity",
		},
		visible: {
			opacity: 1,
			scale: 1,
			willChange: "auto",
			transition: createResponsiveAnimationConfig({
				duration: 0.6,
				ease: "easeOut",
			}),
		},
	},

	// 悬停效果
	hover: {
		rest: {
			scale: 1,
			willChange: "auto",
		},
		hover: {
			scale: 1.05,
			willChange: "transform",
			transition: createResponsiveAnimationConfig({
				duration: 0.2,
				ease: "easeOut",
			}),
		},
	},

	// 点击效果
	tap: {
		rest: {
			scale: 1,
			willChange: "auto",
		},
		tap: {
			scale: 0.95,
			willChange: "transform",
			transition: createResponsiveAnimationConfig({ duration: 0.1 }),
		},
	},
};

/**
 * 性能优化的弹簧配置
 */
export const optimizedSpringConfig = {
	// 快速响应
	quick: {
		type: "spring" as const,
		stiffness: 300,
		damping: 30,
		mass: 0.8,
	},

	// 平滑过渡
	smooth: {
		type: "spring" as const,
		stiffness: 200,
		damping: 25,
		mass: 1,
	},

	// 弹性效果
	bouncy: {
		type: "spring" as const,
		stiffness: 400,
		damping: 20,
		mass: 0.6,
	},
};

/**
 * 创建优化的动画钩子
 */
export function useOptimizedAnimation() {
	const isReducedMotion = prefersReducedMotion();

	return {
		// 是否启用动画
		shouldAnimate: !isReducedMotion,

		// 获取优化的持续时间
		getDuration: (duration: number) => (isReducedMotion ? 0.1 : duration),

		// 获取优化的延迟
		getDelay: (delay: number) => (isReducedMotion ? 0 : delay),

		// 获取优化的变体
		getVariants: (variants: any) => {
			if (isReducedMotion) {
				// 简化动画，只保留透明度变化
				return {
					hidden: { opacity: 0 },
					visible: { opacity: 1, transition: { duration: 0.1 } },
				};
			}
			return variants;
		},
	};
}

/**
 * 动画性能监控
 */
export class AnimationPerformanceMonitor {
	private static instance: AnimationPerformanceMonitor;
	private animationCount = 0;
	private maxAnimations = 50; // 最大同时动画数量

	static getInstance() {
		if (!AnimationPerformanceMonitor.instance) {
			AnimationPerformanceMonitor.instance = new AnimationPerformanceMonitor();
		}
		return AnimationPerformanceMonitor.instance;
	}

	startAnimation() {
		this.animationCount++;
		if (this.animationCount > this.maxAnimations) {
			console.warn(`Animation count exceeded ${this.maxAnimations}. Consider optimizing.`);
		}
	}

	endAnimation() {
		this.animationCount = Math.max(0, this.animationCount - 1);
	}

	getAnimationCount() {
		return this.animationCount;
	}
}

/**
 * 防抖动画触发器
 */
export function createDebouncedAnimationTrigger(callback: () => void, delay: number = 100) {
	let timeoutId: NodeJS.Timeout;

	return () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(callback, delay);
	};
}

/**
 * 节流动画触发器
 */
export function createThrottledAnimationTrigger(
	callback: () => void,
	delay: number = 16 // ~60fps
) {
	let lastCall = 0;

	return () => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			callback();
		}
	};
}

/**
 * 检查是否支持硬件加速
 */
export function supportsHardwareAcceleration(): boolean {
	if (typeof window === "undefined") return false;

	const testElement = document.createElement("div");
	testElement.style.transform = "translateZ(0)";
	testElement.style.willChange = "transform";

	return testElement.style.transform !== "";
}

/**
 * 优化的 CSS 类名生成器
 */
export function generateOptimizedAnimationClasses(baseClass: string) {
	const isReducedMotion = prefersReducedMotion();
	const supportsHW = supportsHardwareAcceleration();

	const classes = [baseClass];

	if (!isReducedMotion && supportsHW) {
		classes.push("will-change-transform");
	}

	if (isReducedMotion) {
		classes.push("motion-reduce:transition-none");
	}

	return classes.join(" ");
}
