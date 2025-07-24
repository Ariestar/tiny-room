/**
 * 统一响应式设计 Hook
 * Unified Responsive Design Hook
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  breakpoints,
  type Breakpoint,
  type BreakpointKey,
  getCurrentBreakpoint,
  matchesBreakpoint,
  getResponsiveValue,
  deviceDetection,
  responsiveLayout,
  mobileOptimization,
} from "@/lib/ui/responsive";

export interface ResponsiveState {
  currentBreakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isRetinaDisplay: boolean;
  windowWidth: number;
  windowHeight: number;
  orientation: "portrait" | "landscape";
  devicePixelRatio: number;
}

export interface MobileOptimizationConfig {
  /** 是否为移动设备 */
  isMobile: boolean;
  /** 是否为平板设备 */
  isTablet: boolean;
  /** 是否为桌面设备 */
  isDesktop: boolean;
  /** 屏幕宽度 */
  screenWidth: number;
  /** 屏幕高度 */
  screenHeight: number;
  /** 是否为触控设备 */
  isTouchDevice: boolean;
  /** 是否支持悬停 */
  supportsHover: boolean;
  /** 设备像素比 */
  devicePixelRatio: number;
  /** 是否为横屏 */
  isLandscape: boolean;
  /** 是否为竖屏 */
  isPortrait: boolean;
  /** 网络连接类型 */
  connectionType: string;
  /** 是否为慢速网络 */
  isSlowConnection: boolean;
}

/**
 * 响应式状态 Hook
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === "undefined") {
      return {
        currentBreakpoint: "lg" as Breakpoint,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        isRetinaDisplay: false,
        windowWidth: 1024,
        windowHeight: 768,
        orientation: "landscape" as const,
        devicePixelRatio: 1,
      };
    }

    return {
      currentBreakpoint: getCurrentBreakpoint(),
      isMobile: window.innerWidth < breakpoints.md,
      isTablet:
        window.innerWidth >= breakpoints.md &&
        window.innerWidth < breakpoints.lg,
      isDesktop: window.innerWidth >= breakpoints.lg,
      isTouchDevice: deviceDetection.isTouchDevice(),
      isRetinaDisplay: deviceDetection.isRetinaDisplay(),
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      orientation: deviceDetection.getOrientation(),
      devicePixelRatio: deviceDetection.getDevicePixelRatio(),
    };
  });

  const updateState = useCallback(() => {
    if (typeof window === "undefined") return;

    setState({
      currentBreakpoint: getCurrentBreakpoint(),
      isMobile: window.innerWidth < breakpoints.md,
      isTablet:
        window.innerWidth >= breakpoints.md &&
        window.innerWidth < breakpoints.lg,
      isDesktop: window.innerWidth >= breakpoints.lg,
      isTouchDevice: deviceDetection.isTouchDevice(),
      isRetinaDisplay: deviceDetection.isRetinaDisplay(),
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      orientation: deviceDetection.getOrientation(),
      devicePixelRatio: deviceDetection.getDevicePixelRatio(),
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 100); // 防抖
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateState);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateState);
    };
  }, [updateState]);

  return state;
}

/**
 * 断点匹配 Hook
 */
export function useBreakpoint() {
  const { currentBreakpoint, windowWidth } = useResponsive();

  const matches = useCallback((breakpoint: BreakpointKey) => {
    return matchesBreakpoint(breakpoint);
  }, []);

  const isAbove = useCallback(
    (breakpoint: BreakpointKey) => {
      return windowWidth >= breakpoints[breakpoint];
    },
    [windowWidth]
  );

  const isBelow = useCallback(
    (breakpoint: BreakpointKey) => {
      return windowWidth < breakpoints[breakpoint];
    },
    [windowWidth]
  );

  const isBetween = useCallback(
    (start: BreakpointKey, end: BreakpointKey) => {
      return (
        windowWidth >= breakpoints[start] && windowWidth < breakpoints[end]
      );
    },
    [windowWidth]
  );

  return {
    current: currentBreakpoint,
    matches,
    isAbove,
    isBelow,
    isBetween,
    // 便捷检查
    isMobile: windowWidth < breakpoints.md,
    isTablet: isBetween("md", "lg"),
    isDesktop: isAbove("lg"),
  };
}

/**
 * 响应式值选择 Hook
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  defaultValue: T
): T {
  const { currentBreakpoint } = useResponsive();

  return useMemo(() => {
    return getResponsiveValue(values, defaultValue);
  }, [values, defaultValue, currentBreakpoint]);
}

/**
 * 移动端优化 Hook
 */
export function useMobileOptimization(): MobileOptimizationConfig {
  const responsive = useResponsive();
  const [networkInfo, setNetworkInfo] = useState<{
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  } | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("connection" in navigator))
      return;

    const connection = (navigator as any).connection;
    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      };

      updateNetworkInfo();
      connection.addEventListener("change", updateNetworkInfo);

      return () => {
        connection.removeEventListener("change", updateNetworkInfo);
      };
    }
  }, []);

  return useMemo(
    () => ({
      isMobile: responsive.isMobile,
      isTablet: responsive.isTablet,
      isDesktop: responsive.isDesktop,
      screenWidth: responsive.windowWidth,
      screenHeight: responsive.windowHeight,
      isTouchDevice: responsive.isTouchDevice,
      supportsHover: !responsive.isTouchDevice,
      devicePixelRatio: responsive.devicePixelRatio,
      isLandscape: responsive.orientation === "landscape",
      isPortrait: responsive.orientation === "portrait",
      connectionType: networkInfo?.effectiveType || "unknown",
      isSlowConnection: networkInfo
        ? ["slow-2g", "2g", "3g"].includes(networkInfo.effectiveType)
        : false,
    }),
    [responsive, networkInfo]
  );
}

/**
 * 响应式布局 Hook
 */
export function useResponsiveLayout() {
  const { windowWidth } = useResponsive();

  return useMemo(
    () => ({
      columns: responsiveLayout.getColumnCount(windowWidth),
      spacing: responsiveLayout.getSpacing(windowWidth),
      fontSize: (baseSize: number = 16) =>
        responsiveLayout.getFontSize(windowWidth, baseSize),
      imageSize: (containerWidth: number = 1200) =>
        responsiveLayout.getImageSize(windowWidth, containerWidth),
      gridConfig: responsiveLayout.getGridConfig(windowWidth),
    }),
    [windowWidth]
  );
}

/**
 * 移动端动画配置 Hook
 */
export function useMobileAnimationConfig() {
  const { isMobile, isTouchDevice } = useMobileOptimization();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return useMemo(() => {
    const shouldReduceMotion = prefersReducedMotion || isMobile;

    return {
      shouldAnimate: !prefersReducedMotion,
      reducedMotion: shouldReduceMotion,
      duration: shouldReduceMotion ? 0.2 : 0.3,
      disableParallax: isMobile || isTouchDevice,
      disableAutoplay: isMobile,
      enableHardwareAcceleration: !isMobile,
    };
  }, [prefersReducedMotion, isMobile, isTouchDevice]);
}

/**
 * 移动端触控优化 Hook
 */
export function useMobileTouchOptimization() {
  const { isTouchDevice, isMobile } = useMobileOptimization();

  return useMemo(
    () => ({
      isTouchDevice,
      minTouchTarget: isTouchDevice ? 44 : 32, // 44px for touch, 32px for mouse
      touchTargetStyle: isTouchDevice
        ? {
            minWidth: "44px",
            minHeight: "44px",
            padding: "12px",
          }
        : {
            minWidth: "32px",
            minHeight: "32px",
            padding: "8px",
          },
      spacing: isMobile
        ? {
            xs: 4,
            sm: 8,
            md: 12,
            lg: 16,
            xl: 24,
          }
        : {
            xs: 8,
            sm: 12,
            md: 16,
            lg: 24,
            xl: 32,
          },
      shouldSimplifyUI: mobileOptimization.shouldSimplifyUI(),
    }),
    [isTouchDevice, isMobile]
  );
}

/**
 * 移动端布局优化 Hook
 */
export function useMobileLayoutOptimization() {
  const responsive = useResponsive();
  const layout = useResponsiveLayout();
  const touch = useMobileTouchOptimization();

  return useMemo(
    () => ({
      // 布局配置
      layout: {
        columns: layout.columns,
        spacing: layout.spacing,
        containerPadding: responsive.isMobile ? 16 : 24,
        maxWidth: responsive.isMobile ? "100%" : "1200px",
      },

      // 字体配置
      typography: {
        baseSize: responsive.isMobile ? 14 : 16,
        headingScale: responsive.isMobile ? 1.2 : 1.25,
        lineHeight: responsive.isMobile ? 1.4 : 1.6,
      },

      // 交互配置
      interaction: {
        ...touch,
        hoverEnabled: !responsive.isTouchDevice,
        focusVisible: true,
      },

      // 性能配置
      performance: {
        lazyLoadThreshold: responsive.isMobile ? "50px" : "100px",
        imageQuality: responsive.isMobile ? 75 : 85,
        enableAnimations: !responsive.isMobile,
      },
    }),
    [responsive, layout, touch]
  );
}

/**
 * 移动端性能优化 Hook
 */
export function useMobilePerformanceOptimization() {
  const mobile = useMobileOptimization();
  const animation = useMobileAnimationConfig();

  return useMemo(
    () => ({
      // 图片优化
      images: {
        quality: mobile.isSlowConnection ? 60 : mobile.isMobile ? 75 : 85,
        format: "webp",
        lazyLoad: true,
        placeholder: "blur",
        sizes: mobile.isMobile ? "100vw" : "50vw",
      },

      // 动画优化
      animations: {
        ...animation,
        stagger: animation.reducedMotion ? 0 : 0.1,
        parallax: !mobile.isMobile && !animation.disableParallax,
      },

      // 资源优化
      resources: {
        preload: !mobile.isSlowConnection,
        prefetch: mobile.isDesktop && !mobile.isSlowConnection,
        codesplitting: true,
        bundleSize: mobile.isMobile ? "small" : "normal",
      },

      // 网络优化
      network: {
        timeout: mobile.isSlowConnection ? 10000 : 5000,
        retry: mobile.isSlowConnection ? 1 : 3,
        compression: true,
        caching: true,
      },
    }),
    [mobile, animation]
  );
}

/**
 * 方向变化 Hook
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    () => {
      if (typeof window === "undefined") return "portrait";
      return deviceDetection.getOrientation();
    }
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(deviceDetection.getOrientation());
    };

    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("resize", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
}

/**
 * 容器查询 Hook (实验性)
 */
export function useContainerQuery(containerRef: React.RefObject<HTMLElement>) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return {
    width: containerWidth,
    height: containerHeight,
    isSmall: containerWidth < 400,
    isMedium: containerWidth >= 400 && containerWidth < 800,
    isLarge: containerWidth >= 800,
  };
}
