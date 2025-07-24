/**
 * 统一响应式设计工具
 * Unified Responsive Design Utilities
 */

// 断点定义（移动优先）
export const breakpoints = {
  xs: 0, // 超小屏幕（手机竖屏）
  sm: 640, // 小屏幕（手机横屏）
  md: 768, // 中等屏幕（平板竖屏）
  lg: 1024, // 大屏幕（平板横屏/小笔记本）
  xl: 1280, // 超大屏幕（桌面）
  "2xl": 1536, // 超超大屏幕（大桌面）
} as const;

export type Breakpoint = keyof typeof breakpoints;
export type BreakpointKey = keyof typeof breakpoints;

// 媒体查询字符串生成
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  "2xl": `(min-width: ${breakpoints["2xl"]}px)`,

  // 最大宽度查询
  "max-xs": `(max-width: ${breakpoints.sm - 1}px)`,
  "max-sm": `(max-width: ${breakpoints.md - 1}px)`,
  "max-md": `(max-width: ${breakpoints.lg - 1}px)`,
  "max-lg": `(max-width: ${breakpoints.xl - 1}px)`,
  "max-xl": `(max-width: ${breakpoints["2xl"] - 1}px)`,

  // 范围查询
  "sm-only": `(min-width: ${breakpoints.sm}px) and (max-width: ${
    breakpoints.md - 1
  }px)`,
  "md-only": `(min-width: ${breakpoints.md}px) and (max-width: ${
    breakpoints.lg - 1
  }px)`,
  "lg-only": `(min-width: ${breakpoints.lg}px) and (max-width: ${
    breakpoints.xl - 1
  }px)`,

  // 设备特定查询
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${
    breakpoints.lg - 1
  }px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,

  // 方向查询
  portrait: "(orientation: portrait)",
  landscape: "(orientation: landscape)",

  // 触摸设备
  touch: "(hover: none) and (pointer: coarse)",
  "no-touch": "(hover: hover) and (pointer: fine)",

  // 高分辨率屏幕
  retina: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",

  // 减少动画偏好
  "reduced-motion": "(prefers-reduced-motion: reduce)",
  "no-reduced-motion": "(prefers-reduced-motion: no-preference)",

  // 颜色主题偏好
  "dark-mode": "(prefers-color-scheme: dark)",
  "light-mode": "(prefers-color-scheme: light)",

  // 对比度偏好
  "high-contrast": "(prefers-contrast: high)",
  "low-contrast": "(prefers-contrast: low)",
} as const;

/**
 * 媒体查询生成器
 */
export const mediaQuery = {
  up: (breakpoint: BreakpointKey) =>
    `@media (min-width: ${breakpoints[breakpoint]}px)`,

  down: (breakpoint: BreakpointKey) =>
    `@media (max-width: ${breakpoints[breakpoint] - 0.1}px)`,

  between: (start: BreakpointKey, end: BreakpointKey) =>
    `@media (min-width: ${breakpoints[start]}px) and (max-width: ${
      breakpoints[end] - 0.1
    }px)`,

  only: (breakpoint: BreakpointKey) => {
    const keys = Object.keys(breakpoints) as BreakpointKey[];
    const index = keys.indexOf(breakpoint);
    const nextBreakpoint = keys[index + 1];

    return nextBreakpoint
      ? mediaQuery.between(breakpoint, nextBreakpoint)
      : mediaQuery.up(breakpoint);
  },
};

/**
 * 设备检测工具
 */
export const deviceDetection = {
  // 检测是否为移动设备
  isMobile: (): boolean => {
    if (typeof window === "undefined") return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // 检测是否为平板设备
  isTablet: (): boolean => {
    if (typeof window === "undefined") return false;

    return /(iPad|tablet|Tablet|Android(?!.*Mobile))/i.test(
      navigator.userAgent
    );
  },

  // 检测是否为触摸设备
  isTouchDevice: (): boolean => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  },

  // 检测是否为桌面设备
  isDesktop: (): boolean => {
    return !deviceDetection.isMobile() && !deviceDetection.isTablet();
  },

  // 检测屏幕方向
  getOrientation: (): "portrait" | "landscape" => {
    if (typeof window === "undefined") return "portrait";

    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  },

  // 检测是否为高分辨率屏幕
  isRetinaDisplay: (): boolean => {
    if (typeof window === "undefined") return false;
    return window.devicePixelRatio > 1;
  },

  // 获取设备像素比
  getDevicePixelRatio: (): number => {
    if (typeof window === "undefined") return 1;
    return window.devicePixelRatio || 1;
  },
};

/**
 * 当前断点检测
 */
export const getCurrentBreakpoint = (): Breakpoint => {
  if (typeof window === "undefined") return "lg"; // SSR 默认值

  const width = window.innerWidth;

  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return "xs";
};

/**
 * 检查是否匹配特定断点
 */
export const matchesBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

/**
 * 响应式值选择器
 */
export const getResponsiveValue = <T>(
  values: Partial<Record<Breakpoint, T>>,
  fallback: T
): T => {
  if (typeof window === "undefined") return fallback;

  const currentBreakpoint = getCurrentBreakpoint();
  const breakpointOrder: Breakpoint[] = ["2xl", "xl", "lg", "md", "sm", "xs"];

  // 从当前断点开始，向下查找可用值
  const startIndex = breakpointOrder.indexOf(currentBreakpoint);
  for (let i = startIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      return values[bp]!;
    }
  }

  return fallback;
};

/**
 * 响应式布局助手
 */
export const responsiveLayout = {
  // 根据屏幕大小获取列数
  getColumnCount: (screenWidth: number): number => {
    if (screenWidth < breakpoints.sm) return 1; // 手机竖屏
    if (screenWidth < breakpoints.md) return 2; // 手机横屏
    if (screenWidth < breakpoints.lg) return 3; // 平板竖屏
    if (screenWidth < breakpoints.xl) return 4; // 平板横屏/小型笔记本
    return 5; // 桌面显示器
  },

  // 根据屏幕大小获取间距大小
  getSpacing: (screenWidth: number): number => {
    if (screenWidth < breakpoints.sm) return 8; // 手机竖屏
    if (screenWidth < breakpoints.md) return 12; // 手机横屏
    if (screenWidth < breakpoints.lg) return 16; // 平板竖屏
    if (screenWidth < breakpoints.xl) return 20; // 平板横屏/小型笔记本
    return 24; // 桌面显示器
  },

  // 根据屏幕大小获取字体大小
  getFontSize: (screenWidth: number, baseSize: number = 16): number => {
    if (screenWidth < breakpoints.sm) return baseSize * 0.875; // 手机竖屏
    if (screenWidth < breakpoints.md) return baseSize * 0.9375; // 手机横屏
    if (screenWidth < breakpoints.lg) return baseSize; // 平板竖屏
    if (screenWidth < breakpoints.xl) return baseSize * 1.0625; // 平板横屏/小型笔记本
    return baseSize * 1.125; // 桌面显示器
  },

  // 计算响应式图片尺寸
  getImageSize: (
    screenWidth: number,
    containerWidth: number = 1200
  ): number => {
    const ratio = screenWidth / containerWidth;
    return Math.min(screenWidth, containerWidth) * ratio;
  },

  // 获取响应式网格配置
  getGridConfig: (screenWidth: number) => {
    if (screenWidth < breakpoints.sm) {
      return {
        columns: 1,
        gap: 16,
        itemWidth: "100%",
      };
    }

    if (screenWidth < breakpoints.md) {
      return {
        columns: 2,
        gap: 16,
        itemWidth: "calc(50% - 8px)",
      };
    }

    if (screenWidth < breakpoints.lg) {
      return {
        columns: 3,
        gap: 20,
        itemWidth: "calc(33.333% - 14px)",
      };
    }

    if (screenWidth < breakpoints.xl) {
      return {
        columns: 4,
        gap: 24,
        itemWidth: "calc(25% - 18px)",
      };
    }

    return {
      columns: 5,
      gap: 24,
      itemWidth: "calc(20% - 20px)",
    };
  },
};

/**
 * 视口单位转换工具
 */
export const viewportUnits = {
  // 将像素转换为vw单位
  pxToVw: (px: number, viewportWidth: number = 1920): string => {
    return `${(px / viewportWidth) * 100}vw`;
  },

  // 将像素转换为vh单位
  pxToVh: (px: number, viewportHeight: number = 1080): string => {
    return `${(px / viewportHeight) * 100}vh`;
  },

  // 将像素转换为vmin单位
  pxToVmin: (px: number, minViewport: number = 1080): string => {
    return `${(px / minViewport) * 100}vmin`;
  },

  // 将像素转换为vmax单位
  pxToVmax: (px: number, maxViewport: number = 1920): string => {
    return `${(px / maxViewport) * 100}vmax`;
  },

  // 计算响应式字体大小（结合rem和vw）
  responsiveFontSize: (minSize: number, maxSize: number): string => {
    const minWidth = breakpoints.sm;
    const maxWidth = breakpoints.xl;

    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const yAxisIntersection = -minWidth * slope + minSize;

    return `clamp(${minSize}px, ${yAxisIntersection.toFixed(4)}px + ${(
      slope * 100
    ).toFixed(4)}vw, ${maxSize}px)`;
  },
};

/**
 * 移动端优化助手
 */
export const mobileOptimization = {
  // 获取适合触摸的元素尺寸
  getTouchTargetSize: () => {
    return {
      minWidth: "44px",
      minHeight: "44px",
    };
  },

  // 获取移动端友好的间距
  getMobileSpacing: () => {
    return {
      xs: "4px",
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
    };
  },

  // 检查是否需要简化界面
  shouldSimplifyUI: (): boolean => {
    if (typeof window === "undefined") return false;

    // 检查屏幕尺寸和设备类型
    const isSmallScreen = window.innerWidth < breakpoints.md;
    const isMobileDevice = deviceDetection.isMobile();

    return isSmallScreen || isMobileDevice;
  },

  // 获取移动端优化的动画配置
  getMobileAnimationConfig: () => {
    return {
      reducedMotion: true,
      duration: 0.2,
      disableParallax: true,
      disableAutoplay: true,
    };
  },

  // 移动端优化配置
  config: {
    // 触摸目标最小尺寸（44px Apple HIG）
    minTouchTarget: "44px",

    // 安全区域
    safeArea: {
      top: "env(safe-area-inset-top)",
      right: "env(safe-area-inset-right)",
      bottom: "env(safe-area-inset-bottom)",
      left: "env(safe-area-inset-left)",
    },

    // 移动端字体大小调整
    textSizeAdjust: "none",

    // 触摸滚动优化
    touchScrolling: "touch",

    // 点击延迟消除
    touchAction: "manipulation",

    // 移动端视口配置
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 5,
      minimumScale: 1,
      userScalable: "yes",
      viewportFit: "cover",
    },
  },
};

/**
 * 响应式图片配置
 */
export const responsiveImages = {
  // 获取响应式图片尺寸
  getSizes: (
    imageType: "thumbnail" | "banner" | "gallery" | "avatar" = "thumbnail"
  ): string => {
    switch (imageType) {
      case "thumbnail":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
      case "banner":
        return "100vw";
      case "gallery":
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";
      case "avatar":
        return "(max-width: 640px) 60px, 80px";
      default:
        return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    }
  },

  // 获取响应式图片宽度
  getWidths: (
    imageType: "thumbnail" | "banner" | "gallery" | "avatar" = "thumbnail"
  ): number[] => {
    switch (imageType) {
      case "thumbnail":
        return [320, 640, 960];
      case "banner":
        return [640, 960, 1280, 1920];
      case "gallery":
        return [320, 480, 640, 960];
      case "avatar":
        return [60, 80, 120];
      default:
        return [320, 640, 960];
    }
  },
};

/**
 * 容器最大宽度配置
 */
export const containerMaxWidths = {
  xs: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

/**
 * 网格系统配置
 */
export const gridSystem = {
  columns: 12,
  gutters: {
    xs: "1rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "2.5rem",
    xl: "3rem",
    "2xl": "3.5rem",
  },
  margins: {
    xs: "1rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "3rem",
    xl: "4rem",
    "2xl": "5rem",
  },
} as const;

/**
 * 响应式组件配置
 */
export const responsiveComponents = {
  // 获取响应式卡片配置
  getCardConfig: (screenWidth: number) => {
    if (screenWidth < breakpoints.sm) {
      return {
        padding: "12px",
        borderRadius: "8px",
        titleSize: "16px",
        descriptionSize: "14px",
      };
    }

    if (screenWidth < breakpoints.lg) {
      return {
        padding: "16px",
        borderRadius: "12px",
        titleSize: "18px",
        descriptionSize: "14px",
      };
    }

    return {
      padding: "24px",
      borderRadius: "16px",
      titleSize: "20px",
      descriptionSize: "16px",
    };
  },

  // 获取响应式按钮配置
  getButtonConfig: (screenWidth: number) => {
    if (screenWidth < breakpoints.sm) {
      return {
        padding: "8px 16px",
        fontSize: "14px",
        borderRadius: "6px",
        iconSize: "16px",
      };
    }

    if (screenWidth < breakpoints.lg) {
      return {
        padding: "10px 20px",
        fontSize: "15px",
        borderRadius: "8px",
        iconSize: "18px",
      };
    }

    return {
      padding: "12px 24px",
      fontSize: "16px",
      borderRadius: "8px",
      iconSize: "20px",
    };
  },
};

/**
 * 性能优化配置
 */
export const performanceOptimizations = {
  // 图片懒加载阈值
  lazyLoadThreshold: {
    mobile: "100px",
    tablet: "200px",
    desktop: "300px",
  },

  // 动画性能配置
  animations: {
    mobile: {
      duration: "200ms",
      easing: "ease-out",
    },
    desktop: {
      duration: "300ms",
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },

  // 代码分割阈值
  codeSplitting: {
    chunkSize: {
      mobile: "50kb",
      desktop: "100kb",
    },
  },
} as const;

// 便捷的检查函数
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = (): boolean => {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
};

export const isDesktop = (): boolean => {
  if (typeof window === "undefined") return true; // SSR 默认为桌面
  return window.innerWidth >= breakpoints.lg;
};

// 导出默认配置
export const defaultResponsiveConfig = {
  breakpoints,
  mediaQueries,
  mediaQuery,
  deviceDetection,
  responsiveLayout,
  viewportUnits,
  mobileOptimization,
  responsiveImages,
  containerMaxWidths,
  gridSystem,
  responsiveComponents,
  performanceOptimizations,
} as const;
