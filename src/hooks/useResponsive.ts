"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Breakpoint,
  breakpoints,
  getCurrentBreakpoint,
  matchesBreakpoint,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  isRetinaDisplay,
  getResponsiveValue,
} from "@/lib/breakpoints";

// 响应式状态接口
interface ResponsiveState {
  currentBreakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  isRetinaDisplay: boolean;
  windowWidth: number;
  windowHeight: number;
}

// 主要的响应式Hook
export const useResponsive = () => {
  const [state, setState] = useState<ResponsiveState>(() => ({
    currentBreakpoint: "lg", // SSR默认值
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouchDevice: false,
    isRetinaDisplay: false,
    windowWidth: 1024,
    windowHeight: 768,
  }));

  const updateState = useCallback(() => {
    if (typeof window === "undefined") return;

    setState({
      currentBreakpoint: getCurrentBreakpoint(),
      isMobile: isMobile(),
      isTablet: isTablet(),
      isDesktop: isDesktop(),
      isTouchDevice: isTouchDevice(),
      isRetinaDisplay: isRetinaDisplay(),
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // 初始化状态
    updateState();

    // 监听窗口大小变化
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 100); // 防抖
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", updateState);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", updateState);
      clearTimeout(timeoutId);
    };
  }, [updateState]);

  // 检查是否匹配特定断点
  const matches = useCallback((breakpoint: Breakpoint) => {
    return matchesBreakpoint(breakpoint);
  }, []);

  // 获取响应式值
  const getValue = useCallback(
    <T>(values: Partial<Record<Breakpoint, T>>, fallback: T): T => {
      return getResponsiveValue(values, fallback);
    },
    []
  );

  return {
    ...state,
    matches,
    getValue,
  };
};

// 断点匹配Hook
export const useBreakpoint = (breakpoint: Breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(
      `(min-width: ${breakpoints[breakpoint]}px)`
    );

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [breakpoint]);

  return matches;
};

// 媒体查询Hook
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};

// 移动端检测Hook
export const useMobile = () => {
  const { isMobile } = useResponsive();
  return isMobile;
};

// 触摸设备检测Hook
export const useTouch = () => {
  const { isTouchDevice } = useResponsive();
  return isTouchDevice;
};

// 方向检测Hook
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOrientation = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  return orientation;
};

// 安全区域Hook
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateSafeArea = () => {
      const computedStyle = getComputedStyle(document.documentElement);

      setSafeArea({
        top: parseInt(
          computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0"
        ),
        right: parseInt(
          computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0"
        ),
        bottom: parseInt(
          computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0"
        ),
        left: parseInt(
          computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0"
        ),
      });
    };

    updateSafeArea();
    window.addEventListener("resize", updateSafeArea);

    return () => {
      window.removeEventListener("resize", updateSafeArea);
    };
  }, []);

  return safeArea;
};

// 视口尺寸Hook
export const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: 1024,
    height: 768,
    scrollY: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        scrollY: window.scrollY,
      });
    };

    updateViewport();

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateViewport, 100);
    };

    const handleScroll = () => {
      setViewport((prev) => ({
        ...prev,
        scrollY: window.scrollY,
      }));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return viewport;
};

// 响应式类名生成Hook
export const useResponsiveClasses = () => {
  const { currentBreakpoint, isMobile, isTablet, isDesktop, isTouchDevice } =
    useResponsive();

  const getClasses = useCallback(
    (
      classes: Partial<
        Record<Breakpoint | "mobile" | "tablet" | "desktop" | "touch", string>
      >
    ): string => {
      const activeClasses: string[] = [];

      // 断点特定类名
      if (classes[currentBreakpoint]) {
        activeClasses.push(classes[currentBreakpoint]!);
      }

      // 设备类型类名
      if (isMobile && classes.mobile) {
        activeClasses.push(classes.mobile);
      }
      if (isTablet && classes.tablet) {
        activeClasses.push(classes.tablet);
      }
      if (isDesktop && classes.desktop) {
        activeClasses.push(classes.desktop);
      }
      if (isTouchDevice && classes.touch) {
        activeClasses.push(classes.touch);
      }

      return activeClasses.join(" ");
    },
    [currentBreakpoint, isMobile, isTablet, isDesktop, isTouchDevice]
  );

  return {
    getClasses,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
  };
};

// 响应式样式Hook
export const useResponsiveStyles = () => {
  const { currentBreakpoint } = useResponsive();

  const getStyles = useCallback(
    <T>(
      styles: Partial<Record<Breakpoint, T>>,
      fallback?: T
    ): T | undefined => {
      return getResponsiveValue(styles, fallback);
    },
    []
  );

  return { getStyles, currentBreakpoint };
};

// 设备特性检测Hook
export const useDeviceFeatures = () => {
  const [features, setFeatures] = useState({
    hasTouch: false,
    hasHover: false,
    hasPointer: false,
    supportsWebP: false,
    supportsAVIF: false,
    prefersReducedMotion: false,
    prefersDarkMode: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkFeatures = async () => {
      // 检查WebP支持
      const checkWebP = () => {
        return new Promise<boolean>((resolve) => {
          const webP = new Image();
          webP.onload = webP.onerror = () => resolve(webP.height === 2);
          webP.src =
            "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        });
      };

      // 检查AVIF支持
      const checkAVIF = () => {
        return new Promise<boolean>((resolve) => {
          const avif = new Image();
          avif.onload = avif.onerror = () => resolve(avif.height === 2);
          avif.src =
            "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
        });
      };

      const [supportsWebP, supportsAVIF] = await Promise.all([
        checkWebP(),
        checkAVIF(),
      ]);

      setFeatures({
        hasTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
        hasHover: window.matchMedia("(hover: hover)").matches,
        hasPointer: window.matchMedia("(pointer: fine)").matches,
        supportsWebP,
        supportsAVIF,
        prefersReducedMotion: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches,
        prefersDarkMode: window.matchMedia("(prefers-color-scheme: dark)")
          .matches,
      });
    };

    checkFeatures();
  }, []);

  return features;
};
