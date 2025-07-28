// 现有动画组件导出
export {
  ScrollReveal,
  ScrollRevealContainer,
  ScrollRevealItem,
  ScrollRevealCounter,
  ScrollRevealTypewriter,
  ScrollRevealProgressBar,
} from "./ScrollReveal";
export { AnimatedDiv } from "./AnimatedDiv";
export { TypewriterText } from "./TypewriterText";
export { AnimatedGradient } from "./AnimatedGradient";
export { AnimatedList } from "./AnimatedList";
export { DynamicBackground } from "./DynamicBackground";
export { InteractiveElements } from "./InteractiveElements";
export { MicroInteraction } from "./MicroInteractions";
export { MouseFollowParticles } from "./MouseFollowParticles";
export { OptimizedMotion } from "./OptimizedMotion";
export { PageTransition } from "./PageTransition";
export { PerformanceOptimizedWrapper } from "./PerformanceOptimizedWrapper";
export { PersonalizedGreeting } from "./PersonalizedGreeting";

// 新增视觉特效组件导出
export { BreathingAnimation } from "./BreathingAnimation";
export { MagneticHover } from "./MagneticHover";
export { ParallaxItem, ParallaxContainer } from "./ParallaxItem";

// 类型导入（用于内部函数）
import type {
  ParallaxLayer,
  ContentType,
  AnimationConfig,
  AnimationPerformanceConfig,
} from "./types";

// 类型导出
export type {
  BreathingAnimationProps,
  MagneticHoverProps,
  ParallaxItemProps,
  ParallaxContainerProps,
  ScrollIndicatorProps,
  ContentType,
  ParallaxLayer,
  AnimationConfig,
  AnimationPerformanceConfig,
  ThemeAnimationConfig,
  AnimationComponents,
  AnimationCallbacks,
  ExtendedBreathingAnimationProps,
  ExtendedMagneticHoverProps,
  ExtendedParallaxItemProps,
} from "./types";

// 默认动画配置
export const defaultAnimationConfig: AnimationConfig = {
  breathing: {
    landscape: 8, // 风景图片 8 秒周期
    portrait: 5, // 人像图片 5 秒周期
    article: 7, // 文章卡片 7 秒周期
    default: 6, // 默认 6 秒周期
  },
  magnetic: {
    gallery: 0.15, // Gallery 图片磁吸强度
    blog: 0.1, // Blog 卡片磁吸强度
    default: 0.12, // 默认磁吸强度
  },
  parallax: {
    intensity: 0.5, // 默认视差强度
    layers: 3, // 视差层级数量
  },
};

// 性能优化配置
export const defaultPerformanceConfig: AnimationPerformanceConfig = {
  enableGPUAcceleration: true,
  respectReducedMotion: true,
  optimizeForMobile: true,
  viewportMargin: "100px 0px 100px 0px",
};

// 工具函数：获取内容类型对应的动画周期
export function getBreathingDuration(contentType: ContentType): number {
  return defaultAnimationConfig.breathing[contentType];
}

// 工具函数：获取磁吸强度
export function getMagneticStrength(
  context: "gallery" | "blog" | "default"
): number {
  return defaultAnimationConfig.magnetic[context];
}

// 工具函数：计算视差层级
export function getParallaxLayer(index: number): ParallaxLayer {
  return (index % 3) as ParallaxLayer;
}

// 工具函数：计算动画延迟
export function getAnimationDelay(
  index: number,
  baseDelay: number = 0.3
): number {
  return index * baseDelay;
}

// 工具函数：检测是否支持动画
export function supportsAnimation(): boolean {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return !mediaQuery.matches;
}

// 工具函数：检测是否为触摸设备
export function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;

  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// 工具函数：获取设备类型优化的动画参数
export function getOptimizedAnimationParams(isMobile: boolean = false) {
  return {
    strength: isMobile ? 0.7 : 1, // 移动端减少动画强度
    duration: isMobile ? 1.2 : 1, // 移动端稍慢的动画
    intensity: isMobile ? 0.8 : 1, // 移动端减少视差强度
  };
}
