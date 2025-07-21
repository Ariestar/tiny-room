/**
 * 响应式断点系统
 * 提供移动优先的断点管理和响应式工具
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

// 当前断点检测
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

// 检查是否匹配特定断点
export const matchesBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

// 检查是否为移动设备
export const isMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.innerWidth < breakpoints.md;
};

// 检查是否为平板设备
export const isTablet = (): boolean => {
  if (typeof window === "undefined") return false;
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
};

// 检查是否为桌面设备
export const isDesktop = (): boolean => {
  if (typeof window === "undefined") return true; // SSR 默认为桌面
  return window.innerWidth >= breakpoints.lg;
};

// 检查是否为触摸设备
export const isTouchDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
};

// 检查是否为高分辨率屏幕
export const isRetinaDisplay = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.devicePixelRatio > 1;
};

// 获取设备像素比
export const getDevicePixelRatio = (): number => {
  if (typeof window === "undefined") return 1;
  return window.devicePixelRatio || 1;
};

// 响应式值选择器
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

// 容器最大宽度配置
export const containerMaxWidths = {
  xs: "100%",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// 网格系统配置
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

// 字体大小响应式配置
export const responsiveFontSizes = {
  xs: {
    "text-xs": "0.75rem",
    "text-sm": "0.875rem",
    "text-base": "1rem",
    "text-lg": "1.125rem",
    "text-xl": "1.25rem",
    "text-2xl": "1.5rem",
    "text-3xl": "1.875rem",
    "text-4xl": "2rem",
    "text-5xl": "2.5rem",
    "text-6xl": "3rem",
  },
  sm: {
    "text-4xl": "2.25rem",
    "text-5xl": "3rem",
    "text-6xl": "3.75rem",
  },
  md: {
    "text-4xl": "2.25rem",
    "text-5xl": "3rem",
    "text-6xl": "3.75rem",
    "text-7xl": "4.5rem",
  },
  lg: {
    "text-5xl": "3rem",
    "text-6xl": "3.75rem",
    "text-7xl": "4.5rem",
    "text-8xl": "6rem",
  },
} as const;

// 间距响应式配置
export const responsiveSpacing = {
  xs: {
    "space-1": "0.25rem",
    "space-2": "0.5rem",
    "space-3": "0.75rem",
    "space-4": "1rem",
    "space-6": "1.5rem",
    "space-8": "2rem",
    "space-12": "3rem",
    "space-16": "4rem",
  },
  md: {
    "space-6": "1.5rem",
    "space-8": "2rem",
    "space-12": "3rem",
    "space-16": "4rem",
    "space-20": "5rem",
    "space-24": "6rem",
  },
  lg: {
    "space-8": "2rem",
    "space-12": "3rem",
    "space-16": "4rem",
    "space-20": "5rem",
    "space-24": "6rem",
    "space-32": "8rem",
  },
} as const;

// 移动端优化配置
export const mobileOptimizations = {
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
} as const;

// 性能优化配置
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

// 导出默认配置
export const defaultResponsiveConfig = {
  breakpoints,
  mediaQueries,
  containerMaxWidths,
  gridSystem,
  responsiveFontSizes,
  responsiveSpacing,
  mobileOptimizations,
  performanceOptimizations,
} as const;
