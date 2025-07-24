"use client";

import { useState, useEffect } from "react";
import { breakpoints } from "@/lib/ui/responsive";

type BreakpointKey = keyof typeof breakpoints;

/**
 * 响应式断点Hook
 * 用于检测当前活动的断点
 */
export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<BreakpointKey>("xs");
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    // 服务器端不执行
    if (typeof window === "undefined") return;

    // 初始化窗口尺寸
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);

    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowWidth(width);
      setWindowHeight(height);

      // 按照断点值从大到小排序
      const sortedBreakpoints = Object.entries(breakpoints)
        .sort(([, valueA], [, valueB]) => valueB - valueA)
        .map(([key]) => key as BreakpointKey);

      // 找到第一个小于等于当前窗口宽度的断点
      for (const bp of sortedBreakpoints) {
        if (width >= breakpoints[bp]) {
          setCurrentBreakpoint(bp);
          return;
        }
      }

      // 如果没有找到匹配的断点，设置为最小断点
      setCurrentBreakpoint("xs");
    };

    // 初始化断点
    updateBreakpoint();

    // 监听窗口大小变化
    window.addEventListener("resize", updateBreakpoint);

    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  // 检查是否匹配特定断点
  const isAbove = (breakpoint: BreakpointKey): boolean => {
    return windowWidth >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: BreakpointKey): boolean => {
    return windowWidth < breakpoints[breakpoint];
  };

  const isEqual = (breakpoint: BreakpointKey): boolean => {
    const breakpointKeys = Object.keys(breakpoints) as BreakpointKey[];
    const index = breakpointKeys.indexOf(breakpoint);
    const nextBreakpoint = breakpointKeys[index + 1];

    const min = breakpoints[breakpoint];
    const max = nextBreakpoint ? breakpoints[nextBreakpoint] - 1 : Infinity;

    return windowWidth >= min && windowWidth <= max;
  };

  const isBetween = (min: BreakpointKey, max: BreakpointKey): boolean => {
    return windowWidth >= breakpoints[min] && windowWidth < breakpoints[max];
  };

  // 检查是否为移动设备
  const isMobile = (): boolean => {
    return windowWidth < breakpoints.md;
  };

  // 检查是否为平板设备
  const isTablet = (): boolean => {
    return windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  };

  // 检查是否为桌面设备
  const isDesktop = (): boolean => {
    return windowWidth >= breakpoints.lg;
  };

  return {
    // 当前断点
    breakpoint: currentBreakpoint,
    windowWidth,
    windowHeight,

    // 断点检查函数
    isAbove,
    isBelow,
    isEqual,
    isBetween,

    // 设备类型检查
    isMobile,
    isTablet,
    isDesktop,

    // 常用断点检查
    isXs: isEqual("xs"),
    isSm: isEqual("sm"),
    isMd: isEqual("md"),
    isLg: isEqual("lg"),
    isXl: isEqual("xl"),
    is2Xl: isEqual("2xl"),

    // 断点值
    breakpoints,
  };
}

/**
 * 响应式值Hook
 * 根据当前断点返回对应的值
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  defaultValue: T
): T {
  const { breakpoint } = useBreakpoint();

  // 断点优先级顺序（从当前断点向下查找）
  const breakpointKeys = Object.keys(breakpoints) as BreakpointKey[];
  const currentIndex = breakpointKeys.indexOf(breakpoint);
  const relevantBreakpoints = breakpointKeys
    .slice(0, currentIndex + 1)
    .reverse();

  // 查找最接近当前断点的值
  for (const bp of relevantBreakpoints) {
    if (bp in values) {
      return values[bp] as T;
    }
  }

  // 如果没有找到匹配的断点值，返回默认值
  return defaultValue;
}

/**
 * 响应式布局Hook
 * 提供常用的响应式布局配置
 */
export function useResponsiveLayout() {
  const { windowWidth, isMobile, isTablet, isDesktop } = useBreakpoint();

  // 获取响应式列数
  const getColumnCount = () => {
    if (windowWidth < breakpoints.sm) return 1; // 手机竖屏
    if (windowWidth < breakpoints.md) return 2; // 手机横屏
    if (windowWidth < breakpoints.lg) return 3; // 平板竖屏
    if (windowWidth < breakpoints.xl) return 4; // 平板横屏/小型笔记本
    return 5; // 桌面显示器
  };

  // 获取响应式间距
  const getSpacing = () => {
    if (windowWidth < breakpoints.sm) return 8; // 手机竖屏
    if (windowWidth < breakpoints.md) return 12; // 手机横屏
    if (windowWidth < breakpoints.lg) return 16; // 平板竖屏
    if (windowWidth < breakpoints.xl) return 20; // 平板横屏/小型笔记本
    return 24; // 桌面显示器
  };

  // 获取响应式字体大小
  const getFontSize = (baseSize: number = 16) => {
    if (windowWidth < breakpoints.sm) return baseSize * 0.875; // 手机竖屏
    if (windowWidth < breakpoints.md) return baseSize * 0.9375; // 手机横屏
    if (windowWidth < breakpoints.lg) return baseSize; // 平板竖屏
    if (windowWidth < breakpoints.xl) return baseSize * 1.0625; // 平板横屏/小型笔记本
    return baseSize * 1.125; // 桌面显示器
  };

  // 获取响应式容器宽度
  const getContainerWidth = () => {
    if (windowWidth < breakpoints.sm) return "100%";
    if (windowWidth < breakpoints.md) return "540px";
    if (windowWidth < breakpoints.lg) return "720px";
    if (windowWidth < breakpoints.xl) return "960px";
    if (windowWidth < breakpoints["2xl"]) return "1140px";
    return "1320px";
  };

  return {
    columnCount: getColumnCount(),
    spacing: getSpacing(),
    fontSize: getFontSize(),
    containerWidth: getContainerWidth(),
    isMobile,
    isTablet,
    isDesktop,
  };
}

/**
 * 响应式方向Hook
 * 检测屏幕方向（横屏/竖屏）
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? "landscape" : "portrait");
    };

    // 初始化方向
    updateOrientation();

    // 监听窗口大小变化
    window.addEventListener("resize", updateOrientation);

    // 监听方向变化事件（移动设备）
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener("change", updateOrientation);
    }

    return () => {
      window.removeEventListener("resize", updateOrientation);
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener(
          "change",
          updateOrientation
        );
      }
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === "portrait",
    isLandscape: orientation === "landscape",
  };
}
