/**
 * UI 工具模块统一导出
 * UI Utilities Module Exports
 */

// 响应式设计
export * from "./responsive";

// 图片处理
export * from "./images";

// 动画工具
export * from "./animations";

// 样式系统
export * from "./styles";

// 便捷导出
export {
  // 响应式
  breakpoints,
  mediaQueries,
  deviceDetection,
  responsiveLayout,
  mobileOptimization,
  getCurrentBreakpoint,
  getResponsiveValue,
  isMobile,
  isTablet,
  isDesktop,
} from "./responsive";

export {
  // 图片优化
  ImageOptimizationUtils,
  formatOptimizer,
  preloader,
  responsiveCalculator,
  lazyLoader,
  qualityManager,
  errorHandler,
  performanceMonitor as imagePerformanceMonitor,
  utils as imageUtils,
} from "./images";

export {
  // 动画工具
  animationUtils,
  variants as animationVariants,
  springs as animationSprings,
  easings as animationEasings,
  parallax as parallaxConfig,
  pageTransitions,
  performanceMonitor as animationPerformanceMonitor,
  prefersReducedMotion,
  supportsHardwareAcceleration,
  createResponsiveAnimationConfig,
  useOptimizedAnimation,
} from "./animations";

export {
  // 样式系统
  styleUtils,
  fonts,
  fontVariables,
  fontClasses,
  fontSystem,
  cn,
  breakpoints,
} from "./styles";
