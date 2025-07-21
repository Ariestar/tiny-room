/**
 * 动画性能优化工具函数
 * 提供高性能的动画配置和工具
 */

import { Variants, Transition } from "framer-motion";

// 检查用户是否偏好减少动画
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// 高性能的动画变体配置
export const performantVariants = {
  // 淡入淡出 - 使用 opacity
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // 滑动 - 使用 transform
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as Variants,

  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  } as Variants,

  slideLeft: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as Variants,

  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  } as Variants,

  // 缩放 - 使用 transform scale
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  } as Variants,

  // 旋转 - 使用 transform rotate
  rotateIn: {
    initial: { opacity: 0, rotate: -10 },
    animate: { opacity: 1, rotate: 0 },
    exit: { opacity: 0, rotate: 10 },
  } as Variants,

  // 弹跳效果
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,

  // 脉冲效果
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,
};

// 高性能的过渡配置
export const performantTransitions = {
  // 快速过渡
  fast: {
    duration: 0.2,
    ease: "easeOut",
  } as Transition,

  // 标准过渡
  default: {
    duration: 0.3,
    ease: "easeOut",
  } as Transition,

  // 慢速过渡
  slow: {
    duration: 0.5,
    ease: "easeOut",
  } as Transition,

  // 弹性过渡
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as Transition,

  // 平滑弹性
  smoothSpring: {
    type: "spring",
    stiffness: 100,
    damping: 20,
  } as Transition,

  // 延迟过渡
  delayed: (delay: number) =>
    ({
      duration: 0.3,
      ease: "easeOut",
      delay,
    } as Transition),

  // 交错动画
  stagger: (staggerChildren: number = 0.1) =>
    ({
      staggerChildren,
      delayChildren: 0.1,
    } as Transition),
};

// 性能优化的动画配置
export const optimizedAnimationConfig = {
  // 启用硬件加速的属性
  hardwareAccelerated: ["opacity", "transform", "filter", "backdrop-filter"],

  // 避免使用的属性（会触发重排）
  avoidProperties: [
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    "margin",
    "padding",
  ],

  // will-change 优化
  willChange: {
    transform: "transform",
    opacity: "opacity",
    filter: "filter",
    auto: "auto",
  },
};

// 创建响应式动画配置
export const createResponsiveAnimation = (
  baseVariants: Variants,
  reducedMotionVariants?: Variants
): Variants => {
  if (prefersReducedMotion()) {
    return (
      reducedMotionVariants || {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    );
  }
  return baseVariants;
};

// 动画性能监控
export const animationPerformanceMonitor = {
  // 监控动画帧率
  monitorFPS: () => {
    if (typeof window === "undefined") return;

    let lastTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    const measureFPS = (currentTime: number) => {
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // 如果 FPS 低于 30，发出警告
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}fps`);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
    return fps;
  },

  // 检查是否支持硬件加速
  supportsHardwareAcceleration: () => {
    if (typeof window === "undefined") return false;

    const testElement = document.createElement("div");
    testElement.style.transform = "translateZ(0)";
    document.body.appendChild(testElement);

    const computedStyle = window.getComputedStyle(testElement);
    const supportsTransform3d = computedStyle.transform !== "none";

    document.body.removeChild(testElement);
    return supportsTransform3d;
  },
};

// 动画优化 Hook 工具
export const useOptimizedAnimation = () => {
  const reducedMotion = prefersReducedMotion();

  return {
    // 获取优化的变体
    getVariants: (variants: Variants) => createResponsiveAnimation(variants),

    // 获取优化的过渡
    getTransition: (transition: Transition) =>
      reducedMotion ? { duration: 0.01 } : transition,

    // 是否应该禁用动画
    shouldReduceMotion: reducedMotion,

    // 获取性能友好的配置
    getPerformantConfig: () => ({
      layout: !reducedMotion,
      layoutId: !reducedMotion ? undefined : "static",
      transition: reducedMotion
        ? { duration: 0.01 }
        : performantTransitions.default,
    }),
  };
};

// CSS-in-JS 动画优化样式
export const optimizedAnimationStyles = {
  // 启用硬件加速
  enableHardwareAcceleration: {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden" as const,
    perspective: 1000,
  },

  // 优化重绘性能
  optimizeRepaint: {
    willChange: "transform, opacity",
    contain: "layout style paint" as const,
  },

  // 平滑滚动
  smoothScrolling: {
    scrollBehavior: "smooth" as const,
    WebkitOverflowScrolling: "touch" as const,
  },
};

// 动画调试工具
export const animationDebugger = {
  // 显示动画边界
  showAnimationBounds: (element: HTMLElement) => {
    element.style.outline = "2px solid red";
    element.style.outlineOffset = "2px";
  },

  // 记录动画性能
  logAnimationPerformance: (animationName: string, startTime: number) => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`Animation "${animationName}" took ${duration.toFixed(2)}ms`);
  },

  // 检查动画是否会触发重排
  checkForReflow: (properties: string[]) => {
    const reflowProperties = [
      "width",
      "height",
      "padding",
      "margin",
      "border",
      "top",
      "left",
      "right",
      "bottom",
      "position",
    ];

    const problematicProps = properties.filter((prop) =>
      reflowProperties.some((reflowProp) => prop.includes(reflowProp))
    );

    if (problematicProps.length > 0) {
      console.warn("These properties may cause reflow:", problematicProps);
    }

    return problematicProps.length === 0;
  },
};

// 导出默认配置
export const defaultAnimationConfig = {
  variants: performantVariants,
  transitions: performantTransitions,
  optimizations: optimizedAnimationConfig,
  styles: optimizedAnimationStyles,
};
