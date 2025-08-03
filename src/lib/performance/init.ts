"use client";

import { initWebVitalsMonitoring } from "@/lib/analytics/webVitals";
import {
  preloadCriticalComponents,
  getLoadingStrategy,
  prefetchDNS,
  preconnect,
} from "./optimization";

// 性能初始化配置
interface PerformanceConfig {
  enableWebVitals?: boolean;
  enablePreloading?: boolean;
  enableDNSPrefetch?: boolean;
  enablePreconnect?: boolean;
  enableComponentPreload?: boolean;
  webVitalsConfig?: {
    reportInterval?: number;
    enableAutoReport?: boolean;
    enableConsoleLog?: boolean;
  };
}

// 默认配置
const defaultConfig: PerformanceConfig = {
  enableWebVitals: true,
  enablePreloading: true,
  enableDNSPrefetch: true,
  enablePreconnect: true,
  enableComponentPreload: true,
  webVitalsConfig: {
    reportInterval: 30000,
    enableAutoReport: true,
    enableConsoleLog: process.env.NODE_ENV === "development",
  },
};

// 初始化性能监控
export function initPerformanceMonitoring(config: PerformanceConfig = {}) {
  const finalConfig = { ...defaultConfig, ...config };

  if (typeof window === "undefined") return;

  // 初始化 Web Vitals 监控
  if (finalConfig.enableWebVitals) {
    initWebVitalsMonitoring(finalConfig.webVitalsConfig);
  }

  // DNS 预解析
  if (finalConfig.enableDNSPrefetch) {
    const domains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "api.github.com",
      "avatars.githubusercontent.com",
    ];

    domains.forEach((domain) => prefetchDNS(domain));
  }

  // 预连接重要资源
  if (finalConfig.enablePreconnect) {
    preconnect("https://fonts.googleapis.com");
    preconnect("https://fonts.gstatic.com", true);
  }

  // 预加载关键组件
  if (finalConfig.enableComponentPreload) {
    preloadCriticalComponents();
  }

  // 基于网络状况的自适应加载
  if (finalConfig.enablePreloading) {
    const strategy = getLoadingStrategy();

    // 根据策略调整行为
    if (!strategy.shouldPreload) {
      console.log("Performance: Preloading disabled due to network conditions");
    }

    if (strategy.shouldLazyLoad) {
      console.log(
        "Performance: Lazy loading enabled due to network conditions"
      );
    }

    // 存储策略到全局变量供其他组件使用
    (window as any).__LOADING_STRATEGY__ = strategy;
  }

  // 监听页面可见性变化
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // 页面变为可见时的优化
      console.log("Performance: Page became visible");
    } else {
      // 页面变为隐藏时的优化
      console.log("Performance: Page became hidden");
    }
  });

  // 监听网络状态变化
  if ("connection" in navigator) {
    const connection = (navigator as any).connection;

    const updateNetworkStatus = () => {
      const strategy = getLoadingStrategy();
      (window as any).__LOADING_STRATEGY__ = strategy;

      console.log("Performance: Network status changed", {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      });
    };

    connection.addEventListener("change", updateNetworkStatus);
  }

  // 内存压力监控
  if ("memory" in performance) {
    const checkMemoryUsage = () => {
      const memory = (performance as any).memory;
      const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;

      if (usageRatio > 0.8) {
        console.warn("Performance: High memory usage detected", {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + "MB",
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + "MB",
          ratio: Math.round(usageRatio * 100) + "%",
        });

        // 触发垃圾回收建议
        if ("gc" in window) {
          (window as any).gc();
        }
      }
    };

    // 每30秒检查一次内存使用情况
    setInterval(checkMemoryUsage, 30000);
  }

  console.log("Performance: Monitoring initialized", finalConfig);
}

// 页面加载完成后的优化
export function onPageLoadComplete() {
  if (typeof window === "undefined") return;

  // 预加载下一页可能需要的资源
  const preloadNextPageResources = () => {
    // 根据当前页面预测下一页
    const currentPath = window.location.pathname;

    if (currentPath === "/") {
      // 首页用户可能访问博客
      import("@/app/(public)/blog/page");
    } else if (
      currentPath.startsWith("/blog") &&
      !currentPath.includes("/blog/")
    ) {
      // 博客列表页用户可能访问具体文章
      import("@/components/feature/blog/RelatedPosts");
    }
  };

  // 在空闲时间执行预加载
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(preloadNextPageResources, { timeout: 5000 });
  } else {
    setTimeout(preloadNextPageResources, 2000);
  }
}

// 页面卸载时的清理
export function onPageUnload() {
  // 清理定时器、事件监听器等
  console.log("Performance: Page unloading, cleaning up resources");
}

// 错误监控
export function initErrorMonitoring() {
  if (typeof window === "undefined") return;

  // 全局错误处理
  window.addEventListener("error", (event) => {
    console.error("Performance: Global error", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
  });

  // Promise 错误处理
  window.addEventListener("unhandledrejection", (event) => {
    console.error("Performance: Unhandled promise rejection", {
      reason: event.reason,
    });
  });

  // 资源加载错误
  window.addEventListener(
    "error",
    (event) => {
      if (event.target !== window) {
        console.error("Performance: Resource loading error", {
          element: event.target,
          source: (event.target as any)?.src || (event.target as any)?.href,
        });
      }
    },
    true
  );
}

// 性能指标收集
export function collectPerformanceMetrics() {
  if (typeof window === "undefined" || !("performance" in window)) return;

  const navigation = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType("paint");

  const metrics = {
    // 导航时间
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ssl:
      navigation.secureConnectionStart > 0
        ? navigation.connectEnd - navigation.secureConnectionStart
        : 0,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domParse: navigation.domContentLoadedEventStart - navigation.responseEnd,
    domReady:
      navigation.domContentLoadedEventEnd -
      navigation.domContentLoadedEventStart,

    // 绘制时间
    fcp: paint.find((p) => p.name === "first-contentful-paint")?.startTime || 0,

    // 总时间
    total: navigation.loadEventEnd - navigation.navigationStart,
  };

  console.log("Performance: Metrics collected", metrics);
  return metrics;
}

// 自动初始化（在客户端）
if (typeof window !== "undefined") {
  // 页面加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPerformanceMonitoring();
      initErrorMonitoring();
    });
  } else {
    initPerformanceMonitoring();
    initErrorMonitoring();
  }

  // 页面完全加载后收集指标
  window.addEventListener("load", () => {
    setTimeout(() => {
      collectPerformanceMetrics();
      onPageLoadComplete();
    }, 1000);
  });

  // 页面卸载时清理
  window.addEventListener("beforeunload", onPageUnload);
}
