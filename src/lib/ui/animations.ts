/**
 * 统一动画工具
 * Unified Animation Utilities
 */

/**
 * 检查用户是否偏好减少动画
 */
export function prefersReducedMotion(): boolean {
	if (typeof window === "undefined") return false;

	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

	// 从右侧滑入
	slideRight: {
		hidden: {
			opacity: 0,
			x: 20,
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

	// 从上方滑入
	slideDown: {
		hidden: {
			opacity: 0,
			y: -20,
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

	// 旋转淡入
	rotateIn: {
		hidden: {
			opacity: 0,
			rotate: -10,
			scale: 0.9,
			willChange: "transform, opacity",
		},
		visible: {
			opacity: 1,
			rotate: 0,
			scale: 1,
			willChange: "auto",
			transition: createResponsiveAnimationConfig({
				duration: 0.8,
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

	// 弹跳效果
	bounce: {
		rest: {
			y: 0,
			willChange: "auto",
		},
		bounce: {
			y: [-5, 0],
			willChange: "transform",
			transition: {
				duration: 0.6,
				repeat: Infinity,
				repeatType: "reverse" as const,
				ease: "easeInOut",
			},
		},
	},

	// 脉冲效果
	pulse: {
		rest: {
			scale: 1,
			willChange: "auto",
		},
		pulse: {
			scale: [1, 1.05, 1],
			willChange: "transform",
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
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

	// 缓慢平滑
	gentle: {
		type: "spring" as const,
		stiffness: 100,
		damping: 20,
		mass: 1.2,
	},
};

/**
 * 缓动函数配置
 */
export const easingConfig = {
	// 标准缓动 - Framer Motion 数组格式
	easeInOut: [0.4, 0, 0.2, 1],
	easeOut: [0, 0, 0.2, 1],
	easeIn: [0.4, 0, 1, 1],

	// 自定义缓动
	smooth: [0.25, 0.46, 0.45, 0.94],
	snappy: [0.68, -0.55, 0.265, 1.55],
	gentle: [0.25, 0.1, 0.25, 1],

	// 弹性缓动
	elastic: [0.68, -0.6, 0.32, 1.6],
	bounce: [0.68, -0.55, 0.265, 1.55],
};

/**
 * 创建优化的动画钩子配置
 */
export function useOptimizedAnimation() {
	const isReducedMotion = prefersReducedMotion();
	const supportsHW = supportsHardwareAcceleration();

	return {
		shouldReduceMotion: isReducedMotion,
		// 是否启用动画
		shouldAnimate: !isReducedMotion,

		// 是否支持硬件加速
		supportsHardwareAcceleration: supportsHW,

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

		// 获取优化的过渡配置
		getTransition: (transition: any) => {
			if (isReducedMotion) {
				return { duration: 0.1 };
			}
			return transition;
		},
	};
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
export function createThrottledAnimationTrigger<T extends any[]>(
	callback: (...args: T) => void,
	delay: number = 16 // ~60fps
) {
	let lastCall = 0;

	return (...args: T) => {
		const now = Date.now();
		if (now - lastCall >= delay) {
			lastCall = now;
			callback(...args);
		}
	};
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

/**
 * 交错动画配置生成器
 */
export function createStaggerConfig(
	itemCount: number,
	baseDelay: number = 0.1,
	maxDelay: number = 1
) {
	const isReducedMotion = prefersReducedMotion();

	if (isReducedMotion) {
		return {
			staggerChildren: 0,
			delayChildren: 0,
		};
	}

	const staggerDelay = Math.min(baseDelay, maxDelay / itemCount);

	return {
		staggerChildren: staggerDelay,
		delayChildren: 0.1,
	};
}

/**
 * 视差滚动配置
 */
export const parallaxConfig = {
	// 轻微视差
	subtle: {
		y: [0, -50],
		transition: {
			ease: "linear",
		},
	},

	// 中等视差
	moderate: {
		y: [0, -100],
		transition: {
			ease: "linear",
		},
	},

	// 强烈视差
	strong: {
		y: [0, -200],
		transition: {
			ease: "linear",
		},
	},
};

/**
 * 页面过渡动画
 */
export const pageTransitions = {
	// 淡入淡出
	fade: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3 },
	},

	// 滑动
	slide: {
		initial: { x: 300, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: -300, opacity: 0 },
		transition: { duration: 0.3, ease: "easeInOut" },
	},

	// 缩放
	scale: {
		initial: { scale: 0.8, opacity: 0 },
		animate: { scale: 1, opacity: 1 },
		exit: { scale: 0.8, opacity: 0 },
		transition: { duration: 0.3 },
	},
};

/**
 * 动画工具集合
 */
export const animationUtils = {
	// 检查函数
	prefersReducedMotion,
	supportsHardwareAcceleration,

	// 配置生成器
	createResponsiveAnimationConfig,
	createStaggerConfig,

	// 变体和配置
	variants: optimizedAnimationVariants,
	springs: optimizedSpringConfig,
	easings: easingConfig,
	parallax: parallaxConfig,
	pageTransitions,

	// 性能监控
	// 工具函数
	useOptimizedAnimation,
	createDebouncedAnimationTrigger,
	createThrottledAnimationTrigger,
	generateOptimizedAnimationClasses,
};

// 导出便捷访问
export const { variants, springs, easings, parallax } = animationUtils;
