/**
 * 响应式设计工具函数
 * 提供移动端布局优化和响应式设计辅助功能
 */

// 断点配置
export const breakpoints = {
  xs: 0, // 超小屏幕（手机竖屏）
  sm: 640, // 小屏幕（手机横屏）
  md: 768, // 中等屏幕（平板竖屏）
  lg: 1024, // 大屏幕（平板横屏/小型笔记本）
  xl: 1280, // 超大屏幕（桌面显示器）
  "2xl": 1536, // 特大屏幕（大型显示器）
};

// 媒体查询生成器
export const mediaQuery = {
  up: (breakpoint: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[breakpoint]}px)`,

  down: (breakpoint: keyof typeof breakpoints) =>
    `@media (max-width: ${breakpoints[breakpoint] - 0.1}px)`,

  between: (start: keyof typeof breakpoints, end: keyof typeof breakpoints) =>
    `@media (min-width: ${breakpoints[start]}px) and (max-width: ${
      breakpoints[end] - 0.1
    }px)`,

  only: (breakpoint: keyof typeof breakpoints) => {
    const keys = Object.keys(breakpoints) as Array<keyof typeof breakpoints>;
    const index = keys.indexOf(breakpoint);
    const nextBreakpoint = keys[index + 1];

    return nextBreakpoint
      ? mediaQuery.between(breakpoint, nextBreakpoint)
      : mediaQuery.up(breakpoint);
  },
};

// 设备检测
export const deviceDetection = {
  // 检测是否为移动设备
  isMobile: () => {
    if (typeof window === "undefined") return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // 检测是否为平板设备
  isTablet: () => {
    if (typeof window === "undefined") return false;

    return /(iPad|tablet|Tablet|Android(?!.*Mobile))/i.test(
      navigator.userAgent
    );
  },

  // 检测是否为触摸设备
  isTouchDevice: () => {
    if (typeof window === "undefined") return false;

    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  },

  // 检测是否为桌面设备
  isDesktop: () => {
    return !deviceDetection.isMobile() && !deviceDetection.isTablet();
  },

  // 检测屏幕方向
  getOrientation: () => {
    if (typeof window === "undefined") return "portrait";

    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  },
};

// 响应式布局助手
export const responsiveLayout = {
  // 根据屏幕大小获取列数
  getColumnCount: (screenWidth: number) => {
    if (screenWidth < breakpoints.sm) return 1; // 手机竖屏
    if (screenWidth < breakpoints.md) return 2; // 手机横屏
    if (screenWidth < breakpoints.lg) return 3; // 平板竖屏
    if (screenWidth < breakpoints.xl) return 4; // 平板横屏/小型笔记本
    return 5; // 桌面显示器
  },

  // 根据屏幕大小获取间距大小
  getSpacing: (screenWidth: number) => {
    if (screenWidth < breakpoints.sm) return 8; // 手机竖屏
    if (screenWidth < breakpoints.md) return 12; // 手机横屏
    if (screenWidth < breakpoints.lg) return 16; // 平板竖屏
    if (screenWidth < breakpoints.xl) return 20; // 平板横屏/小型笔记本
    return 24; // 桌面显示器
  },

  // 根据屏幕大小获取字体大小
  getFontSize: (screenWidth: number, baseSize: number = 16) => {
    if (screenWidth < breakpoints.sm) return baseSize * 0.875; // 手机竖屏
    if (screenWidth < breakpoints.md) return baseSize * 0.9375; // 手机横屏
    if (screenWidth < breakpoints.lg) return baseSize; // 平板竖屏
    if (screenWidth < breakpoints.xl) return baseSize * 1.0625; // 平板横屏/小型笔记本
    return baseSize * 1.125; // 桌面显示器
  },

  // 计算响应式图片尺寸
  getImageSize: (screenWidth: number, containerWidth: number = 1200) => {
    const ratio = screenWidth / containerWidth;
    return Math.min(screenWidth, containerWidth) * ratio;
  },
};

// 视口单位转换
export const viewportUnits = {
  // 将像素转换为vw单位
  pxToVw: (px: number, viewportWidth: number = 1920) => {
    return `${(px / viewportWidth) * 100}vw`;
  },

  // 将像素转换为vh单位
  pxToVh: (px: number, viewportHeight: number = 1080) => {
    return `${(px / viewportHeight) * 100}vh`;
  },

  // 将像素转换为vmin单位
  pxToVmin: (px: number, minViewport: number = 1080) => {
    return `${(px / minViewport) * 100}vmin`;
  },

  // 将像素转换为vmax单位
  pxToVmax: (px: number, maxViewport: number = 1920) => {
    return `${(px / maxViewport) * 100}vmax`;
  },

  // 计算响应式字体大小（结合rem和vw）
  responsiveFontSize: (minSize: number, maxSize: number) => {
    const minWidth = breakpoints.sm;
    const maxWidth = breakpoints.xl;

    const slope = (maxSize - minSize) / (maxWidth - minWidth);
    const yAxisIntersection = -minWidth * slope + minSize;

    return `clamp(${minSize}px, ${yAxisIntersection.toFixed(4)}px + ${(
      slope * 100
    ).toFixed(4)}vw, ${maxSize}px)`;
  },
};

// 移动端优化助手
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
  shouldSimplifyUI: () => {
    if (typeof window === "undefined") return false;

    // 检查屏幕尺寸和设备类型
    const isSmallScreen = window.innerWidth < breakpoints.md;
    const isMobileDevice = deviceDetection.isMobile();
    const isLowPowerMode =
      "navigator" in window &&
      "getBattery" in navigator &&
      (navigator as any).getBattery &&
      (navigator as any)
        .getBattery()
        .then(
          (battery: any) => battery.charging === false && battery.level < 0.2
        );

    return isSmallScreen || isMobileDevice || isLowPowerMode;
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
};

// 响应式图片配置
export const responsiveImages = {
  // 获取响应式图片尺寸
  getSizes: (
    imageType: "thumbnail" | "banner" | "gallery" | "avatar" = "thumbnail"
  ) => {
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
  ) => {
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

// 响应式布局组件配置
export const responsiveComponents = {
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

// 导出默认配置
export const defaultResponsiveConfig = {
  breakpoints,
  mediaQuery,
  deviceDetection,
  responsiveLayout,
  viewportUnits,
  mobileOptimization,
  responsiveImages,
  responsiveComponents,
};
