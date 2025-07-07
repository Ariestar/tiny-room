import { Variants, Transition } from "framer-motion";

// 缓动函数预设
export const easings = {
	easeInOut: [0.4, 0, 0.2, 1],
	easeOut: [0, 0, 0.2, 1],
	easeIn: [0.4, 0, 1, 1],
	spring: { type: "spring", damping: 25, stiffness: 120 },
	springSoft: { type: "spring", damping: 30, stiffness: 100 },
	springBouncy: { type: "spring", damping: 15, stiffness: 200 },
} as const;

// 持续时间预设 - 与CSS变量保持一致
export const durations = {
	fast: 0.15, // 150ms - 微交互、按钮状态
	normal: 0.3, // 300ms - 标准过渡、悬停效果
	slow: 0.5, // 500ms - 页面转场、复杂动画
	verySlow: 0.8, // 800ms - 大型动画、强调效果
} as const;

// 基础动画变体
export const fadeVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const slideUpVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const slideDownVariants: Variants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		y: 20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const slideLeftVariants: Variants = {
	hidden: { opacity: 0, x: 20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		x: -20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const slideRightVariants: Variants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		x: 20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const scaleVariants: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const scaleSpringVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: easings.springSoft,
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const bounceVariants: Variants = {
	hidden: { opacity: 0, y: 20, scale: 0.9 },
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: easings.springBouncy,
	},
	exit: {
		opacity: 0,
		y: 20,
		scale: 0.9,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const rotateVariants: Variants = {
	hidden: { opacity: 0, rotate: -10, scale: 0.95 },
	visible: {
		opacity: 1,
		rotate: 0,
		scale: 1,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		rotate: 10,
		scale: 0.95,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

// 容器动画（用于列表动画）
export const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		transition: {
			staggerChildren: 0.05,
			staggerDirection: -1,
		},
	},
};

export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: durations.normal, ease: easings.easeOut },
	},
	exit: {
		opacity: 0,
		y: -20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

// 悬停动画
export const hoverVariants: Variants = {
	rest: { scale: 1 },
	hover: {
		scale: 1.05,
		transition: { duration: durations.fast, ease: easings.easeOut },
	},
};

export const hoverLiftVariants: Variants = {
	rest: { y: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)" },
	hover: {
		y: -4,
		boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
		transition: { duration: durations.fast, ease: easings.easeOut },
	},
};

export const hoverGlowVariants: Variants = {
	rest: { boxShadow: "0 0 0 rgba(0, 112, 243, 0)" },
	hover: {
		boxShadow: "0 0 20px rgba(0, 112, 243, 0.3)",
		transition: { duration: durations.fast, ease: easings.easeOut },
	},
};

// 点击动画
export const tapVariants: Variants = {
	tap: { scale: 0.95 },
};

export const tapSpringVariants: Variants = {
	tap: { scale: 0.95, transition: easings.spring },
};

// 加载动画
export const pulseVariants: Variants = {
	pulse: {
		scale: [1, 1.05, 1],
		transition: {
			duration: 2,
			repeat: Infinity,
			ease: easings.easeInOut,
		},
	},
};

export const spinVariants: Variants = {
	spin: {
		rotate: 360,
		transition: {
			duration: 1,
			repeat: Infinity,
			ease: "linear",
		},
	},
};

export const bounceInfiniteVariants: Variants = {
	bounce: {
		y: [0, -10, 0],
		transition: {
			duration: 1.5,
			repeat: Infinity,
			ease: easings.easeInOut,
		},
	},
};

// 页面过渡动画
export const pageVariants: Variants = {
	initial: { opacity: 0, x: -20 },
	in: { opacity: 1, x: 0 },
	out: { opacity: 0, x: 20 },
};

export const pageTransition: Transition = {
	type: "tween",
	ease: easings.easeInOut,
	duration: durations.normal,
};

// 模态框动画
export const modalVariants: Variants = {
	hidden: { opacity: 0, scale: 0.8, y: 20 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			duration: durations.normal,
			ease: easings.easeOut,
			scale: easings.springSoft,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		y: 20,
		transition: { duration: durations.fast, ease: easings.easeIn },
	},
};

export const overlayVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: durations.fast },
	},
	exit: {
		opacity: 0,
		transition: { duration: durations.fast },
	},
};

// 工具函数
export const createDelayedVariants = (delay: number = 0): Variants => ({
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: durations.normal,
			ease: easings.easeOut,
			delay,
		},
	},
});

export const createStaggerVariants = (staggerDelay: number = 0.1): Variants => ({
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: staggerDelay,
			delayChildren: 0.1,
		},
	},
});

// 路径动画（用于SVG）
export const drawVariants: Variants = {
	hidden: { pathLength: 0, opacity: 0 },
	visible: {
		pathLength: 1,
		opacity: 1,
		transition: {
			pathLength: { duration: 2, ease: easings.easeInOut },
			opacity: { duration: 0.5 },
		},
	},
};

// 文字动画
export const textVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: {
			delay: i * 0.1,
			duration: durations.normal,
			ease: easings.easeOut,
		},
	}),
};

// 导出所有预设
export const animationPresets = {
	fade: fadeVariants,
	slideUp: slideUpVariants,
	slideDown: slideDownVariants,
	slideLeft: slideLeftVariants,
	slideRight: slideRightVariants,
	scale: scaleVariants,
	scaleSpring: scaleSpringVariants,
	bounce: bounceVariants,
	rotate: rotateVariants,
	container: containerVariants,
	item: itemVariants,
	hover: hoverVariants,
	hoverLift: hoverLiftVariants,
	hoverGlow: hoverGlowVariants,
	tap: tapVariants,
	tapSpring: tapSpringVariants,
	pulse: pulseVariants,
	spin: spinVariants,
	bounceInfinite: bounceInfiniteVariants,
	page: pageVariants,
	modal: modalVariants,
	overlay: overlayVariants,
	draw: drawVariants,
	text: textVariants,
};
