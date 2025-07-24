/**
 * Hooks 模块统一导出
 * Hooks Module Exports
 */

// 性能监控 Hooks
export * from "./usePerformance";

// 响应式设计 Hooks
export * from "./useResponsive";

// 动画 Hooks
export * from "./useAnimation";

// 图片处理 Hooks
export * from "./useImage";

// 便捷导出
export {
  // 性能监控
  usePerformance,
  useWebVitals,
  usePerformanceBudget,
  useMemoryMonitoring,
  useNetworkMonitoring,
  useResourceMonitoring,
  useComprehensivePerformance,
} from "./usePerformance";

export {
  // 响应式设计
  useResponsive,
  useBreakpoint,
  useResponsiveValue,
  useMobileOptimization,
  useResponsiveLayout,
  useMobileAnimationConfig,
  useMobileTouchOptimization,
  useMobileLayoutOptimization,
  useMobilePerformanceOptimization,
  useOrientation,
  useContainerQuery,
} from "./useResponsive";

export {
  // 动画
  useAnimationPerformance,
  useResponsiveAnimation,
  useAnimationState,
  useScrollAnimation,
  useParallax,
  useMouseFollow,
  useStaggerAnimation,
  useSpringAnimation,
  useDebouncedAnimation,
  useThrottledAnimation,
} from "./useAnimation";

export {
  // 图片处理
  useImageLoad,
  useImageLazyLoad,
  useResponsiveImage,
  useImagePreloader,
  useImagePerformance,
  useAdaptiveImageQuality,
  useImageFormatSupport,
} from "./useImage";
